const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Servir os arquivos frontend
app.use(express.static(path.join(__dirname, 'public')));

// === DADOS DE AUTENTICAÇÃO (COPIADOS DO NAVEGADOR) ===
const RAW_COOKIE_STRING = `culture=pt-BR; timezoneId=America%2FSao_Paulo; domain=0; _hjSessionUser_1038968=eyJpZCI6IjE4OTZjMGVlLTlhODYtNWMxYS05ZjY2LTkzMDcwZmU4ZTAwNCIsImNyZWF0ZWQiOjE3NjU0NTgyMzI5NzYsImV4aXN0aW5nIjp0cnVlfQ==; _ga=GA1.1.1522481119.1765458212; _ga_P3V5YYDW47=GS2.1.s1774644524$o2$g1$t1774645146$j60$l0$h0; _ga_DZKEXMG9SB=GS2.1.s1774644525$o2$g1$t1774645146$j60$l0$h0; __RequestVerificationToken=EfMxEUSWGMCT-QXOZELRwx0BziHuAIDsr_S-Gks13f3vM76YoiuoloPgqZz2mjF1LZre24MGeUDJbyi7wpBhRfLVI5c1; .ASPXAUTH=81B5FA1734ADC02932E9E5B8188C915971F26D0EF559256D5630CF4C52FDCD66C1C534E9130D2C785FF40ED137D9537890E984F28CEF9FADFBD3B654B414FE1C3586CD04B6AC47DB54C967E3E3C858E2AB72599B57EA931E054110C84FE083EDCC427EA96C5D4693A7C0EF88535A2946481BBC9C65DCA79EEFB48837DC88E275D4A29B6F3AFDD5D9D56132AF00965DB0CCF4D9BFFE4FE9FBCBD7809401D2A57633D89FED18B90CC696452AC59AB7D2B1A6478531942ABF96150E0C3B42FA97965B2A269E1E77B26C8E7098BA8482EC778383D8B32947E7A3881474E1238F1AE681BA3A33098C6B6459846D92C5C3D85817DADC327BEEF246E41127CDDDEAE78D508EDBD9841C8B465CEDDE3F4E0BF10A0275DF21DBB8803A07ECFF6AD25B31448B446C3A360DCD1A7BF7E6D5784DEB225812F84F7DE28F57E68D23F98F9540BFCF1EF7B1934E01859A3CA8BC0507238DF54107352FED81AC2F867F66FFC0865EDE6C45E376B0AE84944277BD68F6DC93A43B02ED3582993FAFB73E6C51A1D34054DC463DE256E42CF7ED2BDEDB5BF45E8CC84704B398054D8A78C19A70C5ABA2DCC06D823FCF58A567C30733F42B60BDEE002FF4E1C6932CC54727AA8A162423866F1E2A34416EE4FBEBBC3B1C8A63AC3BAAE6CF3A987CAC9A6C9A9C57E5D209E31F3368B5FB367886788CBFE497F3971BFDA16CDA291FFAED083CA5EB3850909270BD407E496DCA11A6F3600D26971249F73B9F520D3E9D456E311C37B8AD67A198E97EA4D418DEFFE6621F9A409EB8B60B4C055A25FE1644278B20DE584D3CABBD003782DB2E9DBDEBCD091CFD67541CF997EEBD8AEA1DBC29A1FE1B6E2544379584F079A8AA4FEC0B623AFBF6488F76EB79C6E3141E9B581A087A82F4650BAD9A34C0; Bearer=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNjJmN2ZmMy0yYjcwLTQ2YjItOWJkNy1hM2ZkMzYxYjQ1MzEiLCJ1ZHQiOiJleUpKWkNJNk1URTRNemczTkRnekxDSlVaVzVoYm5SSlpDSTZNakE1TVRNc0lsQmxjbk52YmxSNWNHVWlPakVzSWxCeWIyWnBiR1ZVZVhCbElqb3pMQ0pWYzJWeVRtRnRaU0k2SW5OMWNHOXlkR1V5UUd4bFkzUnZjblJsWXk1amIyMHVZbklpTENKRWFYTndiR0Y1VG1GdFpTSTZJa05oYVc4Z1IyOXRaWE1pTENKQlkyTmxjM05RY205bWFXeGxTV1FpT2pnM09EZzFMQ0pJWVhOQlkyTmxjM05RY205bWFXeGxRV05qWlhOelVuVnNaWE1pT21aaGJITmxMQ0pVYVcxbFdtOXVaVWxrSWpwdWRXeHNMQ0pEY21WaGRHVmtSR0YwWlNJNklqSXdNalV0TURndE1qbFVNVFE2TlRRNk1UVXVOVGt6TnprM055SXNJa052WkdWU1pXWmxjbVZ1WTJVaU9pSXhNVFExTmpVeU16UTNJbjA9IiwiY3RyIjoicHQtQlIiLCJoc3QiOiJsZWN0b3J0ZWMubW92aWRlc2suY29tIiwidHppIjoiQW1lcmljYS9TYW9fUGF1bG8iLCJpY3IiOiJGYWxzZSIsImN3dCI6IiIsIm5iZiI6MTc3NTU1OTQzOSwiZXhwIjoxNzc1NTkxODM5LCJpYXQiOjE3NzU1NTk0MzksImlzcyI6Ik1vdmlkZXNrIiwiYXVkIjoibW92aWRlc2sifQ.5lqYX7pl4oPJ-V_RiHz-CBxWR1TGAdNBOUMgJILLRyw; _hjSession_1038968=eyJpZCI6IjdjMjZiNTc4LTYwYWQtNDM2MS1hZWQxLTAzNDNiZTc4MDEwYSIsImMiOjE3NzU1Nzk0MTE4MjYsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MX0=; mp_a21580b18f882d4a5eeeedb89142becb_mixpanel=%7B%22distinct_id%22%3A%22%24device%3A26731f6d-ead7-4fcb-910f-7a257a985e8f%22%2C%22%24device_id%22%3A%2226731f6d-ead7-4fcb-910f-7a257a985e8f%22%2C%22%24initial_referrer%22%3A%22https%3A%2F%2Flectortec.movidesk.com%2FAccount%2FLogin%3FreturnUrl%3D%252FTicket%252FEdit%252F10333%22%2C%22%24initial_referring_domain%22%3A%22lectortec.movidesk.com%22%2C%22__mps%22%3A%7B%7D%2C%22__mpso%22%3A%7B%22%24initial_referrer%22%3A%22https%3A%2F%2Flectortec.movidesk.com%2FAccount%2FLogin%3FreturnUrl%3D%252FTicket%252FEdit%252F10333%22%2C%22%24initial_referring_domain%22%3A%22lectortec.movidesk.com%22%7D%2C%22__mpus%22%3A%7B%7D%2C%22__mpa%22%3A%7B%7D%2C%22__mpu%22%3A%7B%7D%2C%22__mpr%22%3A%5B%5D%2C%22__mpap%22%3A%5B%5D%7D; _ga_JBLJTVMDMG=GS2.1.s1775589467$o279$g1$t1775590109$j60$l0$h0`;

