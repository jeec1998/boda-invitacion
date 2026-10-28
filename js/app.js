import { GUESTS_DATABASE, DEFAULT_GUEST, GuestsDB, findGuest } from './guests.js';
import { musicPlayer } from './music.js';

// Teléfono de los novios para confirmación de asistencia y consultas (+593 0983310033)
export const WEDDING_PHONE = "593983310033"; 

// Fecha y hora del evento para el contador (Sábado 19 de Diciembre de 2026, 19:00 hrs)
export const WEDDING_DATE = new Date("2026-12-19T19:00:00").getTime();

// Estado actual
let currentGuest = DEFAULT_GUEST;

document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
  initHeroPhotoMovement();
  initGuestFromUrl();
  initCountdown();
  initPetalsCanvas();
  initControls();
});

/**
 * Inicializa la experiencia del sobre interactivo de bienvenida
 */
function initEnvelope() {
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const openBtn = document.getElementById('btn-open-envelope');
  const seal = document.querySelector('.envelope-seal');
  
  if (!envelopeOverlay) return;

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('open') === '1') {
    envelopeOverlay.style.display = 'none';
    envelopeOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('envelope-active');
    const heroPhoto = document.getElementById('hero-photo-card');
    if (heroPhoto) heroPhoto.classList.add('is-floating');
    return;
  }

  // Congelar scroll del body mientras el sobre cubre la pantalla
  document.body.classList.add('envelope-active');

  let hasOpened = false;

  const handleOpen = async () => {
    if (hasOpened) return;
    hasOpened = true;

    // 1. Iniciar música de forma síncrona en el callback del clic (habilita autoplay en móviles)
    const musicBtn = document.getElementById('music-toggle-btn');
    try {
      const playing = await musicPlayer.playWithFadeIn(0.5, 1200);
      if (musicBtn) musicBtn.classList.toggle('is-playing', playing);
    } catch (err) {
      console.warn("Autoplay al abrir sobre:", err);
    }

    // 2. Animar apertura y desvanecimiento
    envelopeOverlay.classList.add('opened');
    document.body.classList.remove('envelope-active');

    // 3. Activar animación de emergencia de la foto del sobre en el Hero
    const heroPhoto = document.getElementById('hero-photo-card');
    if (heroPhoto) {
      heroPhoto.classList.remove('is-floating');
      heroPhoto.classList.add('reveal-rising');
      setTimeout(() => {
        heroPhoto.classList.remove('reveal-rising');
        heroPhoto.classList.add('is-floating');
      }, 1400);
    }

    // 4. Remover del flujo del DOM tras terminar la transición CSS
    setTimeout(() => {
      envelopeOverlay.style.display = 'none';
      envelopeOverlay.setAttribute('aria-hidden', 'true');
    }, 900);
  };

  if (openBtn) openBtn.addEventListener('click', handleOpen);
  if (seal) seal.addEventListener('click', handleOpen);
}

/**
 * Obtiene el invitado desde los parámetros de la URL (?nombre=, ?id=, ?n=)
 */
function initGuestFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const guestQuery = params.get('id') || params.get('nombre') || params.get('n') || params.get('p') || params.get('invitacion');
  const guestSection = document.getElementById('invitacion');
  const rsvpGuestContainer = document.getElementById('rsvp-guest-info');
  
  if (guestQuery) {
    const found = findGuest(guestQuery);
    if (found) {
      currentGuest = found;
    } else {
      currentGuest = {
        ...DEFAULT_GUEST,
        fullName: decodeURIComponent(guestQuery),
        customNote: DEFAULT_GUEST.customNote
      };
    }
    if (guestSection) guestSection.style.display = 'flex';
    if (rsvpGuestContainer) rsvpGuestContainer.style.display = 'block';
    renderGuest(currentGuest);
  } else {
    // Si en la URL no viene el id, NO se renderiza la sección de invitación
    currentGuest = null;
    if (guestSection) guestSection.style.display = 'none';
    if (rsvpGuestContainer) rsvpGuestContainer.style.display = 'none';
    document.title = "Boda de Edgar Enríquez & Mariela Cortez | Invitación Especial";
    
    // Configurar sobre en modo general
    const envGuestBadge = document.getElementById('envelope-guest-badge');
    const envInvText = document.getElementById('envelope-invitation-text');
    if (envGuestBadge) envGuestBadge.style.display = 'none';
    if (envInvText) envInvText.textContent = "Les Invitamos Cordialmente";
  }
}

