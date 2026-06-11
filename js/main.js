// ============================
// MPS — main.js
// ============================

// ============================
// 0) SUPABASE CONFIG
// ============================
const SUPABASE_URL      = "https://orwnsptmtraujxmeqwph.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_aLZbgzCt2ahyxFkVMD4AqQ_TcaTTV-Y";

function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!window.supabase?.createClient) return null;
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const sb = getSupabaseClient();

async function sendContactToSupabase(payload) {
  if (!sb) return { ok: false, error: "Supabase no cargado." };
  const { error } = await sb.from("contactos").insert([payload]);
  return error ? { ok: false, error: error.message } : { ok: true };
}

async function sendQuoteToSupabase(payload) {
  if (!sb) return { ok: false, error: "Supabase no cargado." };
  const { error } = await sb.from("cotizaciones").insert([payload]);
  return error ? { ok: false, error: error.message } : { ok: true };
}

// ============================
// 1) Año dinámico
// ============================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================
// 2) Scroll suave para anclas internas
// ============================
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href || href === "#") return;
  const target = document.querySelector(href);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.pushState(null, "", href);
});

// ============================
// 3) Hero Slider
// ============================
(function initHeroSlider() {
  const carousel = document.querySelector("#inicio .carousel");
  if (!carousel) return;

  const slides   = Array.from(carousel.querySelectorAll(".slide"));
  const prevBtn  = carousel.querySelector(".ctrl.prev");
  const nextBtn  = carousel.querySelector(".ctrl.next");
  const dotsWrap = carousel.querySelector(".dots");

  let current = slides.findIndex(s => s.classList.contains("is-active"));
  if (current < 0) current = 0;

  let startX = null;

  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Ir a la diapositiva ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap?.appendChild(b);
    return b;
  });

  function updateUI() {
    slides.forEach((s, i) => {
      s.classList.toggle("is-active", i === current);
      s.setAttribute("aria-hidden", i === current ? "false" : "true");
    });
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
  }

  function goTo(i) { current = (i + slides.length) % slides.length; updateUI(); }
  function next()  { goTo(current + 1); }
  function prev()  { goTo(current - 1); }

  nextBtn?.addEventListener("click", next);
  prevBtn?.addEventListener("click", prev);

  carousel.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener("touchend", e => {
    if (startX == null) return;
    const delta = e.changedTouches[0].clientX - startX;
    startX = null;
    if (delta > 40) prev(); else if (delta < -40) next();
  });

  updateUI();
  setInterval(next, 5000);
})();

// ============================
// Slide text animations
// ============================
(function initSlideTextAnimations() {
  const allSlides = document.querySelectorAll(".slide");
  if (!allSlides.length) return;

  function resetAnimations(slide) {
    slide.querySelectorAll(".animate").forEach(el => {
      el.classList.remove("animate");
      void el.offsetWidth;
      el.classList.add("animate");
    });
  }

  const observer = new MutationObserver(() => {
    const active = document.querySelector(".slide.is-active");
    if (active) resetAnimations(active);
  });

  allSlides.forEach(slide => {
    observer.observe(slide, { attributes: true, attributeFilter: ["class"] });
  });
})();

// ============================
// 4) Scroll Reveal
// ============================
(function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  elements.forEach(el => io.observe(el));
})();

// ============================
// 5) Widget Contacto
// ============================
const contactClose = document.querySelector(".contact-close");
const contactPanel = document.querySelector(".contact-panel");
const widgetForm   = document.getElementById("widget-form");
const widgetMsg    = document.getElementById("w-msg");

if (contactClose && contactPanel) {
  contactClose.addEventListener("click", () => contactPanel.classList.remove("is-open"));
}

