import { GUESTS_DATABASE, DEFAULT_GUEST, findGuest } from './guests.js';
import { musicPlayer } from './music.js';

// Teléfono de los novios para confirmación por WhatsApp (editable)
const WEDDING_PHONE = "5215512345678"; 

// Fecha y hora del evento para el contador
const WEDDING_DATE = new Date("2026-11-28T17:00:00").getTime();

// Estado actual
let currentGuest = DEFAULT_GUEST;

document.addEventListener('DOMContentLoaded', () => {
  initGuestFromUrl();
  initCountdown();
  initPetalsCanvas();
  initControls();
  initDemoToolbar();
});

/**
 * Obtiene el ID del invitado desde la URL (?id=, ?p=, ?n=, ?codigo=)
 */
function initGuestFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const guestQuery = params.get('id') || params.get('p') || params.get('n') || params.get('codigo') || params.get('invitacion');
  
  if (guestQuery) {
    const found = findGuest(guestQuery);
    if (found) {
      currentGuest = found;
    } else {
      currentGuest = {
        ...DEFAULT_GUEST,
        fullName: `Invitación #${guestQuery}`,
        customNote: "Por favor revisa el número con los novios para verificar tu asignación de pases."
      };
    }
  } else {
    // Si no hay parámetro, cargar el invitado #1 por defecto para una vista previa completa
    currentGuest = GUESTS_DATABASE[0] || DEFAULT_GUEST;
  }

  renderGuest(currentGuest);
}

/**
 * Renderiza todos los datos del invitado en la interfaz
 */
export function renderGuest(guest) {
  currentGuest = guest;

  // Actualizar elementos DOM
  const greetingEl = document.getElementById('guest-greeting');
  const nameEl = document.getElementById('guest-name');
  const messageEl = document.getElementById('guest-message');
  const passesEl = document.getElementById('guest-passes');
  const tableEl = document.getElementById('guest-table');
  const badgeEl = document.getElementById('guest-badge');
  const rsvpNameEl = document.getElementById('rsvp-guest-name');

  if (greetingEl) greetingEl.textContent = guest.greeting || "Apreciable";
  if (nameEl) nameEl.textContent = guest.fullName;
  if (messageEl) messageEl.textContent = guest.customNote;
  if (passesEl) passesEl.textContent = guest.passesText || `${guest.passes} Lugares reservados`;
  if (tableEl) tableEl.textContent = guest.table || "Recepción";
  if (badgeEl) badgeEl.textContent = `Invitación Oficial #${guest.code || guest.id}`;
  if (rsvpNameEl) rsvpNameEl.textContent = guest.fullName;

  // Actualizar título de la pestaña
  document.title = `Boda de Valeria & Julián | Invitación para ${guest.fullName}`;

  // Actualizar enlaces de WhatsApp
  updateWhatsAppLinks(guest);

  // Cargar estado de confirmación guardado localmente
  updateRsvpStatusUI(guest.id);
}

/**
 * Genera y actualiza los enlaces de WhatsApp con el mensaje personalizado
 */
function updateWhatsAppLinks(guest) {
  const btnAccept = document.getElementById('btn-whatsapp-accept');
  const btnDecline = document.getElementById('btn-whatsapp-decline');

  const textAccept = encodeURIComponent(
    `¡Hola Valeria y Julián! 💍✨\n\nConfirmo con mucha alegría mi asistencia a su boda.\n` +
    `👤 *Invitado:* ${guest.fullName}\n` +
    `🎟️ *Pases reservados:* ${guest.passes}\n` +
    `🔢 *Invitación:* #${guest.code || guest.id}\n\n` +
    `¡Nos vemos para celebrar este gran día!`
  );

  const textDecline = encodeURIComponent(
    `¡Hola Valeria y Julián! 🌸\n\n` +
    `Agradezco muchísimo su invitación a su boda. Con mucho pesar, en esta ocasión no podré acompañarlos.\n` +
    `👤 *Invitado:* ${guest.fullName} (#${guest.code || guest.id})\n\n` +
    `¡Les deseo una boda inolvidable y el mayor de los éxitos en esta nueva etapa!`
  );

  if (btnAccept) {
    btnAccept.href = `https://wa.me/${WEDDING_PHONE}?text=${textAccept}`;
  }
  if (btnDecline) {
    btnDecline.href = `https://wa.me/${WEDDING_PHONE}?text=${textDecline}`;
  }
}

/**
 * Inicializa el contador regresivo
 */
