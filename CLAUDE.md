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

### Modal de cotización
- Presente en: `index.html`, `servicios.html`, `proyectos.html`
- Se abre con `id="btn-cotizacion"`, clase `.js-abrir-cotizacion`, o URL `?cotizar=1`
- `cerrarCotizacion()` resetea el formulario, limpia estados de validación y oculta el mensaje de éxito
- **Mensaje de éxito inline**: al enviar correctamente, se oculta el form y aparece un div `.quote-success` con *"¡Cotización enviada! Te contactaremos a la brevedad."* y botón "Cerrar". El elemento se crea dinámicamente en JS y se appenda a `.quote-card`
- Flujo: Supabase → Netlify Forms → `send-mail` (admin + cliente)

### Formulario de cotización — campos y validaciones
| Campo | Comportamiento |
|---|---|
| Tipo de andamio | Select Blitz/Allround. **Validación inline obligatoria antes de enviar** (error rojo si vacío). Muestra/oculta m² o kg |
| M² / KG | Rango: 20–5.000 m² / 500–50.000 kg. Validación inline + activa caja de precio |
| Ciudad | Autocomplete custom con ~60 ciudades/comunas chilenas |
| Dirección | Autocomplete Nominatim (OpenStreetMap, `countrycodes=cl`). Al seleccionar rellena Ciudad |
| Empresa | Validación en blur, mín. 2 caracteres |
| Teléfono | `phone-wrap`: selector prefijo + input. **Solo 4 países**: Chile +56 (defecto), Argentina +54, Perú +51, Bolivia +591 |
| Correo | Validación regex en tiempo real |

### Algoritmo de cotización (`PRICING` en `main.js`)
**Blitz (m²):** $4.200 → $3.600 → $3.000 → $2.500
**Allround (kg):** $380 → $320 → $260 → $200

- `calcularPrecio(tipo, cantidad)` → `{ cantidad, unidad, precioUnitario, neto, iva, total }`
- `formatCLP(n)` → `$1.500.000` con `toLocaleString("es-CL")`
- Caja verde `.precio-box` aparece en tiempo real al ingresar m²/kg

### Supabase — tabla `cotizaciones`
Columnas: `id`, `created_at`, `tipo_andamio`, `m2_blitz`, `kg_allround`, `ciudad`, `direccion`, `empresa`, `telefono`, `correo`, `precio_unitario`, `precio_neto`, `precio_iva`, `precio_total`

Fallback defensivo: si columnas de precio no existen, reintenta sin ellas.

### Email automático (`netlify/functions/send-mail.js`)
- `emailClienteHTML()`: confirmación al cliente con desglose de precio
- `emailAdminHTML()`: notificación interna con todos los datos
- `precioBlock(precio)`: tabla de desglose CLP (reutilizada en ambos)

### JS — funciones y módulos en `main.js`
| Función / Módulo | Descripción |
|---|---|
| `abrirCotizacion()` / `cerrarCotizacion()` | Abrir/cerrar modal + reset completo del form al cerrar |
| `.js-abrir-cotizacion` | Clase para cualquier botón que abra el modal |
| `initHeroSlider()` | Carrusel del hero con autoplay, dots, swipe |
| `initFormHelpers()` | Autocomplete ciudad/dirección + validaciones inline |
| `initMobileNav()` | Hamburger toggle, cierre al hacer clic en enlace o fuera |
| `PRICING` / `calcularPrecio()` | Algoritmo de precios por tramo |
| Tabs (servicios.html) | Switch de paneles por `data-tab`; mobile usa `<select>` |
| Filtro proyectos | Botones `.filtro-btn` filtran `.proj-card` por `data-tipo` |
| Modal proyecto | `.proj-card-btn` abre `.proj-modal` con datos del `data-*` del card |
| Scroll reveal | `IntersectionObserver` sobre `.reveal` |
| Auto-open modal | Detecta `?cotizar=1` → abre modal y limpia URL |

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
| `.quote-modal` / `.quote-card` / `.quote-success` | Modal cotización + estado éxito |
| `.field--valid` / `.field--invalid` / `.field-hint` | Validación inline inputs |
| `.precio-box` | Caja estimación precio |
| `body.modal-open` | Bloquea scroll del fondo |
| `.footer-logo` | Logo footer con `filter: brightness(0) invert(1)` |

