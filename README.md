# 💍 Invitación Digital de Boda - Sistema Interactivo con Personalización por Número

Una página web elegante, responsiva y de alta gama visual para invitaciones de boda personalizadas con HTML5, Vanilla CSS3 y JavaScript moderno (sin dependencias pesadas).

---

## ✨ Características Principales

1. **Personalización Dinámica por Número / Código**:
   - Cada invitado tiene un número o código asignado (ej. `1`, `2`, `3`...).
   - Al abrir el enlace con parámetro en la URL:
     - `index.html?id=1` -> Carga la invitación de **Carlos Mendoza & Mariana Morales** (2 pases reservados).
     - `index.html?id=2` -> Carga la invitación de **Dr. Fernando Ruiz** (1 pase personal).
     - `index.html?id=3` -> Carga la invitación de **Roberto Gómez y Familia** (4 pases).
     - `index.html?id=4`, `?id=5`, `?id=6`...
   - También soporta los parámetros `?p=`, `?n=`, `?codigo=`, `?invitacion=`.
2. **Buscador & Selector Rápido**:
   - Botón en la barra superior: *Buscar Invitación* para que el usuario o invitado escriba su número.
   - Selector flotante inferior para que los novios prueben todos los números de su lista en tiempo real con un solo clic.
3. **Confirmación Directa a WhatsApp (RSVP)**:
   - Al pulsar "Confirmar Asistencia por WhatsApp", abre WhatsApp con el mensaje pre-llenado indicando:
     - Nombre completo del invitado
     - Número de pases reservados
     - ID de invitación
4. **Diseño Visual de Lujo (Ultra-Luxe Wedding Aesthetic)**:
   - Paleta en Oro Champagne, Marfil y detalles en Cristal / Glassmorphism.
   - Tipografía de alta fidelidad: *Cormorant Garamond*, *Pinyon Script* y *Montserrat*.
   - Partículas doradas / pétalos flotantes en Canvas de alto rendimiento.
   - Música ambiental romántica generada con Web Audio API (con botón interactivo y animación de ecualizador).
5. **Secciones Esenciales de la Boda**:
   - Portada Hero con fotografía editorial y monograma de los novios.
   - Tarjeta exclusiva del invitado con detalles de pases y mesa.
   - Cuenta regresiva en tiempo real (Días, Horas, Minutos, Segundos).
   - Lugares (Ceremonia & Recepción) con botones directos a Google Maps.
   - Cronograma / Itinerario del evento.
   - Código de vestimenta con paleta de colores sugerida.
   - Mesa de regalos con botón para copiar la cuenta CLABE al portapapeles.

---

## 📁 Estructura del Repositorio

```
boda-invitacion/
├── index.html              # Estructura principal de la invitación
├── css/
│   └── styles.css          # Sistema de diseño con variables CSS, animaciones y diseño móvil
├── js/
│   ├── guests.js           # Lista/Base de datos de invitados por número (editable)
│   ├── app.js              # Controlador principal (URL query, renderizado, contador, RSVP)
│   └── music.js            # Reproductor ambiental con Web Audio API
├── assets/
│   └── images/
│       └── hero.jpg        # Fotografía principal de portada
├── .agents/                # Contexto y directrices de arquitectura de IA
│   └── PROJECT_CONTEXT.md
├── AGENTS.md
└── README.md
```

---

## 🛠️ Cómo agregar o editar invitados

Edita el archivo [`js/guests.js`](file:///Users/jeec/.gemini/antigravity-ide/scratch/boda-invitacion/js/guests.js) y agrega o modifica los objetos:

```javascript
{
  id: 7,
  code: "07",
  greeting: "Estimada Familia",
  fullName: "Lic. Manuel Navarro y Esposa",
  passes: 2,
  passesText: "2 Lugares reservados en su honor",
  table: "Mesa #08 — Los Cipreses",
  customNote: "Nos encantará contar con su presencia en esta velada inolvidable."
}
```

Para compartir el link con ellos:
`https://tudominio.com/?id=7`

---

## 🚀 Cómo ejecutar localmente

Puedes abrir directamente el archivo `index.html` en cualquier navegador web o usar cualquier servidor local estático:

```bash
# Con Python
python3 -m http.server 8080

# O con npx serve
npx serve .
```

Abre en tu navegador:
`http://localhost:8080/?id=1`
