# CLAUDE.md — MPS Montajes Profesionales & Soluciones

## Idioma

Responde siempre en **español**.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3 personalizado, JavaScript vanilla (ES2020+) |
| Tipografía | Google Fonts — Inter (400, 600, 800) + Tabler Icons (webfont, CDN, solo en `index.html`) |
| Base de datos | Supabase (PostgreSQL) vía SDK JS (`@supabase/supabase-js@2`, CDN) — solo para contactos |
| Hosting / Deploy | Vercel (sitio estático + Serverless Functions en `api/`) |
| Funciones serverless | Vercel Functions (Node.js CommonJS, carpeta `api/`) |
| Envío de correo | Resend SDK (`resend ^6.12.4`) vía `api/cotizacion.js` |
| Control de versiones | Git — repositorio en GitHub (`BlueShiit/mps-andamios`) |

### Variables de entorno
| Variable | Dónde | Descripción |
|---|---|---|
| `RESEND_API_KEY` | Vercel (Production + Preview) + `.env` local | API key de Resend para envío de emails |

### Credenciales e IDs conocidos
- Email de contacto: `arturoperezm2015@gmail.com`
- Email notificaciones (destino emails de cotización): `ian.perez.illanes1@gmail.com`
- WhatsApp: `+56 9 5413 8616` → URL: `https://wa.me/56954138616?text=Hola%20MPS,%20me%20gustaría%20cotizar.`
- Supabase URL: `https://orwnsptmtraujxmeqwph.supabase.co`
- Supabase Project Ref: `orwnsptmtraujxmeqwph`
- Vercel Project ID: `prj_JEbYnq51xbsLpfHt07VDwFM7rqS9`
- Vercel Team: `ian-perez-s-projects`
- Vercel URL producción: `https://mps-andamios.vercel.app`
- Vercel URL rama main: `https://mps-andamios-git-main-ian-perez-s-projects.vercel.app`
- Ubicación: Puente Alto, Región Metropolitana, Chile

### Acceso a infraestructura desde Claude Code
- **Vercel CLI**: instalado (`v54.9.0`). Proyecto vinculado con `vercel link`. Comandos: `vercel logs`, `vercel env ls`, `vercel ls`.
- **Supabase Management API**: requiere Personal Access Token (PAT) de `supabase.com/dashboard/account/tokens`.
- **psql / Supabase CLI**: no instalados en el equipo. Homebrew tampoco instalado.

---

## Paleta de colores (verde musgo)

| Token | Valor | Uso |
|---|---|---|
| `--primario` | `#3D4A2E` | Color principal (botones, íconos, accents) |
| `--acento` | `#FFB703` | Amarillo dorado (CTAs, botón WA text) |
| `--oscuro` | `#1E2B12` | Fondos oscuros (footer, hero pages internas, texto principal) |
| `--gris` | `#F1F5F9` | Fondo gris claro |
| `--borde` | `#E5E7EB` | Bordes neutros |

**No tocar:** `#FFB703`/`#F4C430` (amarillo), `#ffffff` (blanco), grises neutros (`#e5e7eb`, `#f1f5f9`, etc.), `#0a66c2` (LinkedIn brand), `#25D366` (WhatsApp brand).

---

## Estructura de carpetas

```
MPS/
├── api/
│   └── cotizacion.js         # Vercel Function: recibe POST del wizard, envía 2 emails con Resend
├── assets/
│   └── img/                  # hero1.jpg, hero2.jpg, hero3.jpg, montaje.jpg,
│                             # servicios.jpg, supervision.jpg,
│                             # logo-mps-definitivo.svg  ← logo activo (navbar + footer)
│                             # logo-mps.svg             ← usado como <img> en emails de cotización
│                             # logo-mps-navbar.svg      ← versión original (sin uso en producción)
├── css/
│   └── style.css             # Todos los estilos del sitio (único archivo CSS)
├── js/
│   └── main.js               # Toda la lógica frontend
├── index.html                # Página principal
├── nosotros.html             # Página "Conócenos"
├── servicios.html            # Tres servicios con tabs
├── proyectos.html            # Grilla de proyectos con filtros y modal de detalle
├── vercel.json               # Config Vercel: rewrites HTML, cleanUrls, trailingSlash
├── package.json              # Dependencias: resend ^6.12.4
├── .env                      # Local: RESEND_API_KEY (en .gitignore)
└── CLAUDE.md                 # Este archivo
```

---

## Páginas y navbar

Todas las páginas comparten el mismo navbar. **Orden de enlaces:**
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
- **Scroll logic:** `initNavbarScroll()` en `main.js` — añade/quita `.scrolled` cuando `scrollY > 10px`

### Links del navbar
- Color base: `#F4C430` (amarillo), font-weight 500
- Hover: `#FFFFFF` + `text-decoration: underline`, transición 0.2s
- Activo (`.active`): `#FFFFFF` + subrayado permanente

### Navbar mobile
- Hamburguesa `.nav-toggle-bar`: color `#F4C430`
- Menú desplegable `.nav.is-open`: `rgba(61, 74, 46, 0.92)` + `blur(16px)`, borde amarillo sutil
- Lógica en `initMobileNav()` en `main.js`

---

## Funcionalidades implementadas

### Hero / Slider (`index.html`)

**Slides actuales:**
| # | Imagen | Título | Botón |
|---|---|---|---|
| 1 (activo) | `hero3.jpg` | Explora lo que hacemos en obra | Ver servicios → `servicios.html` |
| 2 | `hero2.jpg` | Un equipo. Una forma de trabajar. | Conoce a MPS → `nosotros.html` |
| 3 | `hero1.jpg` | Especialistas en montaje y desmontaje de andamios | Cotiza tu proyecto (`#btn-cotizacion`) |