function loadCookies(rawString) {
  const cookieString = rawString.trim();
  let bearerToken = "";
  let csrfToken = "";

  const pairs = cookieString.split(';');
  pairs.forEach(p => {
    const parts = p.trim().split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      if (name === "Bearer") bearerToken = value;
      if (name === "__RequestVerificationToken") csrfToken = value;
    }
  });

  return { cookieString, bearerToken, csrfToken };
}

let PRE_CONFIG = loadCookies(RAW_COOKIE_STRING);

// ===========================================

app.post('/api/proxy/config', (req, res) => {
  const { cookieString } = req.body;
  if (cookieString) {
    PRE_CONFIG = loadCookies(cookieString);
    console.log("[PROXY] Cookies atualizados via interface.");
    return res.json({ success: true, message: "Cookies atualizados!" });
  }
  res.status(400).json({ error: "Cookie não enviado." });
});

app.post('/api/proxy/report', async (req, res) => {
  const { startDate, endDate } = req.body;

  // Helper para converter YYYY-MM-DD para DD/MM/YYYY
  const formatMD = (d) => {
    if (!d || !d.includes("-")) return d;
    const [y, m, d2] = d.split("-");
    return `${d2}/${m}/${y}`;
  };

  const sd = formatMD(startDate);
  const ed = formatMD(endDate);

  const url = `https://lectortec.movidesk.com/Report/WorkTimeResultToJsonAsync?StartDate=${sd}&EndDate=${ed}&TicketType=&ShowOnlyWithServiceReport=false`;

  try {
    console.log(`[PROXY] Chamando: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization": `Bearer ${PRE_CONFIG.bearerToken}`,
        "cookie": PRE_CONFIG.cookieString,
        "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
        "sec-ch-ua-platform": "\"Windows\"",
        "referrer": "https://lectortec.movidesk.com/Report"
      }
    });

    const textBlob = await response.text();

    if (textBlob.trim().startsWith("<!DOCTYPE") || textBlob.trim().startsWith("<html")) {
      console.error("[PROXY SERVER ERRO] Movidesk retornou HTML (Login). Cookies expirados!");
      return res.status(401).json({ error: "Sessão expirada no Movidesk. Obtenha novos cookies e Bearer no código." });
    }

    if (!response.ok) {
      console.error("[PROXY SERVER ERROR] ", response.status, textBlob);
      return res.status(response.status).json({ error: `API Movidesk Erro: ${response.status}`, details: textBlob });
    }

    try {
      const data = JSON.parse(textBlob);
      res.json(data);
    } catch (parseErr) {
      console.error("[PROXY ERROR] JSON inválido:", textBlob.substring(0, 500));
      res.status(500).json({ error: "Movidesk retornou JSON inválido", details: textBlob.substring(0, 100) });
    }
  } catch (error) {
    console.error("Erro interno no proxy:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Proxy para manter a sessão viva
app.post('/api/proxy/session', async (req, res) => {
  try {
    const url = "https://session.app.movidesk.com/api/Session/UpdateSessionUser";

    const fetchHeaders = {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "pt-BR,pt;q=0.9",
      "content-type": "application/json",
      "sec-ch-ua": "\"Chromium\";v=\"146\", \"Google Chrome\";v=\"146\"",
      "cookie": PRE_CONFIG.cookieString
    };

    const response = await fetch(url, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify({
        personId: 118387483,
        sessionGuid: "ec19e90f-a254-20c1-d559-0f252fb0c900",
        timeLimitOfSessionInactivity: 540
      })
    });

    const textResult = await response.text();
    res.send({ status: "ok", data: textResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === NOVA API: BUSCAR TODAS AS AÇÕES DO TICKET ===
app.get('/api/proxy/ticket/:id', async (req, res) => {
  const ticketId = req.params.id;
  const url = `https://lectortec.movidesk.com/Ticket/JsonGetActions?ticketId=${ticketId}&showFullHistory=false&showInternalMessageHistory=true&showPublicActionHistory=true&showInternalActionHistory=true`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "authorization": `Bearer ${PRE_CONFIG.bearerToken}`,
        "cookie": PRE_CONFIG.cookieString,
      }
    });
    const blob = await response.text();
    if (!response.ok) return res.status(response.status).json({ error: "Erro JsonGetActions" });
    res.json(JSON.parse(blob));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === NOVA API: SALVAR AÇÃO EDITADA DE VOLTA ===
app.post('/api/proxy/action/save', async (req, res) => {
  try {
    const { ticketId, actionId, actionNumber, actionType, description, appointments } = req.body;
    const url = "https://lectortec.movidesk.com/Ticket/JsonSaveAction";

    const params = new URLSearchParams();
    params.append('__RequestVerificationToken', PRE_CONFIG.csrfToken);
    params.append('TicketId', ticketId);
    params.append('Id', actionId);
    params.append('Number', actionNumber);
    params.append('ActionType', actionType || '2'); // Agora pega do objeto original (Public/Internal)

    // Codifica a descrição como Base64 + URI porque usamos a tag Encoded=true no Movidesk
    const safeDesc = description || '';
    const encodedDesc = Buffer.from(encodeURIComponent(safeDesc)).toString('base64');
    params.append('Description', encodedDesc);

    params.append('ReopenTicket', 'false');

    // Estruturamos a Array maluca das horas no payload Form
    appointments.forEach((apt, index) => {
      const getVal = (obj, key) => obj[key] !== undefined ? obj[key] : obj[key.charAt(0).toLowerCase() + key.slice(1)];

      params.append(`TimeAppointments[${index}].Id`, getVal(apt, 'Id') || 0);
      params.append(`TimeAppointments[${index}].ToDelete`, getVal(apt, 'ToDelete') || 'false');
      params.append(`TimeAppointments[${index}].Date`, getVal(apt, 'Date') || '');
      params.append(`TimeAppointments[${index}].PeriodStart`, getVal(apt, 'PeriodStart') || '');
      params.append(`TimeAppointments[${index}].PeriodEnd`, getVal(apt, 'PeriodEnd') || '');
      params.append(`TimeAppointments[${index}].WorkTime`, getVal(apt, 'WorkTime') || '');
      params.append(`TimeAppointments[${index}].WorkTimeConsumptionHoursTimeSpan`, getVal(apt, 'WorkTimeConsumptionHoursTimeSpan') || getVal(apt, 'WorkTime') || '');
      params.append(`TimeAppointments[${index}].WorkTypeId`, getVal(apt, 'WorkTypeId') || '42227');
      params.append(`TimeAppointments[${index}].ActivityId`, getVal(apt, 'ActivityId') || '107198');
      params.append(`TimeAppointments[${index}].ServiceReportId`, getVal(apt, 'ServiceReportId') || '');
      params.append(`TimeAppointments[${index}].ActivityValue`, getVal(apt, 'ActivityValue') || '');
    });

    params.append('Encoded', 'true');

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "authorization": `Bearer ${PRE_CONFIG.bearerToken}`,
        "cookie": PRE_CONFIG.cookieString,
      },
      body: params.toString()
    });

    const result = await response.text();
    res.json({ status: response.status, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apenas inicia o servidor na porta se não estiver rodando na Vercel (onde NODE_ENV é production)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`✅ App Movidesk PRE-CONFIGURADO iniciado na porta ${PORT}!`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });
}

// Exporta o app para que a Vercel consiga utilizá-lo como Serverless Function
module.exports = app;
