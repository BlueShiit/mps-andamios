const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    sistema, tipo, ancho, alto, fachadas, kg, alturaMaxima,
    metodoIzaje, m2, dias, precioMontaje, precioDesm, total,
    costoTrabajadores, utilidad, recargo,
    empresa, nombre, cargo, telefono, correo, ciudad, observaciones
  } = req.body;

  try {
    await resend.emails.send({
      from: 'MPS Cotizaciones <onboarding@resend.dev>',
      to: ['ian.perez.illanes1@gmail.com'],
      subject: `Nueva cotización MPS — ${sistema} — ${empresa} — ${ciudad}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:0">

          <!-- Header -->
          <div style="background:#3D4A2E;padding:20px 24px;display:flex;align-items:center;gap:12px">
            <div style="background:#F4C430;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center">
              <span style="color:#3D4A2E;font-size:18px;font-weight:bold">M</span>
            </div>
            <div>
              <h2 style="color:#fff;font-size:15px;font-weight:500;margin:0">Nueva solicitud de cotización</h2>
              <p style="color:rgba(255,255,255,0.6);font-size:11px;margin:3px 0 0">${new Date().toLocaleDateString('es-CL', {weekday:'long',year:'numeric',month:'long',day:'numeric'})} · ${new Date().toLocaleTimeString('es-CL', {hour:'2-digit',minute:'2-digit'})} hrs</p>
            </div>
          </div>

          <div style="padding:20px 24px;background:#ffffff">

            <!-- Datos de la obra -->
            <p style="font-size:10px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px;padding-bottom:6px;border-bottom:1px solid #eee">Datos de la obra</p>
            <table style="width:100%;font-size:12px;border-collapse:collapse">
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Sistema</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${sistema}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Tipo de trabajo</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${tipo}</td></tr>
              ${sistema === 'Blitz (fachada)' ? `
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Dimensiones</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${ancho}m × ${alto}m × ${fachadas} fachada(s)</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">m² totales</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${m2} m²</td></tr>
              ` : `
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Kilogramos totales</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${kg} kg</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Método de izaje</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${metodoIzaje}</td></tr>
              `}
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Altura máxima</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${alturaMaxima}m ${parseFloat(alturaMaxima) > 10 ? '— recargo +50%' : '— sin recargo'}</td></tr>
              <tr><td style="color:#888;padding:5px 0">Días estimados</td><td style="text-align:right;font-weight:500;padding:5px 0">${dias} días hábiles</td></tr>
            </table>

            <!-- Precios -->
            <div style="background:#EAF3DE;border-radius:8px;padding:14px 16px;margin:16px 0">
              <table style="width:100%;font-size:12px;border-collapse:collapse">
                <tr><td style="color:#27500A;padding:5px 0;border-bottom:1px solid rgba(61,74,46,0.15)">Montaje</td><td style="text-align:right;font-weight:500;color:#27500A;padding:5px 0;border-bottom:1px solid rgba(61,74,46,0.15)">$${parseInt(precioMontaje).toLocaleString('es-CL')}</td></tr>
                <tr><td style="color:#27500A;padding:5px 0">Desmontaje</td><td style="text-align:right;font-weight:500;color:#27500A;padding:5px 0">$${parseInt(precioDesm).toLocaleString('es-CL')}</td></tr>
              </table>
              <div style="border-top:1px solid rgba(61,74,46,0.25);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between">
                <span style="font-size:13px;font-weight:500;color:#3D4A2E">Total cobrado al cliente</span>
                <span style="font-size:20px;font-weight:500;color:#3D4A2E">$${parseInt(total).toLocaleString('es-CL')}</span>
              </div>
            </div>

            <!-- Desglose interno -->
            <div style="background:#FAEEDA;border-radius:8px;padding:14px 16px;margin:16px 0">
              <p style="font-size:10px;font-weight:500;color:#854F0B;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px">🔒 Desglose interno MPS</p>
              <table style="width:100%;font-size:12px;border-collapse:collapse">
                <tr><td style="color:#854F0B;padding:5px 0;border-bottom:1px solid rgba(185,119,23,0.2)">Días montaje</td><td style="text-align:right;font-weight:500;color:#633806;padding:5px 0;border-bottom:1px solid rgba(185,119,23,0.2)">${Math.ceil(parseInt(dias)/2)} días</td></tr>
                <tr><td style="color:#854F0B;padding:5px 0;border-bottom:1px solid rgba(185,119,23,0.2)">Días desmontaje</td><td style="text-align:right;font-weight:500;color:#633806;padding:5px 0;border-bottom:1px solid rgba(185,119,23,0.2)">${Math.ceil(parseInt(dias)/2)} días</td></tr>
                <tr><td style="color:#854F0B;padding:5px 0;border-bottom:1px solid rgba(185,119,23,0.2)">Recargo altura</td><td style="text-align:right;font-weight:500;color:#633806;padding:5px 0;border-bottom:1px solid rgba(185,119,23,0.2)">${recargo === '1.5' ? '+50% aplicado' : 'Sin recargo'}</td></tr>
                <tr><td style="color:#854F0B;padding:5px 0;border-bottom:1px solid rgba(185,119,23,0.2)">Costo cuadrilla</td><td style="text-align:right;font-weight:500;color:#633806;padding:5px 0;border-bottom:1px solid rgba(185,119,23,0.2)">$${parseInt(costoTrabajadores).toLocaleString('es-CL')}</td></tr>
                <tr><td style="color:#854F0B;padding:5px 0">Utilidad estimada MPS</td><td style="text-align:right;font-weight:500;color:#3B6D11;padding:5px 0">$${parseInt(utilidad).toLocaleString('es-CL')}</td></tr>
              </table>
            </div>

            <!-- Contacto -->
            <p style="font-size:10px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:0.06em;margin:16px 0 8px;padding-bottom:6px;border-bottom:1px solid #eee">Datos de contacto</p>
            <table style="width:100%;font-size:12px;border-collapse:collapse">
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Empresa</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${empresa}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Contacto</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${nombre} · ${cargo}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Teléfono</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${telefono}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Correo</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${correo}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Ciudad</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${ciudad}</td></tr>
              ${observaciones ? `<tr><td style="color:#888;padding:5px 0">Observaciones</td><td style="text-align:right;font-weight:500;padding:5px 0">${observaciones}</td></tr>` : ''}
            </table>

          </div>
          <div style="background:#f5f5f5;padding:12px 24px;font-size:11px;color:#aaa;text-align:center">
            MPS — Montajes Profesionales &amp; Soluciones · mps-andamios.cl · Generado automáticamente
          </div>
        </body>
        </html>
      `
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error enviando email' });
  }
};
