import { GUESTS_DATABASE, DEFAULT_GUEST, findGuest, searchGuestsByName } from './guests.js';
import { musicPlayer } from './music.js';

// Enlace de Google Form para confirmación de asistencia (reemplázalo con la URL de tu formulario creado)
export const GOOGLE_FORM_URL = "https://forms.google.com/";

// Teléfono de los novios para consultas y contacto (+593 0983310033)
export const WEDDING_PHONE = "593983310033"; 

// Fecha y hora del evento para el contador (Sábado 19 de Diciembre de 2026, 17:00 hrs)
export const WEDDING_DATE = new Date("2026-12-19T17:00:00").getTime();

// Estado actual
let currentGuest = DEFAULT_GUEST;

document.addEventListener('DOMContentLoaded', () => {
  initGuestFromUrl();
  initCountdown();
  initPetalsCanvas();
  initControls();
});

/**
 * Obtiene el invitado desde los parámetros de la URL (?nombre=, ?id=, ?n=)
 */
function initGuestFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const guestQuery = params.get('nombre') || params.get('n') || params.get('id') || params.get('p') || params.get('invitacion');
  
  if (guestQuery) {
    const found = findGuest(guestQuery);
    if (found) {
      currentGuest = found;
    } else {
      currentGuest = {
        ...DEFAULT_GUEST,
        fullName: decodeURIComponent(guestQuery),
        customNote: "Nos encantará contar con tu presencia en este momento tan especial."
      };
    }
  } else {
    // Si no hay parámetro, cargar el invitado predeterminado
    currentGuest = GUESTS_DATABASE[0] || DEFAULT_GUEST;
  }

  renderGuest(currentGuest);
}

/**
 * Renderiza los datos del invitado en la interfaz (sin mostrar pases ni mesas)
 */
export function renderGuest(guest) {
  currentGuest = guest;

  const greetingEl = document.getElementById('guest-greeting');
  const nameEl = document.getElementById('guest-name');
  const messageEl = document.getElementById('guest-message');
  const badgeEl = document.getElementById('guest-badge');
  const rsvpNameEl = document.getElementById('rsvp-guest-name');
  const googleFormBtn = document.getElementById('btn-google-form');
  const waContactBtn = document.getElementById('btn-whatsapp-contact');

  if (greetingEl) greetingEl.textContent = guest.greeting || "Apreciable";
  if (nameEl) nameEl.textContent = guest.fullName || "Familia & Amigos";
  if (messageEl) messageEl.textContent = guest.customNote || "Tenemos el honor de invitarte a celebrar nuestra boda.";
  if (badgeEl) badgeEl.textContent = "Invitación de Honor";
  if (rsvpNameEl) rsvpNameEl.textContent = guest.fullName || "Familia & Amigos";

  // Actualizar título de la pestaña del navegador
  document.title = `Boda de Edgar Enríquez & Mariela Cortez | Invitación para ${guest.fullName}`;

  // Actualizar enlace al Formulario de Google
  if (googleFormBtn) {
    googleFormBtn.href = GOOGLE_FORM_URL;
  }

  // Actualizar enlace de contacto directo a WhatsApp
  if (waContactBtn) {
    const msg = encodeURIComponent(`¡Hola Edgar y Mariela! 👋 Les saluda ${guest.fullName}. Tengo una consulta sobre su boda.`);
    waContactBtn.href = `https://wa.me/${WEDDING_PHONE}?text=${msg}`;
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
 * Controladores de música y modal de búsqueda por nombre
 */
function initControls() {
  // Botón de Música (admite canción de entrada nupcial o sintetizador)
  const musicBtn = document.getElementById('music-toggle-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', async () => {
      const playing = await musicPlayer.toggle();
      musicBtn.classList.toggle('is-playing', playing);
      showToast(playing ? "🎵 Canción nupcial reproduciéndose" : "🔇 Música pausada");
    });
  }

  // Modal de Búsqueda por Nombre
  const openModalBtn = document.getElementById('btn-open-search');
  const closeModalBtn = document.getElementById('btn-close-modal');
  const modalBackdrop = document.getElementById('search-modal');
  const searchInput = document.getElementById('modal-search-input');
  const searchSubmitBtn = document.getElementById('btn-search-submit');
  const resultsContainer = document.getElementById('search-results-container');

  function openModal() {
    if (modalBackdrop) modalBackdrop.classList.add('is-active');
    if (resultsContainer) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
    }
    if (searchInput) {
      searchInput.value = '';
      setTimeout(() => searchInput.focus(), 100);
    }
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('is-active');
    if (resultsContainer) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
    }
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  function selectGuest(guest) {
    renderGuest(guest);
    updateUrlParam(guest.id);
    closeModal();
    showToast(`✨ Invitación cargada para: ${guest.fullName}`);
    document.querySelector('.guest-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleSearch() {
    const val = searchInput?.value.trim();
    if (!val) return;

    const matches = searchGuestsByName(val);

    if (matches.length === 1) {
      selectGuest(matches[0]);
    } else if (matches.length > 1) {
      // Mostrar lista interactiva de nombres coincidentes
      if (resultsContainer) {
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 8px; text-align: left;">
            Selecciona tu nombre de la lista:
          </p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${matches.map(g => `
              <button type="button" class="btn btn-outline search-item-btn" data-id="${g.id}" style="text-align: left; justify-content: flex-start; padding: 10px 14px; font-size: 0.88rem; width: 100%;">
                👤 <strong>${g.fullName}</strong>
              </button>
            `).join('')}
          </div>
        `;

        resultsContainer.querySelectorAll('.search-item-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const guest = findGuest(id);
            if (guest) selectGuest(guest);
          });
        });
      }
    } else {
      // Intentar coincidencia directa alternativa
      const single = findGuest(val);
      if (single && single.id !== 0) {
        selectGuest(single);
      } else {
        if (resultsContainer) {
          resultsContainer.style.display = 'block';
          resultsContainer.innerHTML = `
            <div style="background: rgba(198, 40, 40, 0.08); border: 1px solid rgba(198, 40, 40, 0.2); padding: 12px; border-radius: 8px; color: #C62828; font-size: 0.86rem; text-align: center;">
              No se encontró una invitación para "<strong>${escapeHtml(val)}</strong>".<br>
              <span style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; display: block;">
                Verifica la ortografía de tu nombre o apellido.
              </span>
            </div>
          `;
        }
        showToast(`No se encontró invitación para "${val}"`);
      }
    }
  }

  if (searchSubmitBtn) searchSubmitBtn.addEventListener('click', handleSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }
}

/**
 * Escapa caracteres HTML para seguridad
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Actualiza el query param de la URL sin recargar la página
 */
function updateUrlParam(id) {
  const newUrl = `${window.location.pathname}?id=${id}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
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
 * Animación sutil de partículas doradas en Canvas
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
  const petalCount = 22;

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