function initCountdown() {
  function update() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    if (distance <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minEl = document.getElementById('minutes');
    const secEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minEl) minEl.textContent = pad(minutes);
    if (secEl) secEl.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

/**
 * Controladores de música, modal de búsqueda y botones de copia
 */
function initControls() {
  // Música
  const musicBtn = document.getElementById('music-toggle-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      const playing = musicPlayer.toggle();
      musicBtn.classList.toggle('is-playing', playing);
      showToast(playing ? "🎵 Música ambiental activada" : "🔇 Música pausada");
    });
  }

  // Modal de Búsqueda
  const openModalBtn = document.getElementById('btn-open-search');
  const closeModalBtn = document.getElementById('btn-close-modal');
  const modalBackdrop = document.getElementById('search-modal');
  const searchInput = document.getElementById('modal-search-input');
  const searchSubmitBtn = document.getElementById('btn-search-submit');

  function openModal() {
    if (modalBackdrop) modalBackdrop.classList.add('is-active');
    if (searchInput) {
      searchInput.value = '';
      setTimeout(() => searchInput.focus(), 100);
    }
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('is-active');
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  function handleSearch() {
    const val = searchInput?.value.trim();
    if (!val) return;
    const found = findGuest(val);
    if (found) {
      renderGuest(found);
      updateUrlParam(found.id);
      closeModal();
      showToast(`✨ Invitación cargada para: ${found.fullName}`);
      document.querySelector('.guest-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      showToast(`⚠️ No se encontró la invitación con número "${val}"`);
    }
  }

  if (searchSubmitBtn) searchSubmitBtn.addEventListener('click', handleSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  // Botones preset en el modal
  document.querySelectorAll('.preset-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const id = pill.getAttribute('data-id');
      const found = findGuest(id);
      if (found) {
        renderGuest(found);
        updateUrlParam(found.id);
        closeModal();
        showToast(`✨ Invitación #${found.id}: ${found.fullName}`);
        document.querySelector('.guest-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Botón Copiar CLABE bancaria
  const copyBtn = document.getElementById('btn-copy-clabe');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const clabe = document.getElementById('bank-clabe')?.textContent || "012180004567890123";
      navigator.clipboard.writeText(clabe).then(() => {
        showToast("📋 ¡CLABE bancaria copiada al portapapeles!");
      }).catch(() => {
        showToast("CLABE: " + clabe);
      });
    });
  }

  // Confirmación local rápida (RSVP)
  const quickConfirmBtn = document.getElementById('btn-quick-confirm');
  if (quickConfirmBtn) {
    quickConfirmBtn.addEventListener('click', () => {
      localStorage.setItem(`rsvp_guest_${currentGuest.id}`, 'confirmed');
      updateRsvpStatusUI(currentGuest.id);
      showToast("🎉 ¡Gracias! Tu confirmación ha quedado registrada.");
    });
  }
}

/**
 * Actualiza la UI del estado de RSVP según localStorage
 */
function updateRsvpStatusUI(guestId) {
  const statusBadge = document.getElementById('rsvp-status-badge');
  if (!statusBadge) return;

  const stored = localStorage.getItem(`rsvp_guest_${guestId}`);
  if (stored === 'confirmed') {
    statusBadge.textContent = "✓ Asistencia confirmada previamente";
    statusBadge.className = "rsvp-status-badge confirmed";
  } else {
    statusBadge.textContent = "Pendiente de confirmación";
    statusBadge.className = "rsvp-status-badge";
  }
}

/**
 * Actualiza el query param de la URL sin recargar la página
 */
function updateUrlParam(id) {
  const newUrl = `${window.location.pathname}?id=${id}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
}

/**
 * Barra de herramientas inferior para que el usuario o novios prueben números al instante
 */
function initDemoToolbar() {
  const select = document.getElementById('demo-guest-select');
  if (!select) return;

  select.innerHTML = '';
  GUESTS_DATABASE.forEach(guest => {
    const opt = document.createElement('option');
    opt.value = guest.id;
    opt.textContent = `#${guest.code || guest.id}: ${guest.fullName} (${guest.passes} pases)`;
    if (guest.id === currentGuest.id) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener('change', (e) => {
    const guest = findGuest(e.target.value);
    if (guest) {
      renderGuest(guest);
      updateUrlParam(guest.id);
      showToast(`Mostrando invitación #${guest.id}: ${guest.fullName}`);
    }
  });
}

/**
 * Notificación Toast elegante
 */
let toastTimeout;
export function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('is-visible');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3200);
}

/**
 * Animación sutil de pétalos y partículas doradas en Canvas
 */
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = 22; // Cantidad sutil para rendimiento óptimo

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 2,
      d: Math.random() * petalCount,
      color: Math.random() > 0.4 ? 'rgba(212, 175, 55, 0.45)' : 'rgba(245, 230, 210, 0.5)',
      tilt: Math.random() * 10 - 10,
      tiltInc: Math.random() * 0.05 + 0.01
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
      ctx.fill();

      p.y += 0.6 + p.r * 0.2;
      p.x += Math.sin(p.d) * 0.5;
      p.d += 0.02;

      if (p.y > height) {
        p.y = -10;
        p.x = Math.random() * width;
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}
