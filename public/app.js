const TOKEN_KEY = 'movidesk_token';
let chartInstance = null;

// Inicializa a Tela
document.addEventListener("DOMContentLoaded", () => {
  const hje = new Date().toISOString().split("T")[0];
  document.getElementById("startDate").value = hje;
  document.getElementById("endDate").value = hje;

  document.getElementById("btn-fetch").addEventListener("click", buscarDados);
  document.getElementById("btn-save-cookie").addEventListener("click", atualizarCookie);
});

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHHMM(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}min`;
}

// Função para comunicar com a API do servidor e sobreescrever o cookie
async function atualizarCookie() {
  const cookieString = document.getElementById("rawCookieInput").value.trim();
  if (!cookieString) {
    alert("⚠️ Cole o texto bruto do cookie antes de salvar!");
    return;
  }

  try {
    const res = await fetch('/api/proxy/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookieString })
    });
    if (res.ok) {
      alert("✅ Sessão do Movidesk configurada com sucesso! Você já pode realizar buscas ou correções.");
      document.getElementById("rawCookieInput").value = "";
    } else {
      alert("❌ Falha ao tentar atualizar o cookie no servidor.");
    }
  } catch (e) {
    alert("❌ Erro ao comunicar com o servidor Proxy local:\n" + e.message);
  }
}

// Algoritmo de Análise Avançada
function analisarRegistros(registros) {
  const problemas = [];
  const registrosValidos = [];

  // 🧱 helper: converter HH:mm → minutos
  function toMin(time) {
    if (!time || typeof time !== "string") return null;

    const [h, m] = time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;

    return h * 60 + m;
  }

  // 🧱 normalização + validação
  registros.forEach((r, index) => {
    const inicioMin = toMin(r.inicio);
    const fimMin = toMin(r.fim);

    // ❌ inválido
    if (inicioMin === null || fimMin === null) {
      problemas.push({ tipo: "invalido", index, msg: `❌ Registro inválido em índice ${index}` });
      return;
    }

    // ❌ fim antes do início
    if (fimMin < inicioMin) {
      problemas.push({ tipo: "duracao_negativa", index, msg: `❌ Fim menor que início (${r.inicio} - ${r.fim})` });
      return;
    }

    registrosValidos.push({ ...r, inicioMin, fimMin });
  });

  // 🔽 ordenar corretamente por tempo
  registrosValidos.sort((a, b) => a.inicioMin - b.inicioMin);

  // 🔁 análise sequencial
  for (let i = 0; i < registrosValidos.length; i++) {
    const atual = registrosValidos[i];
    const prox = registrosValidos[i + 1];

    // 🧱 duração zero (suspeito)
    if (atual.inicioMin === atual.fimMin) {
      problemas.push({ tipo: "duracao_zero", index: i, record: atual, msg: `⚠️ Duração zerada em ${atual.inicio}-${atual.fim}` });
    }

    if (!prox) break;

    // ❌ SOBREPOSIÇÃO
    if (atual.fimMin > prox.inicioMin) {
      problemas.push({
        tipo: "sobreposicao", index: i, record: atual,
        msg: `❌ Sobreposição: ${atual.inicio}-${atual.fim} conflita com ${prox.inicio}-${prox.fim}`
      });
    }

    // ⚠️ GAP (buraco)
    if (atual.fimMin < prox.inicioMin) {
      const gap = prox.inicioMin - atual.fimMin;
      problemas.push({ tipo: "gap", index: i, record: atual, minutos: gap, msg: `⚠️ Gap de ${gap} min entre ${atual.fim} e ${prox.inicio}` });
    }

    // ⚠️ DUPLICIDADE
    if (atual.inicioMin === prox.inicioMin && atual.fimMin === prox.fimMin) {
      problemas.push({ tipo: "duplicado", index: i, record: atual, msg: `🔁 Registros duplicados em ${atual.inicio}-${atual.fim}` });
    }
  }

  // 📊 resumo útil
  const resumo = {
    totalRegistros: registros.length,
    validos: registrosValidos.length,
    problemas: problemas.length,
    totalGapMin: problemas.filter(p => p.tipo === "gap").reduce((acc, p) => acc + p.minutos, 0)
  };

  return { problemas, registrosOrdenados: registrosValidos, resumo };
}

// Inteceptador e Chamador via Proxy
async function buscarDados() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  toggleLoading(true);

  try {
    // Ping/Session keep-alive opcional rodando no fundo
    fetch('/api/proxy/session', {
      method: 'POST'
    }).catch(() => { });

    // Busca dados via Proxy Local, burlando o CORS elegantemente (sem token via JSON pois está hardcoded)
    // Formata datas para o Movidesk (DD/MM/YYYY) se o servidor exigir, embora o proxy receba YYYY-MM-DD
    const res = await fetch('/api/proxy/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate })
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const message = errorJson.error || `HTTP ${res.status}`;
      throw new Error(`Falha no Proxy: ${message}`);
    }

    const registros = await res.json();
    processarDados(registros);

  } catch (e) {
    alert(`❌ Erro de comunicação:\n${e.message}`);
    console.error(e);
  } finally {
    toggleLoading(false);
  }
}

function processarDados(payload) {
  // Extract real array format based on Movidesk API
  const registrosOriginais = Array.isArray(payload) ? payload : (payload.list || []);

  // Transform real keys (periodStart/periodEnd) to what the algorithm expects (inicio/fim)
  const registros = registrosOriginais.map(r => ({
    inicio: r.periodStart || r.startTime || r.inicio,
    fim: r.periodEnd || r.endTime || r.fim,
    categoria: r.category || r.categoria || "Outros",
    ...r
  }));

  let totalMin = 0;
  const porCategoria = {};

  registros.forEach(r => {
    if (!r.inicio || !r.fim) return;

    const inicio = timeToMinutes(r.inicio);
    const fim = timeToMinutes(r.fim);
    const duracao = fim - inicio;
    totalMin += duracao;

    const cat = r.categoria || "Outros";
    porCategoria[cat] = (porCategoria[cat] || 0) + duracao;
  });

  document.getElementById("total-time").innerText = minutesToHHMM(totalMin);

  // Problemas e Gaps
  const analise = analisarRegistros(registros);
  const cardProblemas = document.getElementById("problemas-card");
  const listaHtml = document.getElementById("lista-problemas");

  listaHtml.innerHTML = "";

  if (analise.problemas.length > 0 || analise.resumo.totalGapMin > 0) {
    cardProblemas.classList.remove("hidden");
    const summaryLi = document.createElement("li");
    summaryLi.style.color = "#fff";
    summaryLi.style.fontWeight = "bold";
    summaryLi.innerText = `🔍 Resumo: ${analise.resumo.validos}/${analise.resumo.totalRegistros} válidos | ${analise.resumo.totalGapMin} min livres (buracos)`;
    listaHtml.appendChild(summaryLi);

    analise.problemas.forEach(p => {
      const li = document.createElement("li");
      li.innerText = p.msg;

      if (p.record && p.record.ticketId && (p.record.actionNumber || p.record.actionNumber === 0)) {
        const btn = document.createElement("button");
        btn.innerHTML = "✏️ Ajustar";
        btn.className = "btn-primary";
        btn.style.padding = "4px 8px";
        btn.style.marginLeft = "10px";
        btn.style.fontSize = "0.75rem";
        btn.onclick = () => abrirModalEditor(p.record);
        li.appendChild(btn);
      }

      listaHtml.appendChild(li);
    });
  } else {
    cardProblemas.classList.add("hidden");
  }

  renderizarGrafico(porCategoria);
  document.getElementById("results-area").classList.remove("hidden");
}

function renderizarGrafico(porCategoria) {
  const ctx = document.getElementById("grafico").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  Chart.defaults.color = "#a0a0a0";
  Chart.defaults.font.family = "Inter";

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(porCategoria),
      datasets: [{
        label: "Minutos por Categoria",
        data: Object.values(porCategoria),
        backgroundColor: [
          'rgba(255, 138, 0, 0.8)',
          'rgba(229, 46, 113, 0.8)',
          'rgba(0, 255, 170, 0.8)'
        ],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.05)" } },
        x: { grid: { display: false } }
      }
    }
  });
}

function toggleLoading(show) {
  document.getElementById("loader").classList.toggle("hidden", !show);
  if (show) document.getElementById("results-area").classList.add("hidden");
}

// ===================================
// Lógica do Modal de Edição (Ajuste)
// ===================================

let targetRecord = null;

function abrirModalEditor(r) {
  targetRecord = r;
  document.getElementById("modal-ticket").innerText = r.ticketId;
  document.getElementById("modal-action").innerText = r.actionNumber;
  document.getElementById("modal-inicio").value = r.inicio;
  document.getElementById("modal-fim").value = r.fim;

  document.getElementById("edit-modal").classList.remove("hidden");
}

document.getElementById("btn-cancelar").addEventListener("click", () => {
  document.getElementById("edit-modal").classList.add("hidden");
});

document.getElementById("btn-salvar").addEventListener("click", async () => {
  if (!targetRecord) return;
  const novoInicio = document.getElementById("modal-inicio").value;
  const novoFim = document.getElementById("modal-fim").value;

  document.getElementById("modal-loading").classList.remove("hidden");

  try {
    // 1. Puxa a Action completa deste Ticket via JsonGetActions proxy
    const resGet = await fetch(`/api/proxy/ticket/${targetRecord.ticketId}`);
    if (!resGet.ok) throw new Error("Erro de comunicação com JsonGetActions");
    const actionsDesc = await resGet.json();

    // 2. Busca a Action exata e clona (tratando o objeto { actions: { result: [] } } do Movidesk)
    let listActions = [];
    if (Array.isArray(actionsDesc)) listActions = actionsDesc;
    else if (actionsDesc.actions && Array.isArray(actionsDesc.actions.result)) listActions = actionsDesc.actions.result;
    else if (Array.isArray(actionsDesc.actions)) listActions = actionsDesc.actions;

    const currentAction = listActions.find(a => String(a.number) === String(targetRecord.actionNumber) || String(a.Number) === String(targetRecord.actionNumber));
    if (!currentAction) throw new Error(`Ação número ${targetRecord.actionNumber} não encontrada no histórico do ticket.`);

    let apts = currentAction.timeAppointments || currentAction.TimeAppointments || [];

    // Localiza a linha de apontamento específico comparando a string de início original
    const targetApt = apts.find(a => {
      const pStart = String(a.periodStart || a.PeriodStart || "");
      return pStart.includes(targetRecord.inicio);
    });

    if (!targetApt) throw new Error("A data/hora original não bate mais com a nuvem. Abra a página real para corrigir se necessário.");

    // 3. O Movidesk exige receber a versão antiga marcada para deletar
    // Fazemos um clone e adicionamos a regra ToDelete
    const oldApt = JSON.parse(JSON.stringify(targetApt));
    oldApt.ToDelete = true;
    oldApt.toDelete = true;

    // 4. Modifica os tempos no objeto que será mantido
    let oldFormatStart = targetApt.periodStart || targetApt.PeriodStart;
    let oldFormatEnd = targetApt.periodEnd || targetApt.PeriodEnd;

    // Altera a parte 'HH:mm' conservando a Data e Segundos do formato T original do C#
    targetApt.PeriodStart = (oldFormatStart || "").replace(targetRecord.inicio, novoInicio);
    targetApt.PeriodEnd = (oldFormatEnd || "").replace(targetRecord.fim, novoFim);
    targetApt.ToDelete = false;
    targetApt.toDelete = false;

    // Repara o WorkTime
    const dsEnd = new Date(targetApt.PeriodEnd);
    const msDiff = dsEnd - new Date(targetApt.PeriodStart);
    const m = Math.floor(msDiff / 60000);
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    targetApt.WorkTime = `${hh}:${mm}`;
    targetApt.WorkTimeConsumptionHoursTimeSpan = targetApt.WorkTime;

    // Devolve a cópia velha na lista para ser enviada junto
    apts.push(oldApt);

    // 5. Envia para o NodeJS forjar o Form Post complexo
    const rSave = await fetch('/api/proxy/action/save', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId: targetRecord.ticketId,
        actionId: currentAction.id || currentAction.Id,
        actionNumber: currentAction.number || currentAction.Number,
        actionType: currentAction.actionType || currentAction.ActionType || '2',
        description: currentAction.description || currentAction.Description,
        appointments: apts
      })
    });

    const saveResult = await rSave.json();

    // Tenta parsear a resposta interna do Movidesk (que vem no campo 'data' vindo do proxy)
    let innerData = {};
    try { innerData = JSON.parse(saveResult.data); } catch (e) { }

    if (saveResult.status !== 200 || innerData.Success === false) {
      const errMsg = innerData.Message || "Erro desconhecido";
      throw new Error(`Movidesk recusou: ${errMsg}`);
    }

    alert("✅ Apontamento ajustado brilhantemente no Movidesk!");
    document.getElementById("edit-modal").classList.add("hidden");

    // Refresh Panel Automatically
    buscarDados();
  } catch (err) {
    alert("❌ Falha crítica: " + err.message);
  } finally {
    document.getElementById("modal-loading").classList.add("hidden");
  }
});
