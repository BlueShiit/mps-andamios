# CLAUDE.md — MPS Montajes Profesionales & Soluciones

## Idioma

Responde siempre en **español**.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3 personalizado, JavaScript vanilla (ES2020+) |
| Tipografía | Google Fonts — Inter (400, 600, 800) |
| Base de datos | Supabase (PostgreSQL) vía SDK JS (`@supabase/supabase-js@2`, CDN) |
| Hosting / Deploy | Netlify (sitio estático + Netlify Forms) |
| Funciones serverless | Netlify Functions (Node.js CommonJS) |
| Envío de correo | Nodemailer via SMTP (variables de entorno en Netlify) |
| Control de versiones | Git — repositorio en GitHub (`BlueShiit/MPS`) |

### Variables de entorno (Netlify)
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`

### Credenciales e IDs conocidos
- Email de contacto: `arturoperezm2015@gmail.com`
- WhatsApp: `+56 9 5413 8616` → URL: `https://wa.me/56954138616?text=Hola%20MPS,%20me%20gustaría%20cotizar.`
- Supabase URL: `https://orwnsptmtraujxmeqwph.supabase.co`
- Supabase Project Ref: `orwnsptmtraujxmeqwph`
- Netlify Site ID: `ea0c7d65-90d5-4135-90eb-3d1c5b56a66f`
- Netlify URL: `https://mps-andamios.netlify.app`
- Ubicación: Puente Alto, Región Metropolitana, Chile

### Acceso a infraestructura desde Claude Code
- **Supabase Management API**: requiere Personal Access Token (PAT) de `supabase.com/dashboard/account/tokens`. Con él se puede ejecutar SQL via `POST https://api.supabase.com/v1/projects/{ref}/database/query`
- **Netlify API**: usa el mismo PAT de Supabase (funciona como bearer token para Netlify también)
- **psql / Supabase CLI**: no instalados en el equipo. Homebrew tampoco instalado.

---

## Estructura de carpetas

```
MPS/
├── assets/
│   └── img/              # hero1.jpg, hero2.jpg, hero3.jpg, montaje.jpg,
│                         # servicios.jpg, supervision.jpg,
│                         # logo-mps-definitivo.svg  ← logo activo (navbar + footer)
│                         # logo-mps.svg             ← versión anterior (sin uso)
│                         # logo-mps-navbar.svg      ← versión original (sin uso)
├── css/
│   └── style.css         # Todos los estilos del sitio (único archivo CSS)
├── js/
│   └── main.js           # Toda la lógica frontend
├── netlify/
│   └── functions/
│       └── send-mail.js  # Función serverless: emails con Nodemailer
├── index.html            # Página principal
├── nosotros.html         # Página "Conócenos" — reestructurada completamente
├── servicios.html        # Tres servicios con tabs
├── proyectos.html        # Grilla de proyectos con filtros y modal de detalle
├── package.json          # Dependencias: nodemailer
└── CLAUDE.md             # Este archivo
```

---

## Páginas y navbar

Todas las páginas comparten el mismo navbar con estos 4 enlaces:
- **Inicio** → `index.html`
- **Conócenos** → `nosotros.html`
- **Servicios** → `servicios.html`
- **Proyectos** → `proyectos.html`

**Logo activo:** `assets/img/logo-mps-definitivo.svg` — SVG de Inkscape con fondo transparente. Se usa en navbar (`height: 65px`) y footer (`height: 36px`, `filter: brightness(0) invert(1)` para fondo oscuro).

**Navbar mobile:** todas las páginas tienen un `<button class="nav-toggle">` con 3 `<span class="nav-toggle-bar">`. En ≤768px el botón hamburguesa aparece, la `.nav` se oculta y se muestra con clase `.is-open`. Al hacer clic en un enlace o fuera del navbar, el menú se cierra. Lógica en `initMobileNav()` en `main.js`.

---

## Funcionalidades implementadas

### Hero / Slider (`index.html`)
- 3 slides: pill + título + botón CTA
- **Slide 1** — pill: *"Especialistas en trabajo en altura"*, título: *"Andamios industriales certificados"*, CTA: *"Cotiza tu proyecto"* → abre modal de cotización (`id="btn-cotizacion"`)
- **Slide 2** — pill: *"Conócenos"*, título: *"Un equipo. Una forma de trabajar."*, CTA → `nosotros.html`
- **Slide 3** — pill: *"Servicios & Proyectos"*, título: *"Explora lo que hacemos en obra"*, CTA → `servicios.html`
- Autoplay 6s, controles prev/next, dots, swipe táctil, pausa en hover
- Mobile (≤768px): flechas reducidas a 44×44px, posición a 10px del borde

