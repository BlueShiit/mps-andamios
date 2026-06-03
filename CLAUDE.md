# CLAUDE.md — MPS Montajes Profesionales & Soluciones

## Idioma

Responde siempre en **español**.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3 personalizado, JavaScript vanilla (ES2020+) |
| Tipografía | Google Fonts — Inter (400, 600, 800) + Tabler Icons (webfont, CDN, solo en `index.html`) |
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

## Paleta de colores (actualizada — verde musgo)

La paleta anterior era Tailwind Slate (azul marino). Ahora es completamente verde musgo.

| Token | Valor | Uso |
|---|---|---|
| `--primario` | `#3D4A2E` | Color principal (botones, íconos, accents) |
| `--acento` | `#FFB703` | Amarillo dorado (CTAs, botón WA text) |
| `--oscuro` | `#1E2B12` | Fondos oscuros (footer, hero pages internas, texto principal) |
| `--gris` | `#F1F5F9` | Fondo gris claro |
| `--borde` | `#E5E7EB` | Bordes neutros |

### Mapa de equivalencias (azul → verde)
| Anterior | Nuevo | Rol |
|---|---|---|
| `#0f172a` | `#1E2B12` | Fondos oscuros / texto principal |
| `#0b1220` | `#0F1A08` | Fondo más oscuro |
| `#334155` / `#374151` / `#1f2937` | `#2C3820` | Texto medio-oscuro |
| `#475569` | `#3D4A2E` | Texto secundario |
| `#64748b` | `#4A5C2E` | Texto sutil |
| `#94a3b8` | `#7A8F6B` | Texto sutil sobre fondos oscuros |
| `#dbe4f0` | `#D6E0C8` | Fondo claro azulado |
| `#eff6ff` | `#EBF0E0` | Fondo muy claro (selected state) |
| `#f1f5ff` | `#F0F4E8` | Fondo más claro |
| `#084c94` | `#3D4A2E` | Enlace oscuro |
| SVG `#042b5c` | `#1E2B12` | Logo — navy oscuro |
| SVG `#386293` | `#4A5C2E` | Logo — azul medio |

**No tocar:** `#FFB703`/`#F4C430` (amarillo), `#ffffff` (blanco), grises neutros (`#e5e7eb`, `#f1f5f9`, etc.), `#0a66c2` (LinkedIn brand), `#25D366` (WhatsApp brand).

---

## Estructura de carpetas

```
MPS/
├── assets/
│   └── img/              # hero1.jpg, hero2.jpg, hero3.jpg, montaje.jpg,
│                         # servicios.jpg, supervision.jpg,
│                         # logo-mps-definitivo.svg  ← logo activo (navbar + footer)
│                         #   colores actualizados: #1E2B12 + #4A5C2E + #f5b40c
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

Todas las páginas comparten el mismo navbar. **Orden de enlaces (actualizado):**
1. **Inicio** → `index.html`
2. **Servicios** → `servicios.html`
3. **Proyectos** → `proyectos.html`
4. **Conócenos** → `nosotros.html`

Cada página tiene `class="active"` en su enlace correspondiente → color blanco + subrayado permanente.

**Logo activo:** `assets/img/logo-mps-definitivo.svg` — SVG con colores verdes. Se usa en navbar (`height: 65px`) y footer (`height: 36px`, `filter: brightness(0) invert(1)` para fondo oscuro).

### Estilo del navbar (glassmorphism verde)
- Clase en HTML: `class="topbar topbar--glass-strong"` (usada en los 4 HTMLs)
- Fondo base: `rgba(61, 74, 46, 0.85)` + `backdrop-filter: blur(12px)`
- Al hacer scroll (clase `.scrolled` añadida por JS): `rgba(61, 74, 46, 0.95)` + `blur(16px)`
- Borde inferior: `1px solid rgba(244, 196, 48, 0.15)` (amarillo sutil)
- Sin `::before` ni efectos glass adicionales
- **Scroll logic:** `initNavbarScroll()` en `main.js` — añade/quita `.scrolled` cuando `scrollY > 10px`

### Links del navbar
- Color base: `#F4C430` (amarillo), font-weight 500
- Hover: `#FFFFFF` + `text-decoration: underline`, transición 0.2s
- Activo (`.active`): `#FFFFFF` + subrayado permanente

