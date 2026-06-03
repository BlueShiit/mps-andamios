// netlify/functions/send-mail.js
const nodemailer = require("nodemailer");

function esc(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fmtCLP(n) {
  return "$" + Math.round(n || 0).toLocaleString("es-CL");
}

const TIPO_LABELS = {
  "montaje-desmontaje": "Montaje y desmontaje",
  "solo-montaje":       "Solo montaje",
  "solo-desmontaje":    "Solo desmontaje",
  "supervision":        "Supervisión de obra",
};

function rowTd(label, value) {
  return `<tr><td style="color:#64748b;width:42%;padding:3px 0;vertical-align:top;">${label}</td><td style="color:#0f172a;padding:3px 0;">${value}</td></tr>`;
}

function seccionObra(data) {
  const { sistema, tipoTrabajo, ancho, alto, fachadas, m2, kg, alturaAllround, metodoIzaje } = data;

  let filas = `
    ${rowTd("Sistema", `<strong>${esc(sistema?.toUpperCase() || "—")}</strong>`)}
    ${rowTd("Tipo de trabajo", esc(TIPO_LABELS[tipoTrabajo] || tipoTrabajo || "—"))}
  `;

  if (sistema === "blitz") {
    const altaNum = Number(alto);
    const alertaAltura = altaNum > 10 ? ` &nbsp;<span style="color:#b45309;font-weight:600;">⚠️ supera 10m</span>` : "";
    filas += rowTd("Dimensiones", `${esc(ancho)}m × ${esc(alto)}m × ${esc(fachadas)} fachada(s) = <strong>${Number(m2 || 0).toLocaleString("es-CL")} m²</strong>`);
    filas += rowTd("Altura", `${esc(alto)} m${alertaAltura}`);
  }

  if (sistema === "allround") {
    const altaNum = Number(alturaAllround);
    const alertaAltura = altaNum > 10 ? ` &nbsp;<span style="color:#b45309;font-weight:600;">⚠️ supera 10m</span>` : "";
    filas += rowTd("Kilogramos totales", `<strong>${Number(kg || 0).toLocaleString("es-CL")} kg</strong>`);
    filas += rowTd("Altura máxima", `${esc(alturaAllround)} m${alertaAltura}`);
    filas += rowTd("Método de izaje", `<strong>${esc(metodoIzaje || "—")}</strong>`);
  }

  return `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;margin-bottom:14px;">
      <p style="margin:0 0 10px;font-weight:700;font-size:14px;color:#0f172a;">Datos de la obra</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.7;">${filas}</table>
    </div>`;
}

function seccionPrecios(calc) {
  if (!calc) return "";

  let filas = "";
  if (calc.precioM > 0) filas += `<tr><td style="color:#374151;padding:3px 0;">Montaje</td><td style="text-align:right;color:#374151;">${fmtCLP(calc.precioM)}</td></tr>`;
  if (calc.precioD > 0) filas += `<tr><td style="color:#374151;padding:3px 0;">Desmontaje</td><td style="text-align:right;color:#374151;">${fmtCLP(calc.precioD)}</td></tr>`;

  return `
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:14px 16px;margin-bottom:14px;">
      <p style="margin:0 0 10px;font-weight:700;font-size:14px;color:#166534;">Estimado de precios</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        ${filas}
        <tr><td colspan="2" style="padding:6px 0 4px;"><hr style="border:none;border-top:1px solid #86efac;margin:0;"></td></tr>
        <tr>
          <td style="font-weight:700;color:#166534;font-size:15px;">Total cobrado al cliente</td>
          <td style="text-align:right;font-weight:700;color:#166534;font-size:15px;">${fmtCLP(calc.total)}</td>
        </tr>
      </table>
    </div>`;
}

function seccionInterna(calc) {
  if (!calc) return "";

  return `
    <div style="background:#fefce8;border:1px solid #fde047;border-radius:12px;padding:14px 16px;margin-bottom:14px;">
      <p style="margin:0 0 10px;font-weight:700;font-size:14px;color:#713f12;">Desglose interno MPS</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.7;">
        <tr><td style="color:#713f12;padding:3px 0;">Días montaje</td><td style="text-align:right;color:#0f172a;">${calc.diasM} días</td></tr>
        <tr><td style="color:#713f12;padding:3px 0;">Días desmontaje</td><td style="text-align:right;color:#0f172a;">${calc.diasD} días</td></tr>
        <tr><td style="color:#713f12;padding:3px 0;">Recargo altura</td><td style="text-align:right;color:#0f172a;">${Number(calc.recargo) > 1 ? "<strong>+50% aplicado</strong>" : "Sin recargo"}</td></tr>
        <tr><td style="color:#713f12;padding:3px 0;">Costo cuadrilla (trabajadores)</td><td style="text-align:right;color:#0f172a;">${fmtCLP(calc.costoTrab)}</td></tr>
        <tr><td colspan="2" style="padding:6px 0 4px;"><hr style="border:none;border-top:1px solid #fde047;margin:0;"></td></tr>
        <tr>
          <td style="font-weight:700;color:#713f12;font-size:14px;">Utilidad estimada MPS</td>
          <td style="text-align:right;font-weight:700;font-size:14px;color:${Number(calc.utilidad) >= 0 ? "#166534" : "#dc2626"};">${fmtCLP(calc.utilidad)}</td>
        </tr>
      </table>
    </div>`;
}

function seccionContacto(data) {
  const { empresa, nombre, cargo, telefono, correo, ciudad, observaciones } = data;
  return `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;margin-bottom:14px;">
      <p style="margin:0 0 10px;font-weight:700;font-size:14px;color:#0f172a;">Datos de contacto</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.7;">
        ${rowTd("Empresa",   esc(empresa   || "—"))}
        ${rowTd("Nombre",    esc(nombre    || "—"))}
        ${rowTd("Cargo",     esc(cargo     || "—"))}
        ${rowTd("Teléfono",  esc(telefono  || "—"))}
        ${rowTd("Correo",    `<a href="mailto:${esc(correo)}" style="color:#0a66c2;">${esc(correo || "—")}</a>`)}
        ${rowTd("Ciudad",    esc(ciudad    || "—"))}
        ${observaciones ? rowTd("Observaciones", esc(observaciones)) : ""}
      </table>
    </div>`;
}

function emailAdminHTML(data) {
  const sistema  = data.sistema  || data.tipo  || "—";
  const empresa  = data.empresa  || "—";
  const ciudad   = data.ciudad   || "—";
  const calc     = data.calc;

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f7fb;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e7e9f2;">
      <div style="background:#0f172a;color:#fff;padding:18px 22px;">
        <h2 style="margin:0;font-size:18px;letter-spacing:.2px;">Nueva cotización MPS</h2>
        <p style="margin:6px 0 0;font-size:12px;opacity:.9;">${esc(sistema.toUpperCase())} &mdash; ${esc(empresa)} &mdash; ${esc(ciudad)}</p>
      </div>
      <div style="padding:20px 22px;color:#0f172a;">
        ${seccionObra(data)}
        ${seccionPrecios(calc)}
        ${seccionInterna(calc)}
        ${seccionContacto(data)}
      </div>
      <div style="padding:14px 22px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;">
        <p style="margin:0;">© ${new Date().getFullYear()} MPS Montajes Profesionales &amp; Soluciones</p>
      </div>
    </div>
  </div>`;
}

function emailClienteHTML(data) {
  const sistema      = data.sistema  || data.tipo  || "";
  const tipoTrabajo  = data.tipoTrabajo  || "";
  const empresa      = data.empresa  || "";
  const nombre       = data.nombre   || empresa || "!";
  const calc         = data.calc;
  const sistemaLabel = sistema ? sistema.charAt(0).toUpperCase() + sistema.slice(1) : "—";

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f7fb;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e7e9f2;">
      <div style="background:#0f172a;color:#fff;padding:18px 22px;">
        <h2 style="margin:0;font-size:18px;">MPS Andamios</h2>
        <p style="margin:6px 0 0;font-size:12px;opacity:.9;">Confirmación de cotización</p>
      </div>
      <div style="padding:20px 22px;color:#0f172a;">
        <p style="margin:0 0 14px;">Hola <b>${esc(nombre)}</b>,</p>
        <p style="margin:0 0 14px;">
          Recibimos tu solicitud de cotización para un proyecto de
          <b>${esc(sistemaLabel)}</b> (${esc(TIPO_LABELS[tipoTrabajo] || tipoTrabajo || "—")}).
          Un integrante del equipo MPS te contactará en <b>menos de 2 horas hábiles</b> para confirmar los detalles y el precio final.
        </p>
        ${calc && calc.total > 0 ? seccionPrecios(calc) : ""}
        <p style="margin:14px 0 0;font-size:13px;color:#334155;">
          Si necesitas agregar información (planos, plazos, condiciones especiales), responde este correo.
        </p>
      </div>
      <div style="padding:14px 22px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;">
        <p style="margin:0;">© ${new Date().getFullYear()} MPS Montajes Profesionales &amp; Soluciones</p>
      </div>
    </div>
  </div>`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_TO) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Faltan variables SMTP/MAIL_TO en Netlify." }) };
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const sistema  = data.sistema || data.tipo || "—";
    const empresa  = data.empresa || "—";
    const ciudad   = data.ciudad  || "—";
    const asunto   = `Nueva cotización MPS — ${sistema.toUpperCase()} — ${empresa} — ${ciudad}`;

    await transporter.sendMail({
      from:    `"MPS Web" <${SMTP_USER}>`,
      to:      MAIL_TO,
      subject: asunto,
      html:    emailAdminHTML(data),
    });

    if (data.correo) {
      await transporter.sendMail({
        from:    `"MPS Andamios" <${SMTP_USER}>`,
        to:      data.correo,
        subject: "Recibimos tu cotización ✅ — MPS",
        html:    emailClienteHTML(data),
        replyTo: MAIL_TO,
      });
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("send-mail error:", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Error enviando correo." }) };
  }
};
