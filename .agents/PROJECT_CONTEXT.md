# PROJECT_CONTEXT.md

## Project Metadata
- **Project Name**: Invitación Digital de Boda Interactiva
- **Repository Path**: `/Users/jeec/.gemini/antigravity-ide/scratch/boda-invitacion`
- **Main Goal**: Renderizar dinámicamente el nombre y apellido del invitado (y sus pases) a partir de un parámetro numérico en la URL o modal de búsqueda, presentado en una interfaz visualmente deslumbrante de alta gama.

## Architecture
- `index.html`: Estructura semántica completa (Hero, Saludo Personalizado Dinámico, Cronograma, Ubicaciones, Código de Vestimenta, Mesa de Regalos, RSVP con integración a WhatsApp, Modal de Búsqueda).
- `css/styles.css`: Sistema de diseño con tokens CSS (colores oro/marfil/champagne, tipografías Cormorant/Pinyon/Montserrat, componentes atómicos, estados visuales y adaptabilidad móvil).
- `js/guests.js`: Base de datos de invitados indexada por número (ID).
- `js/app.js`: Controlador principal (parseo de URL `?id=`, renderizado dinámico del invitado, contador regresivo, RSVP a WhatsApp, buscador).
- `js/music.js`: Motor de audio ambiental romántico con Web Audio API y control de reproducción.
- `assets/images/hero.jpg`: Imagen principal editorial de alta calidad.

## UI & Design System Map
- **Target Platform**: Web (Mobile-first, optimizado para ser abierto desde enlaces de WhatsApp en smartphones)
- **UI Component Path**: `index.html` + `css/styles.css`
- **Active UI Library**: Vanilla CSS3 Custom Design System (BEM-inspired tokens)
- **Design Tokens / Theme File**: `css/styles.css` (`:root` variables)
- **Existing Reusable Components**:
  - Buttons: `.btn`, `.btn-primary` (dorado brillante), `.btn-outline` (borde dorado), `.btn-whatsapp` (verde esmeralda / whatsapp)
  - Inputs / Forms: `.input-code`, `.rsvp-form-group`
  - Cards / Containers: `.card-luxury`, `.glass-panel`, `.guest-badge`
  - Modals / Dialogs: `.modal-backdrop`, `.modal-luxury`
  - Floating Controls: `.music-toggle`, `.guest-selector-floating`
  - Badges / Labels: `.passes-counter`, `.table-pill`