### Secciones de index.html (en orden)
1. **Hero slider** (`#inicio`)
2. **Franja de estadísticas** (`.stats-band`) — fondo `#0f172a`, 4 métricas: +80 proyectos, +6 años, +500 ton, 0 accidentes
3. **Sistemas que utilizamos** (`.sistemas-section`) — cards Blitz y Allround con tipografía grande
4. **Nosotros** (`#nosotros`) — 6 about-cards en grilla 3 columnas + párrafo intro reescrito
5. **¿Cómo trabajamos?** (`.proceso-section`) — 4 pasos con ícono SVG + número + descripción
6. **CTA intermedio** (`.cta-band`) — fondo oscuro, botón dorado `.cta-gold`, clase `.js-abrir-cotizacion`
7. **¿Dónde operamos?** (`.cobertura-section`) — chips de comunas RM
8. **Conoce nuestro trabajo** (`#explorar`) — cards con imagen a servicios y proyectos *(antes se llamaba "Explorar")*

### Página Conócenos (`nosotros.html`) — estructura actual
1. **Hero pequeño** (`.page-hero`) — fondo `#0f172a`, título en `#FFB703`, subtítulo
2. **Quiénes somos** (`.qs-section`) — grid 2 col: texto narrativo (izq) + quote azul marino con stats (der). Clases: `.qs-grid`, `.qs-text-col`, `.qs-quote-col`, `.qs-quote`, `.qs-stats`, `.qs-stat`
3. **6 secciones expandidas** (`.nos-expanded`) — cada una en `.nos-exp-item`, layout alternado (`.nos-exp-item--alt` invierte columnas con `direction: rtl`). Clases: `.nos-exp-grid`, `.nos-exp-text`, `.nos-exp-highlight`, `.nos-exp-icon`, `.nos-exp-title`, `.nos-exp-para`, `.nos-exp-list`. Secciones con IDs: `#por-que-mps`, `#hse-documentacion`, `#seguridad`, `#mision`, `#experiencia`, `#soluciones-integrales`
4. **Nuestro equipo** (`.equipo-section`) — 3 cards con avatar SVG placeholder: Arturo Pérez M. (Gerente), Carlos Ramírez V. (Operaciones), Rodrigo Fuentes A. (HSE)
5. **Franja de valores** (`.valores-band`) — 4 valores: Seguridad / Compromiso / Calidad / Puntualidad

### Página Servicios (`servicios.html`)
- **Hero** (`.page-hero`) — fondo oscuro, título "Nuestros Servicios"
- **Tabs de 3 servicios** — nav `.tabs-nav` + paneles `.tab-panel`. En mobile (<580px) se reemplaza por `<select class="tabs-select">`. JS en `main.js` maneja el switching.
  - `tab-montaje`: Montaje y desmontaje (imagen: `montaje.jpg`)
  - `tab-supervision`: Supervisión de obras (imagen: `supervision.jpg`)
  - `tab-hse`: Gestión HSE (imagen: `servicios.jpg`)
- **Panel layout**: `.svc-panel` — grid horizontal imagen+contenido (colapsa a columna en mobile)
- **¿Por qué contratarnos?** (`.dif-section`) — 4 diferenciadores en `.dif-card`
- **CTA final** (`.cta-band`)

### Página Proyectos (`proyectos.html`)
- **Hero** (`.page-hero`)
- **Filtros** (`.proyectos-filtros`) — 4 botones `.filtro-btn`: Todos / Montaje / Desmontaje / Supervisión
- **Grilla** (`.proyectos-grid`, 3 col → 2 → 1) — 6 proyectos ficticios
  - 2 Montaje: Fachada Residencial Torre Norte (Puente Alto), Estructura Comercial Las Américas (La Florida)
  - 2 Desmontaje: Torre Corporativa Centro (Las Condes), Planta de Procesamiento Quilicura
  - 2 Supervisión: Proyecto Habitacional Maipú, Centro Logístico San Bernardo
- **Modal de detalle** (`.proj-modal`, `id="proj-modal"`) — se puebla con `data-*` del card