### Navbar mobile
- Hamburguesa `.nav-toggle-bar`: color `#F4C430`
- Menú desplegable `.nav.is-open`: `rgba(61, 74, 46, 0.92)` + `blur(16px)`, borde amarillo sutil
- Links mobile: `#F4C430`, hover → blanco + subrayado
- Lógica en `initMobileNav()` en `main.js`

---

## Funcionalidades implementadas

### Hero / Slider (`index.html`)

**Slides actuales (sin pills — eliminadas):**
| # | Imagen | Título | Botón |
|---|---|---|---|
| 1 (activo) | `hero3.jpg` | Explora lo que hacemos en obra | Ver servicios → `servicios.html` |
| 2 | `hero2.jpg` | Un equipo. Una forma de trabajar. | Conoce a MPS → `nosotros.html` |
| 3 | `hero1.jpg` | Especialistas en montaje y desmontaje de andamios | Cotiza tu proyecto (`#btn-cotizacion`) |

**Indicadores:** barritas horizontales (no puntos circulares)
- Posición: `bottom: 20px`, centradas horizontalmente
- Inactiva: 50×5px, `rgba(244,196,48,0.45)`, border-radius 3px
- Activa: 80×5px, `#F4C430`
- Clase CSS: `.dots` / `.dots button` / `.dots button.active`

**Autoplay:** `setInterval(next, 5000)` — simple, sin flags ni estado. Flechas y barritas navegan manualmente. Sin pausa en hover (eliminada para evitar bugs).

**Estructura JS (`initHeroSlider` IIFE):**
- `goTo(i)` → actualiza `current` + `updateUI()`
- `next()` / `prev()` → llaman `goTo`
- `updateUI()` → toggle `.is-active` en slides y `.active` en dots
- Swipe táctil via `touchstart`/`touchend` (delta > 40px)

### Secciones de index.html (en orden)
1. **Hero slider** (`#inicio`)
2. **Franja de estadísticas** (`.stats-band`) — fondo `#1E2B12`, 4 métricas: +80 proyectos, +6 años, +500 ton, 0 accidentes
3. **Sistemas que utilizamos** (`.sistemas-section`) — cards Blitz y Allround
4. **Nosotros** (`#nosotros`) — 6 `.about-card` glass en grilla 3 columnas
5. **¿Cómo trabajamos?** (`.proceso-section`) — 4 pasos
6. **CTA intermedio** (`.cta-band`) — botón dorado `.cta-gold`, clase `.js-abrir-cotizacion`
7. **¿Dónde operamos?** (`.cobertura-section`) — chips de comunas RM
8. **Conoce nuestro trabajo** (`#explorar`) — 3 mini-cards con Tabler Icons (ver abajo)

### Sección "Conoce nuestro trabajo" (`#explorar`) — nuevo diseño
Reemplazó las 2 cards grandes con imagen. Ahora son **3 mini-cards verticales** en grilla:

| Card | Ícono Tabler | Título | Link |
|---|---|---|---|
| 1 | `ti ti-tools` | Servicios | `servicios.html` |
| 2 | `ti ti-building-factory-2` | Proyectos | `proyectos.html` |
| 3 | `ti ti-users` | Conócenos | `nosotros.html` |

**Clases CSS:**
- Grilla: `.explore-cards-grid` (3 col desktop, 1 col ≤768px)
- Card: `.explore-mini-card` — fondo blanco, borde `0.5px solid #e5e7eb`, border-radius 12px, padding 1.25rem, texto centrado
- Hover: `translateY(-3px)` + `box-shadow: 0 4px 16px rgba(0,0,0,0.08)`
- Caja ícono: `.emc-icon` — 48×48px, fondo `#3D4A2E`, border-radius 8px
- Ícono: `font-size: 22px`, color `#F4C430`
- Título: `.emc-title` — 14px, font-weight 500
- Descripción: `.emc-desc` — 12px, `#6b7280`, line-height 1.5
- Link: `.emc-link` — 12px, color `#3D4A2E`, font-weight 500

