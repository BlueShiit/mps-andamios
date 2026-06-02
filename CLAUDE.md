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
- WhatsApp: `+56 9 5413 8616`
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
├── index.html            # Página principal (ver secciones abajo)
├── nosotros.html         # Página "Conócenos" (ver secciones abajo)
├── servicios.html        # Tres servicios con tabs (ver secciones abajo)
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

**Logo activo:** `assets/img/logo-mps-definitivo.svg` — SVG de Inkscape con fondo transparente (el `<rect>` blanco fue eliminado). Se usa en navbar (`height: 65px`) y footer (`height: 36px`, `filter: brightness(0) invert(1)` para fondo oscuro).

---

## Funcionalidades implementadas

### Hero / Slider (`index.html`)
- 3 slides: pill + título + botón CTA
- Slide 1 → abre modal de cotización (`id="btn-cotizacion"`)
- Slide 2 → `nosotros.html`
- Slide 3 → `servicios.html`
- Autoplay 6s, controles prev/next, dots, swipe táctil, pausa en hover

### Secciones de index.html (en orden)
1. **Hero slider** (`#inicio`)
2. **Franja de estadísticas** (`.stats-band`) — fondo `#0f172a`, 4 métricas: +80 proyectos, +6 años, +500 ton, 0 accidentes
3. **Sistemas que utilizamos** (`.sistemas-section`) — cards Blitz y Allround con tipografía grande
4. **Nosotros** (`#nosotros`) — 6 about-cards en grilla 3 columnas
5. **¿Cómo trabajamos?** (`.proceso-section`) — 4 pasos con ícono SVG + número + descripción
6. **CTA intermedio** (`.cta-band`) — fondo oscuro, botón dorado `.cta-gold`, clase `.js-abrir-cotizacion`
7. **¿Dónde operamos?** (`.cobertura-section`) — chips de comunas RM
8. **Explorar** (`#explorar`) — cards con imagen a servicios y proyectos

### Página Conócenos (`nosotros.html`)
- **Hero** (`.page-hero`) — fondo `#0f172a`, título en `#FFB703`
- **6 cards** (`.nos-cards-grid`, 3 col → 2 → 1) usando clases `.about-card .about-blue/yellow/dark` con íconos SVG y `.about-more`
- **Nuestro equipo** (`.equipo-section`) — 3 personas ficticias con avatar SVG placeholder, cargo y descripción
- **Franja de valores** (`.valores-band`) — 4 valores: Seguridad / Compromiso / Calidad / Puntualidad

### Página Servicios (`servicios.html`)
- **Hero** (`.page-hero`) — fondo oscuro, título "Nuestros Servicios"
- **Tabs de 3 servicios** — nav `.tabs-nav` + paneles `.tab-panel`. En mobile (<580px) se reemplaza por `<select class="tabs-select">`. JS en `main.js` maneja el switching.
  - `tab-montaje`: Montaje y desmontaje (imagen: `montaje.jpg`)
  - `tab-supervision`: Supervisión de obras (imagen: `supervision.jpg`)
  - `tab-hse`: Gestión HSE (imagen: `servicios.jpg`)
- **Panel layout**: `.svc-panel` — grid horizontal imagen+contenido (colapsa a columna en mobile)
- **¿Por qué contratarnos?** (`.dif-section`) — 4 diferenciadores en `.dif-card` (ícono azul + título + texto)
- **CTA final** (`.cta-band`) — mismo patrón que el de index.html

### Página Proyectos (`proyectos.html`)
- **Hero** (`.page-hero`)
- **Filtros** (`.proyectos-filtros`) — 4 botones `.filtro-btn`: Todos / Montaje / Desmontaje / Supervisión. JS puro filtra por `data-tipo` en cada `.proj-card`
- **Grilla** (`.proyectos-grid`, 3 col → 2 → 1) — 6 proyectos ficticios con imagen, badge de tipo y botón "Ver detalle"
  - 2 Montaje: Fachada Residencial Torre Norte (Puente Alto), Estructura Comercial Las Américas (La Florida)
  - 2 Desmontaje: Torre Corporativa Centro (Las Condes), Planta de Procesamiento Quilicura
  - 2 Supervisión: Proyecto Habitacional Maipú, Centro Logístico San Bernardo