if (widgetForm && widgetMsg) {
  widgetForm.addEventListener("submit", async e => {
    e.preventDefault();
    const nombre  = document.getElementById("w-nombre")?.value.trim();
    const correo  = document.getElementById("w-correo")?.value.trim();
    const mensaje = document.getElementById("w-mensaje")?.value.trim();

    if (!nombre || !correo || !mensaje) {
      widgetMsg.textContent = "Por favor completa todos los campos.";
      widgetMsg.style.color = "red";
      return;
    }

    widgetMsg.textContent = "Enviando…";
    widgetMsg.style.color = "#334155";

    const res = await sendContactToSupabase({
      nombre, correo, mensaje, created_at: new Date().toISOString(),
    });

    if (!res.ok) {
      console.error("Supabase contactos:", res.error);
      widgetMsg.textContent = "❌ No se pudo enviar.";
      widgetMsg.style.color = "red";
      return;
    }

    widgetMsg.textContent = "✅ Mensaje enviado. Te contactaremos pronto.";
    widgetMsg.style.color = "green";
    widgetForm.reset();
  });
}

// ============================
// 6) Cotización Wizard (4 pasos)
// ============================
(function initQuoteWizard() {
  const modal = document.getElementById("quote-modal");
  if (!modal) return;

  // ── Estado ──
  const st = { step: 1, sistema: null, tipoTrabajo: null, fachadas: 1 };

  // ── Refs ──
  const backdrop = document.getElementById("quote-backdrop");
  const closeBtn  = document.getElementById("quote-close");
  const panels    = Array.from(modal.querySelectorAll(".qw-panel"));
  const steps     = Array.from(modal.querySelectorAll(".qw-step"));
  const lines     = Array.from(modal.querySelectorAll(".qw-line"));

  const sysCards   = modal.querySelectorAll(".sys-card");
  const workBtns   = modal.querySelectorAll(".work-btn");
  const errSistema = document.getElementById("err-sistema");
  const errTipo    = document.getElementById("err-tipo");

  const blitzFields    = document.getElementById("qw-blitz-fields");
  const allroundFields = document.getElementById("qw-allround-fields");
  const inAncho    = document.getElementById("qw-ancho");
  const inAlto     = document.getElementById("qw-alto");
  const fachadasVal = document.getElementById("fachadas-val");
  const inKg       = document.getElementById("qw-kg");
  const inAltura   = document.getElementById("qw-altura");
  const alertEl    = document.getElementById("qw-alert");
  const calcEl     = document.getElementById("qw-calc");

  const inEmpresa = document.getElementById("qw-empresa");
  const inNombre  = document.getElementById("qw-nombre");
  const inCargo   = document.getElementById("qw-cargo");
  const inPrefijo = document.getElementById("qw-prefijo");
  const inTel     = document.getElementById("qw-tel");
  const inCorreo  = document.getElementById("qw-correo");
  const inCiudad  = document.getElementById("qw-ciudad");
  const inObs     = document.getElementById("qw-obs");

  // ── Helpers ──
  function fmtCLP(n) {
    return "$" + Math.round(n || 0).toLocaleString("es-CL");
  }

  function calcularObra() {
    if (!st.sistema || !st.tipoTrabajo) return null;
    const esSuper = st.tipoTrabajo === "supervision";

    if (st.sistema === "blitz") {
      const ancho = parseFloat(inAncho?.value) || 0;
      const alto  = parseFloat(inAlto?.value)  || 0;
      if (!ancho || !alto) return null;

      const m2          = ancho * alto * st.fachadas;
      const rendimiento = alto <= 10 ? 200 : 100;
      const diasM       = Math.ceil(m2 / rendimiento);
      const diasD       = Math.ceil(m2 / rendimiento);
      const recargo     = alto > 10 ? 1.5 : 1;

      const precioM = (!esSuper && st.tipoTrabajo !== "solo-desmontaje") ? m2 * 1800 : 0;
      const precioD = (!esSuper && st.tipoTrabajo !== "solo-montaje")   ? m2 * 1500 : 0;
      const total   = precioM + precioD;

      let diasActivos = st.tipoTrabajo === "solo-montaje"    ? diasM
                      : st.tipoTrabajo === "solo-desmontaje" ? diasD
                      : diasM + diasD;

      const costoTrab = diasActivos * 240000 * recargo;
      const utilidad  = total - costoTrab;

      return { sistema: "blitz", m2, ancho, alto, fachadas: st.fachadas,
               rendimiento, diasM, diasD, recargo,
               precioM, precioD, total, costoTrab, utilidad };
    }

    if (st.sistema === "allround") {
      const kg     = parseFloat(inKg?.value)     || 0;
      const altura = parseFloat(inAltura?.value)  || 0;
      if (!kg || !altura) return null;

      const rendimiento = altura <= 10 ? 2400 : 1200;
      const metodo      = altura <= 10 ? "Cadena humana" : "Roldana";
      const diasM       = Math.ceil(kg / rendimiento);
      const diasD       = Math.ceil(kg / rendimiento);
      const recargo     = altura > 10 ? 1.5 : 1;

      const precioM = (!esSuper && st.tipoTrabajo !== "solo-desmontaje") ? kg * 380 : 0;
      const precioD = (!esSuper && st.tipoTrabajo !== "solo-montaje")   ? kg * 350 : 0;
      const total   = precioM + precioD;

      let diasActivos = st.tipoTrabajo === "solo-montaje"    ? diasM
                      : st.tipoTrabajo === "solo-desmontaje" ? diasD
                      : diasM + diasD;

      const costoTrab = diasActivos * 240000 * recargo;
      const utilidad  = total - costoTrab;

      return { sistema: "allround", kg, altura, rendimiento, metodo,
               diasM, diasD, recargo,
               precioM, precioD, total, costoTrab, utilidad };
    }

    return null;
  }

  function renderCalc(c) {
    if (!c) { calcEl.hidden = true; return; }

    const tipoLabel = {
      "montaje-desmontaje": "Montaje y desmontaje",
      "solo-montaje":       "Solo montaje",
      "solo-desmontaje":    "Solo desmontaje",
      "supervision":        "Supervisión",
    }[st.tipoTrabajo] || "";

    const row = (l, v) => `<div class="qw-calc-row"><span>${l}</span><span>${v}</span></div>`;

    let html = `<p class="qw-calc-title">Estimación — ${tipoLabel}</p>`;

    if (c.sistema === "blitz") {
      html += row("M² totales", `${c.m2.toLocaleString("es-CL")} m²`);
      html += row("Días estimados", `${c.diasM + c.diasD} días`);
    } else {
      html += row("Kilogramos", `${c.kg.toLocaleString("es-CL")} kg`);
      html += row("Método de izaje", c.metodo);
      html += row("Días estimados", `${c.diasM + c.diasD} días`);
    }

    if (c.precioM > 0) html += row("Montaje",    fmtCLP(c.precioM));
    if (c.precioD > 0) html += row("Desmontaje", fmtCLP(c.precioD));

    html += `<hr class="qw-calc-divider">`;
    html += `<div class="qw-calc-total"><span>Total estimado</span><span>${c.total > 0 ? fmtCLP(c.total) : "—"}</span></div>`;
    html += `<p class="qw-calc-nota">Estimación referencial sin IVA. El precio final puede variar según condiciones de la obra.</p>`;

    calcEl.hidden = false;
    calcEl.innerHTML = html;
  }

  function recalcular() {
    if (!st.sistema) return;
    const altVal = st.sistema === "blitz"
      ? parseFloat(inAlto?.value)   || 0
      : parseFloat(inAltura?.value) || 0;
    if (alertEl) alertEl.hidden = altVal <= 10 || altVal === 0;
    renderCalc(calcularObra());
  }

  // ── Navegación ──
  function goToStep(n) {
    st.step = n;
    panels.forEach((p, i) => p.classList.toggle("is-active", i + 1 === n));
    steps.forEach((s, i) => {
      const num = i + 1;
      const dot = s.querySelector(".qw-dot");
      s.classList.remove("is-active", "is-done");
      if (num < n)       { s.classList.add("is-done");   if (dot) dot.textContent = "✓"; }
      else if (num === n){ s.classList.add("is-active"); if (dot) dot.textContent = num; }
      else               { if (dot) dot.textContent = num; }
    });
    lines.forEach((l, i) => l.classList.toggle("is-done", i + 1 < n));
    modal.querySelector(".qw-card")?.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Abrir / cerrar ──
  function abrirModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function cerrarModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    setTimeout(resetWizard, 300);
  }

  function resetWizard() {
    st.sistema = null; st.tipoTrabajo = null; st.fachadas = 1;
    sysCards.forEach(c => c.classList.remove("is-selected"));
    workBtns.forEach(b => b.classList.remove("is-selected"));
    modal.querySelectorAll(".qw-err").forEach(e => e.hidden = true);
    [inAncho, inAlto, inKg, inAltura, inEmpresa, inNombre, inCargo, inTel, inCorreo, inObs]
      .forEach(i => { if (i) i.value = ""; });
    if (inCiudad)   inCiudad.value = "";
    if (fachadasVal) fachadasVal.textContent = "1";
    if (calcEl)  { calcEl.hidden = true;  calcEl.innerHTML = ""; }
    if (alertEl)   alertEl.hidden = true;
    goToStep(1);
  }

  // ── Selección sistema ──
  sysCards.forEach(card => {
    card.addEventListener("click", () => {
      sysCards.forEach(c => c.classList.remove("is-selected"));
      card.classList.add("is-selected");
      st.sistema = card.dataset.sistema;
      if (errSistema) errSistema.hidden = true;
    });
  });

  // ── Selección tipo de trabajo ──
  workBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      workBtns.forEach(b => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      st.tipoTrabajo = btn.dataset.tipo;
      if (errTipo) errTipo.hidden = true;
    });
  });

  // ── Contador fachadas ──
  document.getElementById("fachadas-minus")?.addEventListener("click", () => {
    if (st.fachadas > 1) {
      st.fachadas--;
      if (fachadasVal) fachadasVal.textContent = st.fachadas;
      recalcular();
    }
  });
  document.getElementById("fachadas-plus")?.addEventListener("click", () => {
    st.fachadas++;
    if (fachadasVal) fachadasVal.textContent = st.fachadas;
    recalcular();
  });

  [inAncho, inAlto, inKg, inAltura].forEach(i => i?.addEventListener("input", recalcular));

  // ── Step 1 → 2 ──
  document.getElementById("qw-next-1")?.addEventListener("click", () => {
    let ok = true;
    if (!st.sistema)     { if (errSistema) errSistema.hidden = false; ok = false; }
    if (!st.tipoTrabajo) { if (errTipo)    errTipo.hidden    = false; ok = false; }
    if (!ok) return;

    if (blitzFields)    blitzFields.hidden    = st.sistema !== "blitz";
    if (allroundFields) allroundFields.hidden = st.sistema !== "allround";
    recalcular();
    goToStep(2);
  });

  // ── Step 2 → 1 ──
  document.getElementById("qw-prev-2")?.addEventListener("click", () => goToStep(1));

  // ── Step 2 → 3 ──
  document.getElementById("qw-next-2")?.addEventListener("click", () => {
    let ok = true;
    if (st.sistema === "blitz") {
      const a = parseFloat(inAncho?.value), b = parseFloat(inAlto?.value);
      const errA = document.getElementById("err-ancho");
      const errB = document.getElementById("err-alto");
      if (!a || a <= 0) { if (errA) errA.hidden = false; ok = false; } else if (errA) errA.hidden = true;
      if (!b || b <= 0) { if (errB) errB.hidden = false; ok = false; } else if (errB) errB.hidden = true;
    } else {
      const a = parseFloat(inKg?.value), b = parseFloat(inAltura?.value);
      const errA = document.getElementById("err-kg");
      const errB = document.getElementById("err-altura");
      if (!a || a <= 0) { if (errA) errA.hidden = false; ok = false; } else if (errA) errA.hidden = true;
      if (!b || b <= 0) { if (errB) errB.hidden = false; ok = false; } else if (errB) errB.hidden = true;
    }
    if (ok) goToStep(3);
  });

  // ── Step 3 → 2 ──
  document.getElementById("qw-prev-3")?.addEventListener("click", () => goToStep(2));

  // ── Submit ──
  document.getElementById("qw-submit")?.addEventListener("click", async () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const empresa = inEmpresa?.value.trim()  || "";
    const nombre  = inNombre?.value.trim()   || "";
    const cargo   = inCargo?.value.trim()    || "";
    const correo  = inCorreo?.value.trim()   || "";
    const ciudad  = inCiudad?.value          || "";
    const telRaw  = inTel?.value.trim()      || "";
    const prefijo = inPrefijo?.value         || "+56";

    const checks = [
      ["err-empresa", empresa, v => v.length >= 2],
      ["err-nombre",  nombre,  v => v.length >= 2],
      ["err-cargo",   cargo,   v => v.length >= 1],
      ["err-correo",  correo,  v => emailRe.test(v)],
      ["err-ciudad",  ciudad,  v => v.length >= 1],
    ];

    let ok = true;
    checks.forEach(([id, val, test]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const pass = test(val);
      el.hidden = pass;
      if (!pass) ok = false;
    });

    const digits  = telRaw.replace(/\D/g, "");
    let telefono  = null;
    const errTelEl = document.getElementById("err-tel");
    if (prefijo === "+56") {
      if (/^9\d{8}$/.test(digits))      telefono = "56" + digits;
      else if (/^569\d{8}$/.test(digits)) telefono = digits;
      else { if (errTelEl) errTelEl.hidden = false; ok = false; }
    } else {
      if (digits.length >= 7 && digits.length <= 12) telefono = prefijo.replace("+", "") + digits;
      else { if (errTelEl) errTelEl.hidden = false; ok = false; }
    }
    if (ok && errTelEl) errTelEl.hidden = true;

    if (!ok) return;

    const submitBtn = document.getElementById("qw-submit");
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Enviando…"; }

    const obs = inObs?.value.trim() || "";
    const c   = calcularObra();

    // ── Supabase ──
    const payloadFull = {
      tipo_andamio: st.sistema,
      tipo_trabajo: st.tipoTrabajo,
      ...(st.sistema === "blitz" ? {
        ancho:    parseFloat(inAncho?.value)  || null,
        alto:     parseFloat(inAlto?.value)   || null,
        fachadas: st.fachadas,
        m2_blitz: c?.m2 ?? null,
      } : {
        kg_allround:     parseFloat(inKg?.value)     || null,
        altura_allround: parseFloat(inAltura?.value) || null,
      }),
      empresa,
      nombre_contacto: nombre,
      cargo,
      telefono,
      correo,
      ciudad,
      observaciones:     obs || null,
      precio_montaje:    c?.precioM  ?? null,
      precio_desmontaje: c?.precioD  ?? null,
      precio_total:      c?.total    ?? null,
      created_at: new Date().toISOString(),
    };

    const r1 = await sendQuoteToSupabase(payloadFull);
    if (!r1.ok) {
      console.warn("Supabase full payload:", r1.error);
      const r2 = await sendQuoteToSupabase({
        tipo_andamio: st.sistema, empresa, telefono, correo, ciudad,
        created_at: new Date().toISOString(),
      });
      if (!r2.ok) console.error("Supabase fallback:", r2.error);
    }

    // ── Email (Resend vía /api/cotizacion) ──
    try {
      const tipoLabel = {
        "montaje-desmontaje": "Montaje y desmontaje",
        "solo-montaje":       "Solo montaje",
        "solo-desmontaje":    "Solo desmontaje",
        "supervision":        "Supervisión de obra",
      }[st.tipoTrabajo] || st.tipoTrabajo;

      const resendRes = await fetch("/api/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sistema:           st.sistema === "blitz" ? "Blitz (fachada)" : "Allround (pesaje)",
          tipo:              tipoLabel,
          ancho:             parseFloat(inAncho?.value)   || 0,
          alto:              parseFloat(inAlto?.value)    || 0,
          fachadas:          st.fachadas,
          kg:                parseFloat(inKg?.value)      || 0,
          alturaMaxima:      st.sistema === "blitz"
                               ? parseFloat(inAlto?.value)   || 0
                               : parseFloat(inAltura?.value) || 0,
          metodoIzaje:       c?.metodo  || "",
          m2:                c?.m2      || 0,
          dias:              (c?.diasM  || 0) + (c?.diasD || 0),
          precioMontaje:     c?.precioM || 0,
          precioDesm:        c?.precioD || 0,
          total:             c?.total   || 0,
          costoTrabajadores: c?.costoTrab || 0,
          utilidad:          c?.utilidad  || 0,
          recargo:           String(c?.recargo || 1),
          empresa, nombre, cargo, telefono, correo, ciudad,
          observaciones:     obs,
        }),
      });
      const resendData = await resendRes.json();
      console.log("Resend status:", resendRes.status, resendData);
      if (!resendRes.ok) {
        console.error("Error Resend:", resendData);
      }
    } catch (e) {
      console.error("Error fetch cotizacion:", e);
    }

    goToStep(4);
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Enviar cotización"; }
  });

  // ── Paso 4: cerrar ──
  document.getElementById("qw-done")?.addEventListener("click", cerrarModal);

  // ── Cerrar X / backdrop / Escape ──
  closeBtn?.addEventListener("click",  cerrarModal);
  backdrop?.addEventListener("click",  cerrarModal);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) cerrarModal();
  });

  // ── Triggers externos ──
  document.getElementById("btn-cotizacion")?.addEventListener("click", e => {
    e.preventDefault(); abrirModal();
  });
  document.querySelectorAll(".js-abrir-cotizacion").forEach(btn => {
    btn.addEventListener("click", e => { e.preventDefault(); abrirModal(); });
  });

  // ── Auto-open por URL ?cotizar=1 ──
  if (new URLSearchParams(window.location.search).get("cotizar") === "1") {
    abrirModal();
    history.replaceState(null, "", window.location.pathname);
  }

  window.abrirCotizacion  = abrirModal;
  window.cerrarCotizacion = cerrarModal;
})();

