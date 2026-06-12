const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    sistema, tipo, ancho, alto, fachadas,
    kg, alturaMaxima, metodoIzaje,
    m2, dias, precioMontaje, precioDesm, total,
    costoTrabajadores, utilidad, recargo,
    empresa, nombre, cargo, telefono, correo, ciudad, observaciones
  } = req.body;

  try {
    // CORREO 1 → a MPS (limitación plan gratis: solo llega a la cuenta Resend)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ian.perez.illanes1@gmail.com',
      subject: `Nueva cotización MPS — ${sistema} — ${empresa} — ${ciudad}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#3D4A2E;padding:20px 24px;display:flex;align-items:center;gap:12px">
            <img src="https://mps-andamios-git-main-ian-perez-s-projects.vercel.app/assets/img/logo-mps.svg" width="44" height="44" alt="MPS" style="background:#F4C430;border-radius:8px;padding:4px">
            <div>
              <h2 style="color:#fff;font-size:15px;font-weight:500;margin:0">Nueva solicitud de cotización</h2>
              <p style="color:rgba(255,255,255,.6);font-size:11px;margin:3px 0 0">${new Date().toLocaleDateString('es-CL',{weekday:'long',year:'numeric',month:'long',day:'numeric'})} · ${new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})} hrs</p>
            </div>
          </div>
          <div style="padding:20px 24px;background:#fff">
            <p style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:0 0 10px">Datos de la obra</p>
            <table style="width:100%;font-size:12px;border-collapse:collapse">
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Sistema</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${sistema}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Tipo de trabajo</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${tipo}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Dimensiones</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${sistema === 'Blitz (fachada)' ? `${ancho}m × ${alto}m × ${fachadas} fachada(s) = ${m2} m²` : `${kg} kg · ${alturaMaxima}m de alto`}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Método de izaje</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${metodoIzaje}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Altura</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${alturaMaxima}m ${parseFloat(alturaMaxima) > 10 ? '— recargo +50%' : '— sin recargo'}</td></tr>
              <tr><td style="color:#888;padding:5px 0">Días estimados</td><td style="text-align:right;font-weight:500;padding:5px 0">${dias} días hábiles</td></tr>
            </table>
            <div style="background:#EAF3DE;border-radius:8px;padding:14px 16px;margin:16px 0">
              <table style="width:100%;font-size:12px;border-collapse:collapse">
                <tr><td style="color:#27500A;padding:5px 0;border-bottom:1px solid rgba(61,74,46,.15)">Montaje</td><td style="text-align:right;font-weight:500;color:#27500A;padding:5px 0;border-bottom:1px solid rgba(61,74,46,.15)">$${parseInt(precioMontaje).toLocaleString('es-CL')}</td></tr>
                <tr><td style="color:#27500A;padding:5px 0">Desmontaje</td><td style="text-align:right;font-weight:500;color:#27500A;padding:5px 0">$${parseInt(precioDesm).toLocaleString('es-CL')}</td></tr>
              </table>
              <div style="border-top:1px solid rgba(61,74,46,.25);margin-top:10px;padding-top:10px;display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:13px;font-weight:500;color:#3D4A2E">Total cobrado al cliente</span>
                <span style="font-size:22px;font-weight:700;color:#3D4A2E">$${parseInt(total).toLocaleString('es-CL')}</span>
              </div>
            </div>
            <div style="background:#FAEEDA;border-radius:8px;padding:14px 16px;margin:16px 0">
              <p style="font-size:10px;font-weight:700;color:#854F0B;text-transform:uppercase;letter-spacing:.07em;margin:0 0 10px">🔒 Desglose interno MPS</p>
              <table style="width:100%;font-size:12px;border-collapse:collapse">
                <tr><td style="color:#854F0B;padding:5px 0;border-bottom:1px solid rgba(185,119,23,.2)">Días montaje</td><td style="text-align:right;font-weight:500;color:#633806;padding:5px 0;border-bottom:1px solid rgba(185,119,23,.2)">${Math.ceil(parseInt(dias)/2)} días</td></tr>
                <tr><td style="color:#854F0B;padding:5px 0;border-bottom:1px solid rgba(185,119,23,.2)">Días desmontaje</td><td style="text-align:right;font-weight:500;color:#633806;padding:5px 0;border-bottom:1px solid rgba(185,119,23,.2)">${Math.ceil(parseInt(dias)/2)} días</td></tr>
                <tr><td style="color:#854F0B;padding:5px 0;border-bottom:1px solid rgba(185,119,23,.2)">Recargo altura</td><td style="text-align:right;font-weight:500;color:#633806;padding:5px 0;border-bottom:1px solid rgba(185,119,23,.2)">${recargo === '1.5' ? '+50% aplicado' : 'Sin recargo'}</td></tr>
                <tr><td style="color:#854F0B;padding:5px 0;border-bottom:1px solid rgba(185,119,23,.2)">Costo cuadrilla</td><td style="text-align:right;font-weight:500;color:#633806;padding:5px 0;border-bottom:1px solid rgba(185,119,23,.2)">$${parseInt(costoTrabajadores).toLocaleString('es-CL')}</td></tr>
                <tr><td style="color:#854F0B;padding:5px 0">Utilidad estimada</td><td style="text-align:right;font-weight:700;color:#27500A;padding:5px 0;font-size:14px">$${parseInt(utilidad).toLocaleString('es-CL')}</td></tr>
              </table>
            </div>
            <p style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:16px 0 10px">Datos de contacto</p>
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
            MPS — Montajes Profesionales &amp; Soluciones · mps-andamios.vercel.app
          </div>
        </div>
      `
    });

    // CORREO 2 → al cliente (con onboarding@resend.dev llega a cualquier destinatario)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: correo,
      subject: 'Tu cotización fue recibida — MPS Montajes Profesionales',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#3D4A2E;padding:20px 24px">
            <img src="https://mps-andamios-git-main-ian-perez-s-projects.vercel.app/assets/img/logo-mps.svg" width="44" height="44" alt="MPS" style="background:#F4C430;border-radius:8px;padding:4px;display:block;margin-bottom:10px">
            <h2 style="color:#fff;font-size:15px;font-weight:500;margin:0">Cotización recibida</h2>
            <p style="color:rgba(255,255,255,.6);font-size:11px;margin:4px 0 0">Te contactaremos en menos de 2 horas hábiles</p>
          </div>
          <div style="padding:20px 24px;background:#fff">
            <p style="font-size:13px;color:#555;line-height:1.6;margin:0 0 16px">
              Hola <strong style="color:#222">${nombre}</strong>, recibimos tu solicitud para <strong style="color:#222">${empresa}</strong>. El equipo MPS revisará los detalles y te contactará a la brevedad.
            </p>
            <p style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:0 0 10px">Resumen de tu solicitud</p>
            <table style="width:100%;font-size:12px;border-collapse:collapse">
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Sistema</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${sistema}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Tipo de trabajo</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${tipo}</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Ciudad</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">${ciudad}</td></tr>
              <tr><td style="color:#888;padding:5px 0">Días estimados</td><td style="text-align:right;font-weight:500;padding:5px 0">${dias} días hábiles</td></tr>
            </table>
            <div style="background:#EAF3DE;border-radius:8px;padding:14px 16px;margin:16px 0">
              <table style="width:100%;font-size:12px;border-collapse:collapse">
                <tr><td style="color:#27500A;padding:5px 0;border-bottom:1px solid rgba(61,74,46,.15)">Estimado montaje</td><td style="text-align:right;font-weight:500;color:#27500A;padding:5px 0;border-bottom:1px solid rgba(61,74,46,.15)">$${parseInt(precioMontaje).toLocaleString('es-CL')}</td></tr>
                <tr><td style="color:#27500A;padding:5px 0">Estimado desmontaje</td><td style="text-align:right;font-weight:500;color:#27500A;padding:5px 0">$${parseInt(precioDesm).toLocaleString('es-CL')}</td></tr>
              </table>
              <div style="border-top:1px solid rgba(61,74,46,.25);margin-top:10px;padding-top:10px;display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:13px;font-weight:500;color:#3D4A2E">Estimado total</span>
                <span style="font-size:22px;font-weight:700;color:#3D4A2E">$${parseInt(total).toLocaleString('es-CL')}</span>
              </div>
            </div>
            <p style="font-size:11px;color:#aaa;margin:-8px 0 16px">Valor referencial. MPS confirmará el precio exacto al contactarte.</p>
            <div style="background:#3D4A2E;border-radius:8px;padding:16px 20px;text-align:center;margin:16px 0">
              <p style="color:rgba(255,255,255,.75);font-size:12px;margin:0 0 10px">¿Tienes dudas o quieres agilizar tu cotización?</p>
              <a href="https://wa.me/56954138616" style="display:inline-block;background:#F4C430;color:#3D4A2E;font-size:12px;font-weight:700;padding:9px 22px;border-radius:6px;text-decoration:none">Escríbenos por WhatsApp</a>
            </div>
            <p style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:16px 0 10px">Contacto MPS</p>
            <table style="width:100%;font-size:12px;border-collapse:collapse">
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Teléfono / WhatsApp</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">+56 9 5413 8616</td></tr>
              <tr><td style="color:#888;padding:5px 0;border-bottom:1px solid #f5f5f5">Correo</td><td style="text-align:right;font-weight:500;padding:5px 0;border-bottom:1px solid #f5f5f5">arturoperezm2015@gmail.com</td></tr>
              <tr><td style="color:#888;padding:5px 0">Web</td><td style="text-align:right;font-weight:500;padding:5px 0">mps-andamios.vercel.app</td></tr>
            </table>
          </div>
          <div style="background:#f5f5f5;padding:12px 24px;font-size:11px;color:#aaa;text-align:center">
            MPS — Montajes Profesionales &amp; Soluciones · Este correo fue generado automáticamente.
          </div>
        </div>
      `
    });

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Error Resend:', error);
    return res.status(500).json({ ok: false, error: error.message });
  }
};