### Botón flotante WhatsApp (todas las páginas)
- Elemento: `<a class="contact-toggle" href="https://wa.me/56954138616?text=..." target="_blank" rel="noopener">`
- Fondo: `#25D366` (verde oficial WhatsApp)
- Ícono: SVG de WhatsApp blanco, 40×40px dentro de botón 72×72px
- Posición: `fixed`, `bottom: 24px`, `left: 24px`, `z-index: 50`
- Comportamiento: redirige directamente al chat de WhatsApp (no abre panel)
- Animaciones: `contactFadeIn`, `contactHalo` (halo verde pulsante), `iconBounce`, `iconShake`
- **Nota:** `index.html` conserva el HTML del panel `.contact-panel` (residual, inaccessible), las demás páginas solo tienen el botón `<a>`

### Modal de cotización — Wizard 4 pasos
- Presente en: `index.html`, `servicios.html`, `proyectos.html` (idéntico en los 3)
- Se abre con `id="btn-cotizacion"`, clase `.js-abrir-cotizacion`, o URL `?cotizar=1`
- `window.abrirCotizacion()` / `window.cerrarCotizacion()` expuestas globalmente
- Al cerrar: `resetWizard()` limpia estado, selecciones y campos, vuelve al paso 1
- Flujo de envío: Supabase → Netlify Forms (form oculto `#qw-netlify-form`) → `send-mail`
- Hay un `<form hidden id="qw-netlify-form" data-netlify="true">` al final del modal para que Netlify detecte el form en el build estático

**Estructura del wizard (`.quote-card.qw-card`):**
| Panel | ID | Contenido |
|---|---|---|
| Paso 1 | `#qw-panel-1` | Tarjetas sistema (`.sys-card`) + botones tipo trabajo (`.work-btn`) |
| Paso 2 | `#qw-panel-2` | Campos dimensiones + contador fachadas + alerta altura + cálculo en tiempo real |
| Paso 3 | `#qw-panel-3` | Datos contacto (empresa, nombre, cargo, teléfono, correo, ciudad, observaciones) |
| Paso 4 | `#qw-panel-4` | Confirmación: "Tu cotización fue enviada. El equipo MPS te contactará en menos de 2 horas hábiles." |

**Indicador de pasos:** `.qw-steps` → 4 `.qw-step` con `.qw-dot` (número) + `.qw-lbl`. Estados: `is-active` (azul), `is-done` (verde, muestra ✓ via JS). Líneas conectoras `.qw-line` se vuelven verdes con `is-done`.

### Formulario de cotización — campos por paso

**Paso 1:**
- Sistema: `.sys-card[data-sistema="blitz"]` / `.sys-card[data-sistema="allround"]` — tarjetas visuales con SVG e ícono
- Tipo de trabajo: `.work-btn[data-tipo]` — 4 opciones: `montaje-desmontaje`, `solo-montaje`, `solo-desmontaje`, `supervision`

**Paso 2 (Blitz):** `#qw-ancho` (m), `#qw-alto` (m), contador `#fachadas-val` (botones `#fachadas-minus` / `#fachadas-plus`, mínimo 1)
**Paso 2 (Allround):** `#qw-kg` (kg totales), `#qw-altura` (altura máxima m)
- Alerta `#qw-alert` aparece automáticamente si altura > 10m
- Caja `#qw-calc` muestra cálculo en tiempo real al escribir

**Paso 3:** `#qw-empresa`, `#qw-nombre`, `#qw-cargo`, `#qw-prefijo` + `#qw-tel` (`phone-wrap`), `#qw-correo`, `#qw-ciudad` (select con optgroups RM + otras ciudades), `#qw-obs` (textarea opcional)
- Teléfono: **Solo 4 países**: Chile +56 (defecto), Argentina +54, Perú +51, Bolivia +591
- Ciudad: select con optgroup "Región Metropolitana" (32 comunas) + "Otras ciudades" (Rancagua, Valparaíso, Viña del Mar, Otra)

Errores de validación: elementos `<p class="qw-err" id="err-*" hidden>` que se muestran/ocultan por JS.

### Algoritmo de cotización (`calcularObra()` en `initQuoteWizard`)

**Blitz:**
```
m² = ancho × alto × fachadas
rendimiento = alto ≤ 10m → 200 m²/día | alto > 10m → 100 m²/día
diasM = diasD = ⌈m² ÷ rendimiento⌉
recargo = alto > 10m → 1.5 | sino 1
precioM = m² × $1.800  (0 si solo-desmontaje o supervisión)
precioD = m² × $1.500  (0 si solo-montaje o supervisión)
```