// ============================
// 7) Navbar mobile (hamburguesa)
// ============================
(function initMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav       = document.querySelector(".topbar .nav");
  if (!navToggle || !nav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".topbar")) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
})();

// ============================
// 8) Slider de proyectos + lightbox
// ============================
(function initProjectGallery() {
  const galleries    = document.querySelectorAll(".project-gallery");
  const lightbox     = document.getElementById("lightbox");
  const lightboxImg  = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev  = document.getElementById("lightbox-prev");
  const lightboxNext  = document.getElementById("lightbox-next");

  let currentGalleryImages = [];
  let currentLightboxIndex = 0;

  function updateLightboxImage() {
    if (!lightboxImg || !currentGalleryImages.length) return;
    const img = currentGalleryImages[currentLightboxIndex];
    if (img) { lightboxImg.src = img.src; lightboxImg.alt = img.alt || "Imagen ampliada"; }
  }

  function openLightbox(images, index) {
    if (!lightbox) return;
    currentGalleryImages = images;
    currentLightboxIndex = index >= 0 ? index : 0;
    updateLightboxImage();
    lightbox.classList.add("active");
  }

  function closeLightbox() {
    lightbox?.classList.remove("active");
  }

  function showNextLightboxImage() {
    if (!currentGalleryImages.length) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryImages.length;
    updateLightboxImage();
  }

  function showPrevLightboxImage() {
    if (!currentGalleryImages.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    updateLightboxImage();
  }

  galleries.forEach(gallery => {
    const images = Array.from(gallery.querySelectorAll(".gallery-image"));
    const next   = gallery.querySelector(".next");
    const prev   = gallery.querySelector(".prev");
    if (!images.length) return;

    let index = images.findIndex(img => img.classList.contains("active"));
    if (index < 0) index = 0;

    function show(i) { images.forEach(img => img.classList.remove("active")); images[i].classList.add("active"); index = i; }

    next?.addEventListener("click", e => { e.stopPropagation(); show((index + 1) % images.length); });
    prev?.addEventListener("click", e => { e.stopPropagation(); show((index - 1 + images.length) % images.length); });
    images.forEach(img => {
      img.addEventListener("click", () => {
        const ai = images.findIndex(i => i.classList.contains("active"));
        openLightbox(images, ai >= 0 ? ai : 0);
      });
    });

    show(index);
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxNext?.addEventListener("click",  showNextLightboxImage);
  lightboxPrev?.addEventListener("click",  showPrevLightboxImage);
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", e => {
    if (!lightbox?.classList.contains("active")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowRight") showNextLightboxImage();
    if (e.key === "ArrowLeft")  showPrevLightboxImage();
  });
})();

// ============================
// 9) Tabs de servicios
// ============================
(function () {
  const tabBtns    = document.querySelectorAll(".tab-btn");
  const tabPanels  = document.querySelectorAll(".tab-panel");
  const tabsSelect = document.querySelector(".tabs-select");
  if (!tabBtns.length) return;

  function switchTab(tabName) {
    tabBtns.forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.tab === tabName);
      btn.setAttribute("aria-selected", btn.dataset.tab === tabName);
    });
    tabPanels.forEach(panel => panel.classList.toggle("is-active", panel.id === "tab-" + tabName));
    if (tabsSelect) tabsSelect.value = tabName;
  }

  tabBtns.forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
  tabsSelect?.addEventListener("change", () => switchTab(tabsSelect.value));
})();

