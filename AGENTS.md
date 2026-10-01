# AGENTS.md - Reglas y Directrices del Proyecto: Invitación de Boda

## Propósito del Proyecto
Página web interactiva y responsiva de invitación de boda de alta gama visual.
Permite renderizar de manera dinámica el nombre y apellido del invitado (y sus datos asociados como número de pases, mesa y mensaje personalizado) a partir de un número de pase o código en la URL (`?id=X` o `?p=X`) o mediante un buscador/selector interactivo.

## Stack Tecnológico
- **Core**: HTML5 Semántico + Vanilla JavaScript (ES6+ modular y limpio).
- **Estilos**: Vanilla CSS3 moderno con variables CSS personalizadas (Design Tokens), Glassmorphism, animaciones sutiles y diseño responsivo sin dependencias pesadas.
- **Tipografía**: Google Fonts (`Cormorant Garamond`, `Pinyon Script`, `Montserrat`).
- **Assets**: Fotografía de alta fidelidad en `assets/images/hero.jpg`.
- **Efectos**: Web Audio API para música ambiental romántica y animaciones de scroll/confeti livianas en Canvas/CSS puro.

## Reglas de Arquitectura y Código
1. **Sin dependencias externas pesadas**: Mantener la carga instantánea sin frameworks reactivos pesados (React/Vue/etc.) para garantizar máxima compatibilidad en móviles cuando los invitados abran el enlace en WhatsApp.
2. **Centralización de Datos**: La lista de invitados reside en `js/guests.js` con una estructura documentada para facilitar añadir, editar o importar nuevos invitados con sus números asignados.
3. **Persistencia Local y WhatsApp**: El estado de confirmación RSVP se almacena opcionalmente en `localStorage` y genera enlaces preformateados directos a WhatsApp para los novios.
4. **Accesibilidad y Mobile-First**: Cumplir con WCAG AA, objetivos táctiles mínimos de 44x44px y diseño responsivo fluido desde pantallas pequeñas (`xs: <375px`) hasta pantallas grandes (`xl: >=1440px`).