**Allround:**
```
rendimiento = altura ≤ 10m → 2.400 kg/día | altura > 10m → 1.200 kg/día
metodo = altura ≤ 10m → "Cadena humana" | altura > 10m → "Roldana"
diasM = diasD = ⌈kg ÷ rendimiento⌉
recargo = altura > 10m → 1.5 | sino 1
precioM = kg × $380  (0 si solo-desmontaje o supervisión)
precioD = kg × $350  (0 si solo-montaje o supervisión)
```

**Ambos sistemas:**
```
diasActivos = solo-montaje→diasM | solo-desmontaje→diasD | resto→diasM+diasD
costoTrab = diasActivos × $240.000 × recargo
utilidad = total - costoTrab
```

Retorna objeto: `{ sistema, m2/kg, diasM, diasD, recargo, precioM, precioD, total, costoTrab, utilidad, ...dims }`

### Supabase — tabla `cotizaciones`
Columnas actuales enviadas por el wizard:
`id`, `created_at`, `tipo_andamio`, `tipo_trabajo`, `ancho`, `alto`, `fachadas`, `m2_blitz`, `kg_allround`, `altura_allround`, `empresa`, `nombre_contacto`, `cargo`, `telefono`, `correo`, `ciudad`, `observaciones`, `precio_montaje`, `precio_desmontaje`, `precio_total`

Fallback defensivo: si el insert falla (columnas nuevas no existen en Supabase), reintenta con payload mínimo `{ tipo_andamio, empresa, telefono, correo, ciudad, created_at }`.

### Email automático (`netlify/functions/send-mail.js`)
- Asunto admin: `Nueva cotización MPS — [SISTEMA] — [Empresa] — [Ciudad]`
- `emailAdminHTML(data)`: 4 secciones — Datos de la obra / Estimado de precios / **Desglose interno MPS** (días, recargo, costo cuadrilla, utilidad — nunca visible al cliente) / Datos de contacto
- `emailClienteHTML(data)`: confirmación con estimado de precios (sin desglose interno)
- Helpers: `seccionObra()`, `seccionPrecios()`, `seccionInterna()`, `seccionContacto()`, `fmtCLP()`, `esc()`

### JS — funciones y módulos en `main.js`
| Función / Módulo | Descripción |
|---|---|
| `initQuoteWizard()` | IIFE principal del wizard: estado, navegación, cálculo, validación, envío |
| `calcularObra()` | Algoritmo de precios MPS — retorna objeto con días, precios, costos, utilidad |
| `renderCalc(c)` | Renderiza la caja `.qw-calc` con resultado en tiempo real |
| `goToStep(n)` | Navega entre pasos: actualiza panels, dots, lines |
| `abrirModal()` / `cerrarModal()` | Abrir/cerrar + `resetWizard()` con delay 300ms al cerrar |
| `window.abrirCotizacion` / `window.cerrarCotizacion` | Aliases globales expuestos por el wizard |
| `.js-abrir-cotizacion` | Clase para cualquier botón que abra el modal |
| `initHeroSlider()` | Carrusel del hero con autoplay, dots, swipe |
| `initMobileNav()` | Hamburger toggle, cierre al hacer clic en enlace o fuera |
| Tabs (servicios.html) | Switch de paneles por `data-tab`; mobile usa `<select>` |
| Filtro proyectos | Botones `.filtro-btn` filtran `.proj-card` por `data-tipo` |
| Modal proyecto | `.proj-card-btn` abre `.proj-modal` con datos del `data-*` del card |
| Scroll reveal | `IntersectionObserver` sobre `.reveal` |
| Auto-open modal | Detecta `?cotizar=1` dentro del wizard IIFE (sin DOMContentLoaded extra) |

