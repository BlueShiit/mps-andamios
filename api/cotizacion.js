const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      sistema, tipo, ancho, alto, fachadas, kg, alturaMaxima,
      metodoIzaje, m2, dias, precioMontaje, precioDesm, total,
      costoTrabajadores, utilidad, recargo,
      empresa, nombre, cargo, telefono, correo, ciudad, observaciones
    } = req.body;

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
            <div style="background:#F4C430;width:56px;height:56px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;padding:6px;flex-shrink:0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 390" width="44" height="44">
                <line x1="115" y1="122" x2="250" y2="52" stroke="#d4a020" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="165" y1="122" x2="302" y2="52" stroke="#d4a020" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="115" y1="52" x2="250" y2="122" stroke="#4d78c9" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="165" y1="52" x2="302" y2="122" stroke="#4d78c9" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="115" y1="52" x2="302" y2="52" stroke="#1c2d5e" stroke-width="5" stroke-linecap="round"/>
                <line x1="115" y1="122" x2="302" y2="122" stroke="#1c2d5e" stroke-width="4.5" stroke-linecap="round"/>
                <line x1="165" y1="168" x2="250" y2="168" stroke="#1c2d5e" stroke-width="4" stroke-linecap="round"/>
                <line x1="165" y1="52" x2="165" y2="168" stroke="#1c2d5e" stroke-width="4.5" stroke-linecap="round"/>
                <line x1="250" y1="52" x2="250" y2="168" stroke="#1c2d5e" stroke-width="4.5" stroke-linecap="round"/>
                <line x1="115" y1="52" x2="115" y2="192" stroke="#1c2d5e" stroke-width="5.5" stroke-linecap="round"/>
                <line x1="302" y1="52" x2="302" y2="192" stroke="#1c2d5e" stroke-width="5.5" stroke-linecap="round"/>
                <line x1="208" y1="8" x2="165" y2="52" stroke="#1c2d5e" stroke-width="5" stroke-linecap="round"/>
                <line x1="208" y1="8" x2="250" y2="52" stroke="#1c2d5e" stroke-width="5" stroke-linecap="round"/>
                <circle cx="208" cy="8" r="6" fill="#1c2d5e"/>
                <circle cx="115" cy="52" r="5.5" fill="#1c2d5e"/>
                <circle cx="165" cy="52" r="5" fill="#1c2d5e"/>
                <circle cx="250" cy="52" r="5" fill="#1c2d5e"/>
                <circle cx="302" cy="52" r="5.5" fill="#1c2d5e"/>
                <circle cx="115" cy="122" r="5" fill="#1c2d5e"/>
                <circle cx="165" cy="122" r="5" fill="#1c2d5e"/>
                <circle cx="250" cy="122" r="5" fill="#1c2d5e"/>
                <circle cx="302" cy="122" r="5" fill="#1c2d5e"/>
                <circle cx="165" cy="168" r="4.5" fill="#1c2d5e"/>
                <circle cx="250" cy="168" r="4.5" fill="#1c2d5e"/>
                <circle cx="115" cy="192" r="5" fill="#1c2d5e"/>
                <circle cx="302" cy="192" r="5" fill="#1c2d5e"/>
                <line x1="108" y1="192" x2="122" y2="192" stroke="#1c2d5e" stroke-width="4" stroke-linecap="round"/>
                <line x1="295" y1="192" x2="309" y2="192" stroke="#1c2d5e" stroke-width="4" stroke-linecap="round"/>
                <text x="72" y="318" font-family="Impact,'Franklin Gothic Heavy','Arial Narrow',Arial,sans-serif" font-size="190" fill="#1c2d5e">M</text>
                <text x="210" y="318" font-family="Impact,'Franklin Gothic Heavy','Arial Narrow',Arial,sans-serif" font-size="190" fill="#1c2d5e">P</text>
                <text x="322" y="318" font-family="Impact,'Franklin Gothic Heavy','Arial Narrow',Arial,sans-serif" font-size="190" fill="#d4a020">S</text>
                <text x="250" y="348" font-family="'Arial Black',Impact,'Helvetica Neue',Arial,sans-serif" font-size="19.5" font-weight="900" fill="#1c2d5e" text-anchor="middle" letter-spacing="2.5">MONTAJES PROFESIONALES</text>
                <line x1="40" y1="368" x2="150" y2="368" stroke="#d4a020" stroke-width="2.5"/>
                <text x="250" y="374" font-family="'Arial Black',Impact,'Helvetica Neue',Arial,sans-serif" font-size="17" font-weight="900" fill="#d4a020" text-anchor="middle" letter-spacing="5">Y SOLUCIONES</text>
                <line x1="352" y1="368" x2="462" y2="368" stroke="#d4a020" stroke-width="2.5"/>
              </svg>
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

    await resend.emails.send({
      from: 'MPS Cotizaciones <onboarding@resend.dev>',
      to: [correo],
      subject: `Tu cotización fue recibida — MPS Montajes Profesionales`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:0">

          <div style="background:#3D4A2E;padding:20px 24px">
            <div style="background:#F4C430;width:56px;height:56px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;padding:6px;flex-shrink:0;margin-bottom:8px">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 390" width="44" height="44">
                <line x1="115" y1="122" x2="250" y2="52" stroke="#d4a020" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="165" y1="122" x2="302" y2="52" stroke="#d4a020" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="115" y1="52" x2="250" y2="122" stroke="#4d78c9" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="165" y1="52" x2="302" y2="122" stroke="#4d78c9" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="115" y1="52" x2="302" y2="52" stroke="#1c2d5e" stroke-width="5" stroke-linecap="round"/>
                <line x1="115" y1="122" x2="302" y2="122" stroke="#1c2d5e" stroke-width="4.5" stroke-linecap="round"/>
                <line x1="165" y1="168" x2="250" y2="168" stroke="#1c2d5e" stroke-width="4" stroke-linecap="round"/>
                <line x1="165" y1="52" x2="165" y2="168" stroke="#1c2d5e" stroke-width="4.5" stroke-linecap="round"/>
                <line x1="250" y1="52" x2="250" y2="168" stroke="#1c2d5e" stroke-width="4.5" stroke-linecap="round"/>
                <line x1="115" y1="52" x2="115" y2="192" stroke="#1c2d5e" stroke-width="5.5" stroke-linecap="round"/>
                <line x1="302" y1="52" x2="302" y2="192" stroke="#1c2d5e" stroke-width="5.5" stroke-linecap="round"/>
                <line x1="208" y1="8" x2="165" y2="52" stroke="#1c2d5e" stroke-width="5" stroke-linecap="round"/>
                <line x1="208" y1="8" x2="250" y2="52" stroke="#1c2d5e" stroke-width="5" stroke-linecap="round"/>
                <circle cx="208" cy="8" r="6" fill="#1c2d5e"/>
                <circle cx="115" cy="52" r="5.5" fill="#1c2d5e"/>
                <circle cx="165" cy="52" r="5" fill="#1c2d5e"/>
                <circle cx="250" cy="52" r="5" fill="#1c2d5e"/>
                <circle cx="302" cy="52" r="5.5" fill="#1c2d5e"/>
                <circle cx="115" cy="122" r="5" fill="#1c2d5e"/>
                <circle cx="165" cy="122" r="5" fill="#1c2d5e"/>
                <circle cx="250" cy="122" r="5" fill="#1c2d5e"/>
                <circle cx="302" cy="122" r="5" fill="#1c2d5e"/>
                <circle cx="165" cy="168" r="4.5" fill="#1c2d5e"/>
                <circle cx="250" cy="168" r="4.5" fill="#1c2d5e"/>
                <circle cx="115" cy="192" r="5" fill="#1c2d5e"/>
                <circle cx="302" cy="192" r="5" fill="#1c2d5e"/>
                <line x1="108" y1="192" x2="122" y2="192" stroke="#1c2d5e" stroke-width="4" stroke-linecap="round"/>
                <line x1="295" y1="192" x2="309" y2="192" stroke="#1c2d5e" stroke-width="4" stroke-linecap="round"/>
                <text x="72" y="318" font-family="Impact,'Franklin Gothic Heavy','Arial Narrow',Arial,sans-serif" font-size="190" fill="#1c2d5e">M</text>
                <text x="210" y="318" font-family="Impact,'Franklin Gothic Heavy','Arial Narrow',Arial,sans-serif" font-size="190" fill="#1c2d5e">P</text>
                <text x="322" y="318" font-family="Impact,'Franklin Gothic Heavy','Arial Narrow',Arial,sans-serif" font-size="190" fill="#d4a020">S</text>
                <text x="250" y="348" font-family="'Arial Black',Impact,'Helvetica Neue',Arial,sans-serif" font-size="19.5" font-weight="900" fill="#1c2d5e" text-anchor="middle" letter-spacing="2.5">MONTAJES PROFESIONALES</text>
                <line x1="40" y1="368" x2="150" y2="368" stroke="#d4a020" stroke-width="2.5"/>
                <text x="250" y="374" font-family="'Arial Black',Impact,'Helvetica Neue',Arial,sans-serif" font-size="17" font-weight="900" fill="#d4a020" text-anchor="middle" letter-spacing="5">Y SOLUCIONES</text>
                <line x1="352" y1="368" x2="462" y2="368" stroke="#d4a020" stroke-width="2.5"/>
              </svg>
            </div>
            <h2 style="color:#fff;font-size:15px;font-weight:500;margin:0">Cotización recibida</h2>
            <p style="color:rgba(255,255,255,0.6);font-size:11px;margin:4px 0 0">Te contactaremos en menos de 2 horas hábiles</p>
          </div>

          <div style="padding:20px 24px;background:#ffffff">
            <p style="font-size:13px;color:#555;line-height:1.6;margin:0 0 16px">
              Hola <strong style="color:#333">${nombre}</strong>, recibimos tu solicitud de cotización para <strong style="color:#333">${empresa}</strong>. El equipo MPS revisará los detalles y te contactará a la brevedad.
            </p>

            <p style="font-size:10px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px;padding-bottom:6px;border-bottom:1px solid #eee">Resumen de tu solicitud</p>
            <table style="width:100%;font-size:12px;border-collapse:collapse">
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Sistema</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${sistema}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Tipo de trabajo</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${tipo}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Ciudad</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${ciudad}</td></tr>
              <tr><td style="color:#888;padding:5px 0">Días estimados</td><td style="text-align:right;font-weight:500;padding:5px 0">${dias} días hábiles</td></tr>
            </table>

            <div style="background:#EAF3DE;border-radius:8px;padding:14px 16px;margin:16px 0">
              <table style="width:100%;font-size:12px;border-collapse:collapse">
                <tr><td style="color:#27500A;padding:5px 0;border-bottom:1px solid rgba(61,74,46,0.15)">Estimado montaje</td><td style="text-align:right;font-weight:500;color:#27500A;padding:5px 0;border-bottom:1px solid rgba(61,74,46,0.15)">$${parseInt(precioMontaje).toLocaleString('es-CL')}</td></tr>
                <tr><td style="color:#27500A;padding:5px 0">Estimado desmontaje</td><td style="text-align:right;font-weight:500;color:#27500A;padding:5px 0">$${parseInt(precioDesm).toLocaleString('es-CL')}</td></tr>
              </table>
              <div style="border-top:1px solid rgba(61,74,46,0.25);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;align-items:baseline">
                <span style="font-size:13px;font-weight:500;color:#3D4A2E">Estimado total</span>
                <span style="font-size:20px;font-weight:500;color:#3D4A2E">$${parseInt(total).toLocaleString('es-CL')}</span>
              </div>
            </div>

            <p style="font-size:11px;color:#aaa;margin:0 0 16px">Valor referencial. MPS confirmará el precio exacto al contactarte.</p>

            <div style="background:#3D4A2E;border-radius:8px;padding:14px 16px;text-align:center;margin:16px 0">
              <p style="color:rgba(255,255,255,0.8);font-size:12px;margin:0 0 10px">¿Tienes dudas o quieres agilizar tu cotización?</p>
              <a href="https://wa.me/56954138616" style="display:inline-block;background:#F4C430;color:#3D4A2E;font-size:12px;font-weight:500;padding:8px 20px;border-radius:6px;text-decoration:none">Escríbenos por WhatsApp</a>
            </div>

            <p style="font-size:10px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:0.06em;margin:16px 0 8px;padding-bottom:6px;border-bottom:1px solid #eee">Datos de contacto MPS</p>
            <table style="width:100%;font-size:12px;border-collapse:collapse">
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Teléfono / WhatsApp</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">+56 9 5413 8616</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Correo</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">arturoperezm2015@gmail.com</td></tr>
              <tr><td style="color:#888;padding:5px 0">Web</td><td style="text-align:right;font-weight:500;padding:5px 0">mps-andamios.vercel.app</td></tr>
            </table>
          </div>

          <div style="background:#f5f5f5;padding:12px 24px;font-size:11px;color:#aaa;text-align:center">
            MPS — Montajes Profesionales &amp; Soluciones · mps-andamios.vercel.app · Este correo fue generado automáticamente.
          </div>
        </body>
        </html>
      `
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error en cotizacion:', error);
    return res.status(500).json({ error: error.message });
  }
};