**Tabler Icons** importado en `<head>` de `index.html`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
```

### About cards (sección Nosotros en index.html)
- Clase: `.about-card` — glass (backdrop-filter blur 18px)
- Ícono `.about-icon`: fondo `var(--primario)` (#3D4A2E), color blanco, 58×58px
- **Hover:** solo `translateY(-4px)` + sombra — el ícono NO cambia color ni opacidad
- `border-color` en hover: `rgba(61, 74, 46, 0.25)` (verde, no azul)

### Página Conócenos (`nosotros.html`) — estructura actual
1. **Hero pequeño** (`.page-hero`) — fondo `#1E2B12`, título en `#FFB703`, subtítulo
2. **Quiénes somos** (`.qs-section`) — grid 2 col: texto narrativo (izq) + quote verde oscuro con stats (der)
3. **6 secciones expandidas** (`.nos-expanded`) — layout alternado con `direction: rtl` en `.nos-exp-item--alt`. IDs: `#por-que-mps`, `#hse-documentacion`, `#seguridad`, `#mision`, `#experiencia`, `#soluciones-integrales`
4. **Nuestro equipo** (`.equipo-section`) — 3 cards: Arturo Pérez M. (Gerente), Carlos Ramírez V. (Operaciones), Rodrigo Fuentes A. (HSE)
5. **Franja de valores** (`.valores-band`) — Seguridad / Compromiso / Calidad / Puntualidad

### Página Servicios (`servicios.html`)
- **Tabs:** `tab-montaje` / `tab-supervision` / `tab-hse`. Mobile (<580px): `<select class="tabs-select">`
- **¿Por qué contratarnos?** (`.dif-section`) — 4 `.dif-card`

### Página Proyectos (`proyectos.html`)
- **Filtros:** Todos / Montaje / Desmontaje / Supervisión (`.filtro-btn`)
- **Grilla:** 6 proyectos ficticios, modal de detalle (`.proj-modal`)

### Botón flotante WhatsApp (todas las páginas)
- `<a class="contact-toggle">` — fondo `#25D366`, directo a WhatsApp
- `index.html` conserva `.contact-panel` residual (inaccessible, no urgente limpiar)

### Modal de cotización — Wizard 4 pasos
- Presente en: `index.html`, `servicios.html`, `proyectos.html`
- Se abre con `id="btn-cotizacion"`, clase `.js-abrir-cotizacion`, o URL `?cotizar=1`
- Flujo: Supabase insert → Netlify Forms → `send-mail` function

**Estructura:**
| Panel | ID | Contenido |
|---|---|---|
| Paso 1 | `#qw-panel-1` | Sistema (Blitz/Allround) + tipo de trabajo |
| Paso 2 | `#qw-panel-2` | Dimensiones + cálculo en tiempo real |
| Paso 3 | `#qw-panel-3` | Datos de contacto |
| Paso 4 | `#qw-panel-4` | Confirmación de envío |

### Algoritmo de cotización (`calcularObra()`)

**Blitz:** `m² = ancho × alto × fachadas` → `precioM = m² × $1.800`, `precioD = m² × $1.500`
**Allround:** `precioM = kg × $380`, `precioD = kg × $350`
**Ambos:** `costoTrab = diasActivos × $240.000 × recargo` (recargo 1.5 si altura > 10m)

### Email automático (`netlify/functions/send-mail.js`)
- Admin: incluye desglose interno (días, recargo, costo cuadrilla, utilidad)
- Cliente: solo confirmación con estimado de precios