### CSS — clases relevantes
| Clase | Uso |
|---|---|
| `.page-hero` / `.page-hero-title` / `.page-hero-sub` | Hero oscuro páginas internas |
| `.stats-band` / `.stats-grid` / `.stat-item` | Franja estadísticas (index) |
| `.sistemas-section` / `.sistema-card` / `.sistema-nombre` | Sección Blitz/Allround |
| `.proceso-section` / `.pasos-grid` / `.paso-card` | Sección ¿Cómo trabajamos? |
| `.cta-band` / `.cta-gold` | Franja CTA con botón dorado |
| `.cobertura-section` / `.comunas-grid` / `.comuna-chip` | Cobertura geográfica |
| `.qs-section` / `.qs-grid` / `.qs-quote` / `.qs-stats` | Quiénes somos (nosotros.html) |
| `.nos-expanded` / `.nos-exp-item` / `.nos-exp-item--alt` | Secciones expandidas (nosotros.html) |
| `.nos-exp-grid` / `.nos-exp-text` / `.nos-exp-highlight` | Layout interno secciones expandidas |
| `.nos-exp-icon` / `.nos-exp-title` / `.nos-exp-list` | Elementos dentro de cada sección |
| `.equipo-grid` / `.equipo-card` / `.equipo-foto` | Sección del equipo |
| `.valores-band` / `.valores-grid` / `.valor-item` | Franja de valores |
| `.tabs-wrap` / `.tabs-nav` / `.tab-btn` / `.tabs-select` | Tabs de servicios |
| `.tab-panel.is-active` | Panel visible de tabs |
| `.svc-panel` / `.svc-panel-media` / `.svc-panel-body` | Layout servicios |
| `.dif-grid` / `.dif-card` / `.dif-icon` | Diferenciadores servicios |
| `.proyectos-filtros` / `.filtro-btn.is-active` | Filtros de proyectos |
| `.proyectos-grid` / `.proj-card` / `.proj-card-badge` | Grilla de proyectos |
| `.proj-modal` / `.proj-modal-card` / `.proj-modal-badge` | Modal detalle proyecto |
| `.about-card` / `.about-blue/yellow/dark` / `.about-icon` | Cards glass (index) |
| `.nav-toggle` / `.nav-toggle-bar` | Botón hamburguesa mobile |
| `.nav.is-open` | Nav abierta en mobile |
| `.contact-toggle` | Botón flotante WhatsApp (fondo `#25D366`) |
| `.contact-icon-svg` | SVG WhatsApp dentro del botón (40×40px) |
| `body.modal-open` | Bloquea scroll del fondo |
| `.footer-logo` | Logo footer con `filter: brightness(0) invert(1)` |
| **Wizard de cotización** | |
| `.quote-modal` / `.quote-modal.is-open` | Contenedor modal (display none → block) |
| `.quote-backdrop` | Fondo oscuro difuminado (position fixed) |
| `.quote-card.qw-card` | Card del wizard (max-width 560px, overflow-y auto, max-height calc(100vh - 80px)) |
| `.quote-close` | Botón × (position absolute top-right) |
| `.qw-header` | Cabecera sticky con título + indicador de pasos |
| `.qw-steps` / `.qw-step` / `.qw-dot` / `.qw-lbl` | Indicador de pasos |
| `.qw-step.is-active` / `.qw-step.is-done` | Estado activo (azul) / completado (verde ✓) |
| `.qw-line` / `.qw-line.is-done` | Línea conectora entre pasos (gris → verde) |
| `.qw-panel` / `.qw-panel.is-active` | Panel de cada paso (display none → block) |
| `.qw-desc` / `.qw-label` / `.qw-err` | Descripción, etiqueta y error de campo |
| `.sys-cards` / `.sys-card` / `.sys-card.is-selected` | Tarjetas Blitz/Allround (borde azul cuando seleccionado) |
| `.sys-icon` / `.sys-name` / `.sys-sub` | Elementos internos de tarjeta de sistema |
| `.work-grid` / `.work-btn` / `.work-btn.is-selected` | Grid 2×2 de tipo de trabajo |
| `.qw-row2` | Grid 2 columnas para campos lado a lado |
| `.qw-field` | Wrapper de campo (flex-column, gap 4px) |
| `.counter` / `.counter-btn` / `.counter-val` | Contador +/− para fachadas |
| `.qw-alert` | Alerta amarilla de altura >10m |
| `.qw-calc` / `.qw-calc-title` / `.qw-calc-row` / `.qw-calc-total` | Caja de cálculo en tiempo real (fondo verde claro) |
| `.qw-calc-divider` / `.qw-calc-nota` | Separador y nota del cálculo |
| `.qw-nav` | Fila de navegación (Anterior / Siguiente) |
| `.qw-success` / `.qw-ok-icon` / `.qw-ok-msg` | Panel de éxito (paso 4) |
| `.qw-field .phone-wrap select` / `.qw-field .phone-wrap input` | Override para que el phone-wrap funcione en el wizard (width auto / flex 1) |

### Footer (todas las páginas)
- **Col 1**: Logo + descripción + Contacto (email, WhatsApp) + Ubicación (Puente Alto, RM)
- **Col 2**: Navegación
- **Col 3**: Servicios + link cotización rápida
- **Síguenos**: íconos SVG Instagram, X, Facebook (hrefs en `#`, pendientes)
- **Copyright**: año dinámico via `id="year"`