### Footer (todas las páginas)
- **Col 1**: Logo + descripción + Contacto (email, WhatsApp) + Ubicación (Puente Alto, RM)
- **Col 2**: Navegación
- **Col 3**: Servicios + link cotización rápida
- **Síguenos**: íconos SVG Instagram, X, Facebook (hrefs en `#`, pendientes)
- **Copyright**: año dinámico via `id="year"`

---

## Decisiones técnicas importantes

- Navbar renombrado "Nosotros" → "Conócenos" para evitar conflicto con `#nosotros` del index.
- Datalist nativo reemplazado por autocomplete custom para ciudad (macOS cambiaba el esquema de color).
- `color-scheme: light` en `.field input` para forzar modo claro en controles nativos.
- `.quote-backdrop` usa `position: fixed` para no desplazarse al hacer scroll dentro del modal.
- Supabase fallback: reintenta insert sin columnas de precio si falla.
- Logo SVG: el `<rect fill="white"/>` fue eliminado para fondo transparente. Footer aplica `filter: brightness(0) invert(1)`.
- Botones que abren cotización usan `.js-abrir-cotizacion`; el botón del hero usa adicionalmente `id="btn-cotizacion"`.
- Tabs servicios: `.is-active` en panel visible. Mobile (<580px): `<nav>` oculta, `<select>` visible.
- Filtro proyectos: JS puro con `display: none/''` sobre `.proj-card[data-tipo]`.
- Modal proyecto (`proj-modal`, z-index 80) independiente del modal cotización (`quote-modal`, z-index 60).
- Navbar mobile: el dropdown usa `position: absolute` dentro del `position: sticky` del topbar. Cierra con clic en enlace o fuera del navbar.
- Botón flotante WhatsApp: cambiado de `<button>` a `<a>` con href directo. El JS ya no tiene listener para `.contact-toggle`. El panel `.contact-panel` en `index.html` quedó residual (HTML existe pero no es accesible).
- `nosotros.html` secciones expandidas: el layout alternado usa `direction: rtl` en `.nos-exp-item--alt .nos-exp-grid` y `direction: ltr` en sus hijos. En mobile (≤860px) se revierte a `direction: ltr`.
- Mensaje de éxito del formulario: creado dinámicamente en JS con `document.createElement`, appended a `.quote-card`. Al cerrar se restaura el estado inicial (form visible, success hidden, campos limpios).

---

## Estado del proyecto al 2026-06-02

### Commits en GitHub / Netlify (desplegados)
| Tag | Commit | Descripción |
|---|---|---|
| `v1.4-ux-mejoras-20260602` | `3429eeb` | Hero textos, formulario, navbar mobile hamburguesa, slider mobile |
| `v1.3-paginas-completas-20260601` | `1d01bb5` | Secciones completas en todas las páginas + lógica JS |
| `v1.2-logo-definitivo-20260601` | `13d8f73` | Logo definitivo con fondo transparente |

**Branch activo:** `main`
**Último deploy en Netlify:** commit `3429eeb` (v1.4)

### Cambios locales pendientes de commit y push
Los siguientes archivos están modificados pero **NO han sido pusheados ni desplegados**:

- **`index.html`**: título sección Explorar → "Conoce nuestro trabajo"; botón flotante reemplazado por `<a>` WhatsApp verde
- **`nosotros.html`**: reestructuración completa del `<main>` — nueva sección "Quiénes somos" + 6 secciones expandidas con layout alternado + botón WA añadido
- **`servicios.html`**: widget viejo reemplazado por botón WA; número corregido (era `56912345678`, ahora `56954138616`)
- **`proyectos.html`**: widget viejo reemplazado por botón WA
- **`css/style.css`**: estilos navbar mobile, botón WA, secciones `.qs-*` y `.nos-exp-*`, mensaje éxito formulario
- **`js/main.js`**: `initMobileNav()`, eliminado listener widget, mensaje éxito inline, validación tipo andamio

### Pendiente / Por hacer
- **Subir a Netlify** los cambios locales pendientes (commit + push a `main`)
- Reemplazar `href="#"` en íconos de redes sociales con URLs reales (Instagram, X, Facebook)
- Subir PDF de documentación HSE → actualizar botón en `nosotros.html` (quitar `detail-link--soon`)
- Agregar fotos reales al equipo en `nosotros.html` (actualmente usa SVG placeholder)
- Agregar fotos reales de proyectos en `proyectos.html` (actualmente usa imágenes del hero)
- Limpiar el HTML residual del panel `.contact-panel` en `index.html` (no es urgente, no afecta UI)