### JS — funciones y módulos en `main.js`
| Función / Módulo | Descripción |
|---|---|
| `initHeroSlider()` | Slider con `setInterval(next, 5000)`, swipe táctil, flechas, barritas |
| `initSlideTextAnimations()` | MutationObserver — resetea `.animate` al cambiar slide activo |
| `initScrollReveal()` | IntersectionObserver sobre `.reveal` |
| `initQuoteWizard()` | IIFE wizard: estado, navegación, cálculo, validación, envío |
| `calcularObra()` | Algoritmo de precios MPS |
| `renderCalc(c)` | Caja `.qw-calc` en tiempo real |
| `goToStep(n)` | Navega pasos del wizard |
| `initMobileNav()` | Hamburguesa toggle, cierre al clic fuera |
| `initNavbarScroll()` | Añade `.scrolled` al `.topbar` cuando `scrollY > 10px` |
| Tabs (servicios.html) | Switch por `data-tab` |
| Filtro proyectos | `.filtro-btn` filtra `.proj-card` |
| Modal proyecto | `.proj-card-btn` → `.proj-modal` |

---

## Decisiones técnicas importantes

- **Paleta:** era Tailwind Slate (azul), ahora verde musgo. Ver mapa de equivalencias arriba.
- **Navbar glass:** `topbar--glass-strong` en los 4 HTMLs. El `::before` gradient fue eliminado. Scroll listener en `initNavbarScroll()`.
- `color-scheme: light` en inputs del wizard para forzar modo claro en controles nativos.
- `.quote-backdrop` usa `position: fixed` para no desplazarse al hacer scroll dentro del modal.
- Supabase fallback: reintenta insert con payload mínimo si falla por columnas nuevas.
- Logo SVG: footer aplica `filter: brightness(0) invert(1)`.
- Botones que abren cotización usan `.js-abrir-cotizacion`; el botón del hero usa adicionalmente `id="btn-cotizacion"`.
- `nosotros.html` secciones expandidas: layout alternado con `direction: rtl` / `ltr`. En mobile (≤860px) se revierte a `ltr`.
- **Wizard:** no usa `<form>` nativo. `<form hidden id="qw-netlify-form" data-netlify="true">` solo para Netlify build detection.
- **Phone-wrap:** `.qw-field .phone-wrap select { width: auto }` / `.qw-field .phone-wrap input { width: 0; flex: 1 }` — override necesario.
- **Hero autoplay:** implementación mínima con `setInterval(next, 5000)` directo. No hay flags `isPaused` ni listeners `mouseenter/mouseleave` — fueron eliminados por causar bugs donde el autoplay se detenía al cargar la página.
- **Barritas slider:** `.dots` posicionado `bottom: 20px` (no top). Botones de 50×5px inactivo / 80×5px activo.

---

## Estado del proyecto al 2026-06-03

### Último commit desplegado
| Commit | Descripción |
|---|---|
| `e150cd1` | feat: rediseño completo — paleta verde, navbar glass, slider actualizado, formulario cotización v2, sección explorar cards |

**Branch activo:** `main`
**Último deploy en Netlify:** commit `e150cd1` — todo sincronizado.

### Cambios de esta sesión (ya commiteados)
- Paleta completa azul → verde musgo (CSS + SVG logo)
- Navbar: glassmorphism verde, links amarillos, hover blanco, `class="active"` en cada página, orden Inicio/Servicios/Proyectos/Conócenos
- Hero slider: pills eliminadas, slides reordenados, títulos actualizados, indicadores de barritas, autoplay simplificado
- Sección Explorar: reemplazada por 3 mini-cards con Tabler Icons
- About cards: hover arreglado (ícono ya no desaparece)

### Pendiente / Por hacer
- Reemplazar `href="#"` en íconos de redes sociales con URLs reales (Instagram, X, Facebook)
- Subir PDF de documentación HSE → actualizar botón en `nosotros.html` (quitar `detail-link--soon`)
- Agregar fotos reales al equipo en `nosotros.html` (actualmente usa SVG placeholder)
- Agregar fotos reales de proyectos en `proyectos.html` (actualmente usa imágenes del hero)
- Limpiar HTML residual del panel `.contact-panel` en `index.html`
- Verificar/crear columnas nuevas en tabla `cotizaciones` de Supabase (`tipo_trabajo`, `ancho`, `alto`, `fachadas`, `altura_allround`, `nombre_contacto`, `cargo`, `observaciones`, `precio_montaje`, `precio_desmontaje`)