---

## Decisiones técnicas importantes

- Navbar renombrado "Nosotros" → "Conócenos" para evitar conflicto con `#nosotros` del index.
- `color-scheme: light` en inputs del wizard para forzar modo claro en controles nativos.
- `.quote-backdrop` usa `position: fixed` para no desplazarse al hacer scroll dentro del modal.
- Supabase fallback: reintenta insert con payload mínimo si falla por columnas nuevas.
- Logo SVG: el `<rect fill="white"/>` fue eliminado para fondo transparente. Footer aplica `filter: brightness(0) invert(1)`.
- Botones que abren cotización usan `.js-abrir-cotizacion`; el botón del hero usa adicionalmente `id="btn-cotizacion"`.
- Tabs servicios: `.is-active` en panel visible. Mobile (<580px): `<nav>` oculta, `<select>` visible.
- Filtro proyectos: JS puro con `display: none/''` sobre `.proj-card[data-tipo]`.
- Modal proyecto (`proj-modal`, z-index 80) independiente del modal cotización (`quote-modal`, z-index 60).
- Navbar mobile: el dropdown usa `position: absolute` dentro del `position: sticky` del topbar. Cierra con clic en enlace o fuera del navbar.
- Botón flotante WhatsApp: `<a>` con href directo a WhatsApp. El JS no tiene listener para `.contact-toggle`. El panel `.contact-panel` en `index.html` quedó residual (HTML existe pero no es accesible).
- `nosotros.html` secciones expandidas: el layout alternado usa `direction: rtl` en `.nos-exp-item--alt .nos-exp-grid` y `direction: ltr` en sus hijos. En mobile (≤860px) se revierte a `direction: ltr`.
- **Wizard de cotización:** no usa `<form>` nativo. Hay un `<form hidden id="qw-netlify-form" data-netlify="true">` solo para que Netlify detecte el form en build estático. Los datos se envían manualmente vía `fetch` con `FormData`.
- **Phone-wrap en el wizard:** la regla `.qw-field input/select { width: 100% }` pisaba al select de prefijo y al input dentro del `.phone-wrap`. Se overridea con `.qw-field .phone-wrap select { width: auto }` y `.qw-field .phone-wrap input { width: 0; flex: 1 }` para restaurar el layout flex correcto.
- **Paso 4 del wizard:** no muestra resumen de la cotización — solo el mensaje de confirmación y botón "Cerrar". El desglose interno (costos, utilidad) solo se envía por email al admin, nunca se muestra en pantalla.
- **Auto-open `?cotizar=1`:** la detección está dentro del IIFE `initQuoteWizard` y no necesita `DOMContentLoaded` wrapper porque el script está al final del `<body>`.

---

## Estado del proyecto al 2026-06-03

### Commits en GitHub / Netlify (desplegados)
| Commit | Descripción |
|---|---|
| `52f64a2` | fix: select de prefijo telefónico ocupaba todo el ancho en el wizard |
| `b34ef4c` | fix: input teléfono del wizard no era editable |
| `a6cfe37` | feat: wizard de cotización en 4 pasos con algoritmo de precios MPS |
| `65f2561` | feat: botón WA verde, Conócenos reestructurado, navbar mobile, éxito inline |
| `3429eeb` | feat: correcciones hero, formulario, navbar mobile y UX |

**Branch activo:** `main`
**Último deploy en Netlify:** commit `52f64a2` — todo está sincronizado, sin cambios locales pendientes.

### Sin cambios locales pendientes
Todos los archivos están commiteados y desplegados en `https://mps-andamios.netlify.app`.

### Pendiente / Por hacer
- Reemplazar `href="#"` en íconos de redes sociales con URLs reales (Instagram, X, Facebook)
- Subir PDF de documentación HSE → actualizar botón en `nosotros.html` (quitar `detail-link--soon`)
- Agregar fotos reales al equipo en `nosotros.html` (actualmente usa SVG placeholder)
- Agregar fotos reales de proyectos en `proyectos.html` (actualmente usa imágenes del hero)
- Limpiar el HTML residual del panel `.contact-panel` en `index.html` (no es urgente, no afecta UI)
- Verificar/crear columnas nuevas en tabla `cotizaciones` de Supabase para los campos del wizard (`tipo_trabajo`, `ancho`, `alto`, `fachadas`, `altura_allround`, `nombre_contacto`, `cargo`, `observaciones`, `precio_montaje`, `precio_desmontaje`)