- **Modal de detalle** (`.proj-modal`, `id="proj-modal"`) — se puebla con `data-*` del card: `data-title`, `data-img`, `data-badge`, `data-tipo`, `data-location`, `data-desc`. Botón "Cotizar proyecto similar" usa `.js-abrir-cotizacion`

### Modal de cotización
- Se abre con `id="btn-cotizacion"`, clase `.js-abrir-cotizacion` (en cualquier página), o URL `?cotizar=1`
- Función global `abrirCotizacion()` / `cerrarCotizacion()` en `main.js`
- `body.modal-open { overflow: hidden }` bloquea scroll del fondo
- Netlify Forms: `name="cotizacion"`, `data-netlify="true"`, honeypot `bot-field`
- Flujo: Supabase → Netlify Forms → `send-mail` (admin + cliente)
- Presente en: `index.html`, `servicios.html`, `proyectos.html` (con modal de cotización y proyecto separados)

### Formulario de cotización — campos y validaciones (`initFormHelpers()`)
| Campo | Comportamiento |
|---|---|
| Tipo de andamio | Select Blitz/Allround. Muestra/oculta campo m² o kg según selección |
| M² / KG | Rango: 20–5.000 m² / 500–50.000 kg. Validación inline + activa caja de precio |
| Ciudad | Autocomplete custom con ~60 ciudades/comunas chilenas |
| Dirección | Autocomplete Nominatim (OpenStreetMap, `countrycodes=cl`). Al seleccionar rellena Ciudad |
| Empresa | Validación en blur, mín. 2 caracteres |
| Teléfono | `phone-wrap`: selector prefijo + input. Chile +56 por defecto (13 países) |
| Correo | Validación regex en tiempo real |

### Algoritmo de cotización (`PRICING` en `main.js`)
**Blitz (m²):** $4.200 → $3.600 → $3.000 → $2.500  
**Allround (kg):** $380 → $320 → $260 → $200

- `calcularPrecio(tipo, cantidad)` → `{ cantidad, unidad, precioUnitario, neto, iva, total }`
- `formatCLP(n)` → `$1.500.000` con `toLocaleString("es-CL")`
- Caja verde `.precio-box` aparece en tiempo real al ingresar m²/kg
- Precio incluido en Supabase y en el email

### Supabase — tabla `cotizaciones`
Columnas: `id`, `created_at`, `tipo_andamio`, `m2_blitz`, `kg_allround`, `ciudad`, `direccion`, `empresa`, `telefono`, `correo`, `precio_unitario`, `precio_neto`, `precio_iva`, `precio_total`

Fallback defensivo: si columnas de precio no existen, reintenta sin ellas.

### Email automático (`netlify/functions/send-mail.js`)
- `emailClienteHTML()`: confirmación al cliente con desglose de precio
- `emailAdminHTML()`: notificación interna con todos los datos
- `precioBlock(precio)`: tabla de desglose CLP (reutilizada en ambos)

### JS — funciones y módulos en `main.js`
| Sección | Función |
|---|---|
| `abrirCotizacion()` / `cerrarCotizacion()` | Abrir/cerrar modal de cotización |
| `.js-abrir-cotizacion` | Clase para cualquier botón que abra el modal (sin ID duplicado) |
| `initHeroSlider()` | Carrusel del hero con autoplay, dots, swipe |
| `initFormHelpers()` | Autocomplete ciudad/dirección + validaciones inline |
| `PRICING` / `calcularPrecio()` | Algoritmo de precios por tramo |
| Tabs (servicios.html) | Switch de paneles por `data-tab`; mobile usa `<select>` |
| Filtro proyectos | Botones `.filtro-btn` filtran `.proj-card` por `data-tipo` |
| Modal proyecto | `.proj-card-btn` abre `.proj-modal` con datos del `data-*` del card |
| Widget de contacto flotante | Panel lateral → Supabase tabla `contactos` |
| Scroll reveal | `IntersectionObserver` sobre `.reveal` |
| Auto-open modal | Detecta `?cotizar=1` → abre modal y limpia URL |

