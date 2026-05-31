// netlify/functions/send-mail.js
const nodemailer = require("nodemailer");

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCLP(n) {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

function precioBlock(precio) {
  if (!precio || !precio.total) return "";
  return `
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:14px 16px;margin:14px 0;">
      <p style="margin:0 0 10px;font-weight:700;color:#166534;font-size:14px;">Estimación de precio</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr>
          <td style="padding:3px 0;color:#374151;">
            ${Number(precio.cantidad).toLocaleString("es-CL")} ${escapeHtml(precio.unidad)} × ${formatCLP(precio.precioUnitario)}/${escapeHtml(precio.unidad)}
          </td>
          <td style="text-align:right;color:#374151;">${formatCLP(precio.neto)}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;color:#374151;">IVA (19%)</td>
          <td style="text-align:right;color:#374151;">${formatCLP(precio.iva)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:0;"><hr style="border:none;border-top:1px solid #86efac;margin:8px 0;"></td>
        </tr>
        <tr>
          <td style="padding:3px 0;font-weight:700;color:#166534;font-size:15px;">Total estimado</td>
          <td style="text-align:right;font-weight:700;color:#166534;font-size:15px;">${formatCLP(precio.total)}</td>
        </tr>
      </table>
      <p style="margin:10px 0 0;font-size:11px;color:#6b7280;">
        Valor referencial neto + IVA. El precio final puede variar según altura, accesos y condiciones específicas de la obra.
      </p>
    </div>`;
}

function emailClienteHTML({ tipo, ciudad, direccion, empresa, telefono, correo, m2_blitz, kg_allround, precio }) {
  const detalleMedida =
    tipo === "blitz"
      ? `<p style="margin:0;"><b>M² estimados:</b> ${m2_blitz ?? "-"}</p>`
      : tipo === "allround"
      ? `<p style="margin:0;"><b>KG estimados:</b> ${kg_allround ?? "-"}</p>`
      : "";

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f7fb;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e7e9f2;">
      <div style="background:#0f172a;color:#fff;padding:18px 22px;">
        <h2 style="margin:0;font-size:18px;letter-spacing:.2px;">MPS Andamios</h2>
        <p style="margin:6px 0 0;font-size:12px;opacity:.9;">Confirmación de solicitud de cotización</p>
      </div>

      <div style="padding:20px 22px;color:#0f172a;">
        <p style="margin:0 0 12px;">Hola <b>${escapeHtml(empresa || "!")}</b>,</p>
        <p style="margin:0 0 14px;">
          Recibimos tu solicitud de cotización. Un integrante de nuestro equipo te contactará a la brevedad para confirmar los detalles y el precio final.
        </p>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px;margin:14px 0;">
          <p style="margin:0 0 8px;font-weight:700;">Datos de la solicitud</p>
          <p style="margin:0;"><b>Tipo de andamio:</b> ${escapeHtml(tipo || "-")}</p>
          ${detalleMedida}
          <p style="margin:0;"><b>Ciudad:</b> ${escapeHtml(ciudad || "-")}</p>
          <p style="margin:0;"><b>Dirección:</b> ${escapeHtml(direccion || "-")}</p>
          <p style="margin:0;"><b>Teléfono:</b> ${escapeHtml(telefono || "-")}</p>
          <p style="margin:0;"><b>Correo:</b> ${escapeHtml(correo || "-")}</p>
        </div>

        ${precioBlock(precio)}

        <p style="margin:14px 0 0;font-size:13px;color:#334155;">
          Si necesitas agregar información (planos, alturas, plazos), responde este correo y lo sumamos a tu solicitud.
        </p>
      </div>

      <div style="padding:14px 22px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;">
        <p style="margin:0;">© ${new Date().getFullYear()} MPS Montajes Profesionales & Soluciones</p>
      </div>
    </div>
  </div>`;
}

function emailAdminHTML({ tipo, ciudad, direccion, empresa, telefono, correo, m2_blitz, kg_allround, origen, precio }) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;padding:16px;">
    <h2 style="margin:0 0 12px;">Nueva solicitud (${escapeHtml(origen || "form")})</h2>
    <ul style="line-height:1.8;">
      <li><b>Tipo:</b> ${escapeHtml(tipo || "-")}</li>
      <li><b>M² Blitz:</b> ${m2_blitz ?? "-"}</li>
      <li><b>KG Allround:</b> ${kg_allround ?? "-"}</li>
      <li><b>Ciudad:</b> ${escapeHtml(ciudad || "-")}</li>
      <li><b>Dirección:</b> ${escapeHtml(direccion || "-")}</li>
      <li><b>Empresa:</b> ${escapeHtml(empresa || "-")}</li>
      <li><b>Teléfono:</b> ${escapeHtml(telefono || "-")}</li>
      <li><b>Correo:</b> ${escapeHtml(correo || "-")}</li>
    </ul>
    ${precioBlock(precio)}
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
      return {
        statusCode: 500,
        body: JSON.stringify({ ok: false, error: "Faltan variables SMTP/MAIL_TO en Netlify." }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const asunto = data.origen === "contacto"
      ? "Nuevo mensaje desde Contacto (MPS)"
      : "Nueva solicitud de Cotización (MPS)";

    // 1) Correo al admin
    await transporter.sendMail({
      from: `"MPS Web" <${SMTP_USER}>`,
      to: MAIL_TO,
      subject: asunto,
      html: emailAdminHTML(data),
    });

    // 2) Correo al cliente
    if (data.correo) {
      await transporter.sendMail({
        from: `"MPS Andamios" <${SMTP_USER}>`,
        to: data.correo,
        subject: "Recibimos tu solicitud ✅ (MPS)",
        html: emailClienteHTML(data),
        replyTo: MAIL_TO,
      });
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("send-mail error:", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Error enviando correo." }) };
  }
};
