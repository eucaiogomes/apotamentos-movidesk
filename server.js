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
const RAW_COOKIE_STRING = `culture=pt-BR; timezoneId=America%2FSao_Paulo; domain=0; _hjSessionUser_1038968=eyJpZCI6IjE4OTZjMGVlLTlhODYtNWMxYS05ZjY2LTkzMDcwZmU4ZTAwNCIsImNyZWF0ZWQiOjE3NjU0NTgyMzI5NzYsImV4aXN0aW5nIjp0cnVlfQ==; _ga=GA1.1.1522481119.1765458212; _ga_P3V5YYDW47=GS2.1.s1774644524$o2$g1$t1774645146$j60$l0$h0; _ga_DZKEXMG9SB=GS2.1.s1774644525$o2$g1$t1774645146$j60$l0$h0; __RequestVerificationToken=VQINGs7wITncVyw5cMz6WpqrpaLr4bqcnJmaKM_lm5ob0SG5cqd5cgW44iZ6E1sgpc-5tCemP-G0nTGPYAj7WAXWnlU1; .ASPXAUTH=AE0B276A6F8937B5F8A4123F967EB54EB7C476AD9E2F8B2E0A40A84FDB8CBD830F33D9E157DA2775F9D78C5753C64717416177A29EA87A3C298883827F18B16FEE2A739D4254B2AB044D127B715F4B101664B1EC1EA38F025D6ED2FB331DA4166B0F7F310B110276DAFA6A5C1CF5D4D732CF8F078630F9A2C57E3EBC9BA04444C6EE0DC6E3453101D7925269FA241F3520E7050FDCEE0A3BE79408B74FDF6A9199CCD3D24108A7C0275F28BBBDFDE0E7C6D15BF4379B2F1E6708CACC593345D0631824E918C5AB77D2316EAF3877AB677DE97756F7DFC0649B319F60CD4F47A03A36DE1F570C29C2A0562288E6DF6B7861C4BE93CE4F11A73DEE297D4F576305B1BC3073E4E2262D6CE9ED35DE1C11A557F01FDD9A80487A5E2197FFEC96D20C3ABB0E9B0227D6B93303A926AA5C176E01499446B3E10B372AFF376778BB4F0D7C24C01956561CB8AEE290BACD103EFB92EAB6F9480326C2BCCE20D939D7881B73F0A267AC8138E18035CE273F8CC3D720ADF6DC3478E4B2E4E52051874EE2965DA4A2C033212B6EACFA6C5932EA4C70EC0D21D8FE6EAC64AB409BE4B781AF157F35435E639A6F638668EC160AC70834BAD22DBC4BC46D6848C349277FD2A8CDBDC6CE27BAC1864C33466298A1BD8DDFB4A6F302F0DDDFDA8BE321102908CF64E7A8CC548FE890FC85DBDA291DB817C29FFE119370F1DA09D07DA4C74A9779DA379A063F8672270C3C2036CA6300B078E549E207F7D65D5F11C55C182F81DECABEE4FF2585B151069926F4C56A91D1EA74B531CFA412EF385B7B5FC06C25E9FA8633307B088F90E1049DCCEFC2227D6271EA25C5E4D6C5E1AD56EEBD8799F1115144532D6E172CA85FD42C067D0E914B73221971EF62239351CAB255EBDA4FEA4E8D35D1; Bearer=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMjI2ZDkxZC03OWJiLTRhOTYtODg2MS02ZWM4YWRlYzQ0M2EiLCJ1ZHQiOiJleUpKWkNJNk1URTRNemczTkRnekxDSlVaVzVoYm5SSlpDSTZNakE1TVRNc0lsQmxjbk52YmxSNWNHVWlPakVzSWxCeWIyWnBiR1ZVZVhCbElqb3pMQ0pWYzJWeVRtRnRaU0k2SW5OMWNHOXlkR1V5UUd4bFkzUnZjblJsWXk1amIyMHVZbklpTENKRWFYTndiR0Y1VG1GdFpTSTZJa05oYVc4Z1IyOXRaWE1pTENKQlkyTmxjM05RY205bWFXeGxTV1FpT2pnM09EZzFMQ0pJWVhOQlkyTmxjM05RY205bWFXeGxRV05qWlhOelVuVnNaWE1pT21aaGJITmxMQ0pVYVcxbFdtOXVaVWxrSWpwdWRXeHNMQ0pEY21WaGRHVmtSR0YwWlNJNklqSXdNalV0TURndE1qbFVNVFE2TlRRNk1UVXVOVGt6TnprM055SXNJa052WkdWU1pXWmxjbVZ1WTJVaU9pSXhNVFExTmpVeU16UTNJbjA9IiwiY3RyIjoicHQtQlIiLCJoc3QiOiJsZWN0b3J0ZWMubW92aWRlc2suY29tIiwidHppIjoiQW1lcmljYS9TYW9fUGF1bG8iLCJpY3IiOiJGYWxzZSIsImN3dCI6IiIsIm5iZiI6MTc3NTA0MDkyMiwiZXhwIjoxNzc1MDczMzIyLCJpYXQiOjE3NzUwNDA5MjIsImlzcyI6Ik1vdmlkZXNrIiwiYXVkIjoibW92aWRlc2sifQ.AuDcvjBAx8mhC4JQ5TWUI_HP-fRvasGRpu6TT8gcmTs; _hjSession_1038968=eyJpZCI6IjViZjkwYTIzLTE0MmEtNDRiOC1iOTk0LWExMTQxMzhhYTVhMyIsImMiOjE3NzUwNjA5NTU2NzQsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; mp_a21580b18f882d4a5eeeedb89142becb_mixpanel=%7B%22distinct_id%22%3A%22%24device%3A26731f6d-ead7-4fcb-910f-7a257a985e8f%22%2C%22%24device_id%22%3A%2226731f6d-ead7-4fcb-910f-7a257a985e8f%22%2C%22%24initial_referrer%22%3A%22https%3A%2F%2Flectortec.movidesk.com%2FAccount%2FLogin%3FreturnUrl%3D%252FTicket%252FEdit%252F10333%22%2C%22%24initial_referring_domain%22%3A%22lectortec.movidesk.com%22%2C%22__mps%22%3A%7B%7D%2C%22__mpso%22%3A%7B%22%24initial_referrer%22%3A%22https%3A%2F%2Flectortec.movidesk.com%2FAccount%2FLogin%3FreturnUrl%3D%252FTicket%252FEdit%252F10333%22%2C%22%24initial_referring_domain%22%3A%22lectortec.movidesk.com%22%7D%2C%22__mpus%22%3A%7B%7D%2C%22__mpa%22%3A%7B%7D%2C%22__mpu%22%3A%7B%7D%2C%22__mpr%22%3A%5B%5D%2C%22__mpap%22%3A%5B%5D%7D; _ga_JBLJTVMDMG=GS2.1.s1775060956$o261$g1$t1775065480$j60$l0$h0`;

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

const PRE_CONFIG = loadCookies(RAW_COOKIE_STRING);

// ===========================================

app.post('/api/proxy/report', async (req, res) => {
  const { startDate, endDate } = req.body;

  // Helper para converter YYYY-MM-DD para DD/MM/YYYY
  const formatMD = (d) => {
      if(!d || !d.includes("-")) return d;
      const [y, m, d2] = d.split("-");
      return `${d2}/${m}/${y}`;
  };

  const sd = formatMD(startDate);
  const ed = formatMD(endDate);

  const url = `https://lectortec.movidesk.com/Report/WorkTimeResultToJsonAsync?StartDate=${sd}&EndDate=${ed}&TicketType=&ShowOnlyWithServiceReport=false&Agents[0].Id=118387483&Agents[0].ToDelete=false`;

  try {
    console.log(`[PROXY] Chamando: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "accept": "application/json, text/plain, */*",
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
    params.append('Description', description || ''); 
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

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✅ App Movidesk PRE-CONFIGURADO iniciado na porta ${PORT}!`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