### CSS — clases relevantes
| Clase | Uso |
|---|---|
| `.page-hero` / `.page-hero-title` / `.page-hero-sub` | Hero oscuro para páginas internas |
| `.stats-band` / `.stats-grid` / `.stat-item` | Franja de estadísticas (index) |
| `.sistemas-section` / `.sistema-card` / `.sistema-nombre` | Sección Blitz/Allround |
| `.proceso-section` / `.pasos-grid` / `.paso-card` | Sección ¿Cómo trabajamos? |
| `.cta-band` / `.cta-gold` | Franja CTA con botón dorado |
| `.cobertura-section` / `.comunas-grid` / `.comuna-chip` | Sección de cobertura geográfica |
| `.nos-cards-grid` | Grid 3→2→1 cols para cards de nosotros.html |
| `.equipo-grid` / `.equipo-card` / `.equipo-foto` | Sección del equipo |
| `.valores-band` / `.valores-grid` / `.valor-item` | Franja de valores |
| `.tabs-wrap` / `.tabs-nav` / `.tab-btn` / `.tabs-select` | Tabs de servicios (mobile: select) |
| `.tab-panel.is-active` | Panel visible de tabs |
| `.svc-panel` / `.svc-panel-media` / `.svc-panel-body` | Layout horizontal servicio+imagen |
| `.dif-grid` / `.dif-card` / `.dif-icon` | Diferenciadores ¿Por qué contratarnos? |
| `.proyectos-filtros` / `.filtro-btn.is-active` | Filtros de proyectos |
| `.proyectos-grid` / `.proj-card` / `.proj-card-badge` | Grilla de proyectos |
| `.proj-modal` / `.proj-modal-card` / `.proj-modal-badge` | Modal de detalle de proyecto |
| `.about-card` / `.about-blue/yellow/dark` / `.about-icon` | Cards glass (index + nosotros) |
| `.field--valid` / `.field--invalid` | Borde verde/rojo en inputs |
| `.precio-box` | Caja estimación de precio |
| `.quote-modal` | Modal de cotización |
| `body.modal-open` | Bloquea scroll del fondo |
| `.detail-link--soon` | Botón deshabilitado "(próximamente)" |
| `.footer-logo` | Logo en footer con `filter: brightness(0) invert(1)` |

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
- Logo SVG de Inkscape: el `<rect fill="white"/>` fue eliminado para mantener fondo transparente. El footer aplica `filter: brightness(0) invert(1)` para invertirlo a blanco sobre fondo oscuro.
- Botones que abren el modal de cotización usan clase `.js-abrir-cotizacion` (evita IDs duplicados). El botón del hero sigue usando `id="btn-cotizacion"`.
- Tabs de servicios: el panel visible usa `.is-active`. En mobile (<580px) el `<nav>` se oculta y aparece un `<select>`.
- Filtro de proyectos: JS puro con `display: none/''` sobre `.proj-card[data-tipo]`.
- Modal de proyecto (`proj-modal`) independiente del modal de cotización (`quote-modal`); ambos pueden coexistir con `z-index` diferente (proj-modal: 80, quote-modal: 60).

---

## Estado del proyecto

**Último commit en GitHub/Netlify:** `13d8f73` — *feat: actualiza logo a versión definitiva con fondo transparente*  
**Tag de respaldo en GitHub:** `v1.2-logo-definitivo-20260601`  
**Branch:** `main`

### Cambios locales pendientes de subir a Netlify
Los siguientes cambios están en `main` local pero **NO han sido pusheados ni desplegados**:
- `index.html`: 5 secciones nuevas (estadísticas, sistemas, proceso, CTA, cobertura)
- `nosotros.html`: hero + cards + equipo + valores (reescritura completa del `<main>`)
- `servicios.html`: hero + tabs 3 servicios + diferenciadores + CTA (reescritura completa del `<main>`)
- `proyectos.html`: hero + grilla 6 proyectos + filtros + modal de detalle (reescritura completa del `<main>`)
- `css/style.css`: ~350 líneas de estilos nuevos para todas las secciones anteriores
- `js/main.js`: lógica de tabs, filtros y modal de proyecto

### Pendiente / Por hacer
- **Subir a Netlify** los cambios locales (commit + push a `main`)
- Reemplazar `href="#"` en íconos de redes sociales con URLs reales (Instagram, X, Facebook)
- Subir PDF de documentación HSE → actualizar botón en `nosotros.html` (quitar `detail-link--soon`)
- Corregir número de WhatsApp en widget de contacto de `servicios.html` (tiene placeholder `56912345678`, debe ser `56954138616`)
- Agregar fotos reales al equipo en `nosotros.html` (actualmente usa SVG placeholder)
- Agregar fotos reales de proyectos en `proyectos.html` (actualmente usa imágenes del hero)