// ============================
// 10) Filtro de proyectos
// ============================
(function () {
  const filtros = document.querySelectorAll(".filtro-btn");
  const cards   = document.querySelectorAll(".proj-card");
  if (!filtros.length) return;

  filtros.forEach(btn => {
    btn.addEventListener("click", () => {
      filtros.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        card.style.display = (filter === "todos" || card.dataset.tipo === filter) ? "" : "none";
      });
    });
  });
})();

// ============================
// 11) Modal detalle proyecto
// ============================
(function () {
  const projModal    = document.getElementById("proj-modal");
  const projBackdrop = document.getElementById("proj-modal-backdrop");
  const projClose    = document.getElementById("proj-modal-close");
  const projImg      = document.getElementById("proj-modal-img");
  const projBadge    = document.getElementById("proj-modal-badge");
  const projTitle    = document.getElementById("proj-modal-title");
  const projLocation = document.getElementById("proj-modal-location");
  const projDesc     = document.getElementById("proj-modal-desc");
  if (!projModal) return;

  function openProjModal(data) {
    projImg.src = data.img; projImg.alt = data.title;
    projBadge.textContent = data.badge;
    projBadge.className   = "proj-modal-badge " + data.tipo;
    projTitle.textContent    = data.title;
    projLocation.textContent = "📍 " + data.location;
    projDesc.textContent     = data.desc;
    projModal.classList.add("is-open");
    projModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeProjModal() {
    projModal.classList.remove("is-open");
    projModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll(".proj-card-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".proj-card");
      openProjModal({
        img:      card.dataset.img,
        title:    card.dataset.title,
        badge:    card.dataset.badge,
        tipo:     card.dataset.tipo,
        location: card.dataset.location,
        desc:     card.dataset.desc,
      });
    });
  });

  projBackdrop?.addEventListener("click", closeProjModal);
  projClose?.addEventListener("click",    closeProjModal);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && projModal?.classList.contains("is-open")) closeProjModal();
  });
})();

// ============================
// Navbar glass — más opaco al scrollear
// ============================
(function initNavbarScroll() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;
  const onScroll = () => topbar.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