**Indicadores:** barritas horizontales — inactiva 50×5px `rgba(244,196,48,0.45)` / activa 80×5px `#F4C430`. Clase `.dots`, posición `bottom: 20px`.

**Autoplay:** `setInterval(next, 5000)` simple, sin flags ni pause on hover.

### Modal de cotización — Wizard 4 pasos
- Presente en: `index.html`, `servicios.html`, `proyectos.html`
- Se abre con `id="btn-cotizacion"`, clase `.js-abrir-cotizacion`, o URL `?cotizar=1`
- **Flujo actual:** validación → `POST /api/cotizacion` con Resend (sin Supabase, sin Netlify Forms)

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

### Función serverless de emails (`api/cotizacion.js`)

Recibe `POST` con todos los campos del wizard y envía **dos emails con Resend**:

| Email | Destinatario | Contenido |
|---|---|---|
| Admin | `ian.perez.illanes1@gmail.com` | Datos obra, precios, desglose interno MPS, contacto |
| Cliente | `correo` del formulario | Confirmación, resumen, estimado de precios, botón WhatsApp |

**Detalles de implementación:**
- `from`: `MPS Cotizaciones <onboarding@resend.dev>` (dominio de prueba Resend — cambiar al verificar `mps-andamios.cl`)
- Cada `resend.emails.send()` tiene su propio `try/catch` independiente — si uno falla el otro igual se envía
- Logo en headers: `<img>` con URL hosteada `https://mps-andamios-git-main-ian-perez-s-projects.vercel.app/assets/img/logo-mps.svg`
- Logs de debug: `console.log('Email MPS enviado OK')` / `console.log('Email cliente enviado OK a:', correo)`
- La función siempre devuelve `200 { ok: true }` aunque un email falle
- El catch exterior solo captura errores de `req.body` o setup

**Campos enviados desde `main.js` al endpoint:**
`sistema`, `tipo`, `ancho`, `alto`, `fachadas`, `kg`, `alturaMaxima`, `metodoIzaje`, `m2`, `dias`, `precioMontaje`, `precioDesm`, `total`, `costoTrabajadores`, `utilidad`, `recargo`, `empresa`, `nombre`, `cargo`, `telefono`, `correo`, `ciudad`, `observaciones`

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

## vercel.json

```json
{
  "buildCommand": "echo 'Static site'",
  "outputDirectory": ".",
  "rewrites": [
    { "source": "/nosotros", "destination": "/nosotros.html" },
    { "source": "/servicios", "destination": "/servicios.html" },
    { "source": "/proyectos", "destination": "/proyectos.html" }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

`buildCommand` y `outputDirectory` son necesarios para que Vercel detecte `api/` como Functions en un proyecto estático.

---

## Decisiones técnicas importantes

- **Hosting:** migrado de Netlify → Vercel. Carpeta `netlify/` eliminada. `nodemailer` eliminado.
- **Emails:** migrado de Nodemailer/SMTP → Resend SDK. Un solo archivo `api/cotizacion.js`.
- **Formulario de cotización:** ya no persiste en Supabase ni en Netlify Forms — solo envía emails vía Resend.
- **Supabase** sigue activo solo para `sendContactToSupabase` (widget de contacto en `index.html`).
- **Navbar glass:** `topbar--glass-strong` en los 4 HTMLs. Sin `::before` gradient.
- `color-scheme: light` en inputs del wizard para forzar modo claro en controles nativos.
- `.quote-backdrop` usa `position: fixed` para no desplazarse al hacer scroll dentro del modal.
- Logo SVG: footer aplica `filter: brightness(0) invert(1)`. En emails se usa `<img>` con URL absoluta (SVG inline no renderiza en Gmail).
- Botones que abren cotización usan `.js-abrir-cotizacion`; el botón del hero usa adicionalmente `id="btn-cotizacion"`.
- **Hero autoplay:** `setInterval(next, 5000)` sin flags ni pause-on-hover (fueron eliminados por bugs).
- **Barritas slider:** `.dots` posicionado `bottom: 20px`. Botones 50×5px inactivo / 80×5px activo.

---

## Estado del proyecto al 2026-06-11

### Últimos commits
| Commit | Descripción |
|---|---|
| `44ed6e2` | fix: try/catch separados para debug emails |
| `d1ddb19` | fix: logo como img hosteada y correo cliente |
| `32b8105` | feat: logo SVG en header de emails |
| `f650e1f` | feat: agregar email de confirmación al cliente |
| `9719a66` | fix: configurar vercel para sitio estático con funciones api |

**Branch activo:** `main`
**Repositorio:** `https://github.com/BlueShiit/mps-andamios`
**Último deploy en Vercel:** commit `44ed6e2` — producción activa.

### Pendiente / Por hacer
- Verificar en Vercel Logs que ambos emails llegan correctamente al enviar el formulario
- Verificar dominio `mps-andamios.cl` en Resend → cambiar `from` de `onboarding@resend.dev` a `noreply@mps-andamios.cl`
- Reemplazar `href="#"` en íconos de redes sociales con URLs reales (Instagram, X, Facebook)
- Subir PDF de documentación HSE → actualizar botón en `nosotros.html` (quitar `detail-link--soon`)
- Agregar fotos reales al equipo en `nosotros.html` (actualmente usa SVG placeholder)
- Agregar fotos reales de proyectos en `proyectos.html` (actualmente usa imágenes del hero)
- Limpiar HTML residual del panel `.contact-panel` en `index.html`
- Evaluar reconectar cotizaciones a Supabase si se necesita historial persistente