/**
 * Renderiza los datos del invitado en la interfaz (usando únicamente id, fullName y customNote)
 */
export function renderGuest(guest) {
  currentGuest = guest;

  const displayName = guest?.fullName || "Familia & Amigos";
  const displayMessage =
    guest?.customNote ||
    "Tenemos el honor de invitarte a celebrar nuestra boda y ser testigo de nuestro amor.";

  const greetingEl = document.getElementById('guest-greeting');
  const nameEl = document.getElementById('guest-name');
  const messageEl = document.getElementById('guest-message');
  const badgeEl = document.getElementById('guest-badge');
  const rsvpNameEl = document.getElementById('rsvp-guest-name');
  const waContactBtn = document.getElementById('btn-whatsapp-contact');

  if (greetingEl) greetingEl.textContent = "Con mucho cariño para";
  if (nameEl) nameEl.textContent = displayName;
  if (messageEl) messageEl.textContent = displayMessage;
  if (badgeEl) badgeEl.textContent = "Invitación de Honor";
  if (rsvpNameEl) rsvpNameEl.textContent = displayName;

  // Actualizar también el sobre exterior si el usuario aún no lo ha abierto
  const envGuestBadge = document.getElementById('envelope-guest-badge');
  const envGuestName = document.getElementById('envelope-guest-name');
  const envInvText = document.getElementById('envelope-invitation-text');

  if (guest && guest.fullName) {
    if (envGuestBadge) envGuestBadge.style.display = 'inline-flex';
    if (envGuestName) envGuestName.textContent = displayName;
    if (envInvText) envInvText.textContent = "Tenemos el honor de invitar a:";
  } else {
    if (envGuestBadge) envGuestBadge.style.display = 'none';
    if (envInvText) envInvText.textContent = "Les Invitamos Cordialmente";
  }

  // Actualizar título de la pestaña del navegador
  document.title = `Boda de Edgar Enríquez & Mariela Cortez | Invitación para ${displayName}`;

  // Actualizar enlace de confirmación directa por WhatsApp
  if (waContactBtn) {
    const msg = encodeURIComponent(`¡Hola Edgar y Mariela! 👋 Les saluda ${displayName}. Deseo confirmar mi asistencia a su boda.`);
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
 * Controlador de música ambiental
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
      color: (() => {
        const rand = Math.random();
        if (rand < 0.45) return 'rgba(110, 26, 32, 0.42)'; // Pétalo vino tinto
        if (rand < 0.75) return 'rgba(201, 162, 74, 0.45)'; // Destello oro champán
        return 'rgba(247, 238, 228, 0.55)'; // Destello marfil suave
      })(),
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

/**
 * Inicializa el movimiento interactivo, perspectiva 3D y lightbox de la foto en el sobre
 */
function initHeroPhotoMovement() {
  const stage = document.getElementById('hero-envelope-stage');
  const scene = stage ? stage.querySelector('.envelope-scene') : null;
  const photoHolder = document.getElementById('hero-photo-card');
  const lightbox = document.getElementById('photo-lightbox-modal');
  const closeBtn = document.getElementById('btn-close-lightbox');
  const backdrop = document.getElementById('lightbox-backdrop');

  if (!stage || !photoHolder) return;

  // 1. Efecto sutil de perspectiva e inclinación 3D al mover el cursor sobre el escenario
  let isMoving = false;
  stage.addEventListener('mousemove', (e) => {
    if (!scene) return;
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (!isMoving) {
      requestAnimationFrame(() => {
        scene.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
        isMoving = false;
      });
      isMoving = true;
    }
  });

  stage.addEventListener('mouseleave', () => {
    if (scene) {
      scene.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    }
  });

  // 2. Soporte para acelerómetro / inclinación suave en móviles si está disponible
  if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientation', (e) => {
      if (!scene || e.gamma === null || e.beta === null) return;
      const gamma = Math.max(-20, Math.min(20, e.gamma));
      const beta = Math.max(-20, Math.min(20, e.beta - 45));
      scene.style.transform = `perspective(1000px) rotateY(${gamma * 0.35}deg) rotateX(${-beta * 0.35}deg)`;
    }, { passive: true });
  }

  // 3. Apertura del lightbox al hacer clic o presionar Enter en la foto
  const openLightbox = () => {
    if (!lightbox) return;
    lightbox.style.display = 'flex';
    void lightbox.offsetWidth; // forzar reflow
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    setTimeout(() => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }, 350);
  };

  photoHolder.addEventListener('click', openLightbox);
  photoHolder.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

