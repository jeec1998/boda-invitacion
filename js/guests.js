import {
  INVITADOS,
  NOTA_MADRE,
  NOTA_HIJA,
  NOTA_HERMANOS,
  NOTA_FAMILIA,
  NOTA_PARIENTES,
  NOTA_AMIGOS,
  NOTA_PADRINOS,
  NOTA_ESPECIAL
} from "./invitados.js";

/**
 * MOTOR DE BÚSQUEDA Y PERSISTENCIA DE INVITADOS
 *
 * La lista editable de invitados y la constante `NOTA_ESPECIAL` viven en `js/invitados.js`.
 * Este módulo proporciona la búsqueda rápida por ID, código o nombre/apellido y la sincronización local.
 */

/**
 * @typedef {Object} GuestRecord
 * @property {number} id          - Identificador numérico único (1..N, 0 para DEFAULT_GUEST)
 * @property {string} fullName    - Nombre completo para visualización en sobre, tarjeta y WhatsApp
 * @property {string} customNote  - Mensaje personalizado para la tarjeta de invitación (por defecto `NOTA_ESPECIAL`)
 */

export const DB_VERSION = "2.6.0";
export const STORAGE_KEYS = {
  DATA: "boda_invitacion_guests_db_v1",
  VERSION: "boda_invitacion_guests_ver_v1"
};
export const MIN_SEARCH_LENGTH = 2;

export const DEFAULT_CUSTOM_NOTE = NOTA_ESPECIAL;

/**
 * Normaliza cadenas removiendo tildes, caracteres diacríticos y colapsando espacios múltiples.
 * @param {string} text
 * @returns {string}
 */
export function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Limpia espacios al inicio, al final y espacios múltiples intermedios.
 * @param {string} val
 * @returns {string}
 */
function cleanString(val) {
  return String(val ?? "").replace(/\s+/g, " ").trim();
}

/**
 * Normaliza un registro de invitado conservando únicamente los 3 campos usados por la interfaz:
 * `id`, `fullName` y `customNote` (asignando `NOTA_ESPECIAL` si `customNote` se omite o está vacío).
 * @param {Partial<GuestRecord>} raw
 * @returns {GuestRecord}
 */
export function normalizeGuestRecord(raw = {}) {
  const id = Number.isFinite(Number(raw.id)) ? Number(raw.id) : 0;
  const fullName = cleanString(raw.fullName || "") || "Familia & Amigos";
  const customNote = cleanString(raw.customNote || "") || NOTA_ESPECIAL;

  return {
    id,
    fullName,
    customNote
  };
}

/**
 * Catálogo semilla normalizado importado desde `js/invitados.js`.
 * @type {GuestRecord[]}
 */
export const GUESTS_DATABASE = INVITADOS.map(normalizeGuestRecord);

/**
 * Invitado predeterminado cuando no se pasa ningún parámetro por URL.
 * @type {GuestRecord}
 */
export const DEFAULT_GUEST = normalizeGuestRecord({
  id: 0,
  fullName: "Familia & Amigos",
  customNote: NOTA_ESPECIAL
});

/**
 * Colección activa en memoria para acceso síncrono e instantáneo (Zero-FOUC).
 * @type {GuestRecord[]}
 */
let activeGuestsCollection = GUESTS_DATABASE.map(g => ({ ...g }));

/**
 * Obtiene referencia segura a localStorage si está disponible en el entorno.
 * @returns {Storage|null}
 */
function getStorage() {
  try {
    if (typeof globalThis !== "undefined" && globalThis.localStorage) {
      return globalThis.localStorage;
    }
  } catch (_err) {
    // Ignorar SecurityError en modos de navegación privada estrictos
  }
  return null;
}

/**
 * Guarda de forma segura la colección activa y versión en localStorage.
 * @param {GuestRecord[]} records
 * @param {string} version
 */
function persistToStorage(records, version = DB_VERSION) {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEYS.DATA, JSON.stringify(records));
    storage.setItem(STORAGE_KEYS.VERSION, String(version));
  } catch (_err) {
    // Tolerancia a QuotaExceededError o SecurityError; continúa operando en memoria
  }
}

/**
 * Deriva el código formateado de 2 dígitos a partir del ID (ej. 1 -> "01").
 * @param {number} id
 * @returns {string}
 */
function deriveCode(id) {
  return id > 0 ? String(id).padStart(2, "0") : "--";
}

/**
 * Construye el índice de búsqueda normalizado para un registro de invitado.
 * @param {GuestRecord} g
 * @returns {string}
 */
function buildSearchIndex(g) {
  return normalizeText(`${g.fullName} ${deriveCode(g.id)} ${g.id}`);
}

/**
 * Servicio de repositorio local de invitados con hidratación síncrona y soporte localStorage.
 */
export const GuestsDB = {
  /**
   * Inicializa o re-hidrata la base de datos local comparando DB_VERSION.
   * Si localStorage lanza excepción (modo privado / cuota), opera 100% en memoria.
   * @param {{ version?: string, seed?: Partial<GuestRecord>[] }} [options]
   * @returns {GuestRecord[]}
   */
  init(options = {}) {
    const targetVersion = options.version || DB_VERSION;
    const baseSeed = Array.isArray(options.seed)
      ? options.seed.map(normalizeGuestRecord)
      : GUESTS_DATABASE.map(g => normalizeGuestRecord(g));

    const storage = getStorage();
    if (!storage) {
      activeGuestsCollection = baseSeed;
      return this.getAll();
    }

    try {
      const storedVersion = storage.getItem(STORAGE_KEYS.VERSION);
      const rawData = storage.getItem(STORAGE_KEYS.DATA);

      if (storedVersion === targetVersion && rawData) {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          activeGuestsCollection = parsed.map(normalizeGuestRecord);
          return this.getAll();
        }
      }

      activeGuestsCollection = baseSeed;
      persistToStorage(activeGuestsCollection, targetVersion);
    } catch (_err) {
      activeGuestsCollection = baseSeed;
    }

    return this.getAll();
  },

  /**
   * Devuelve una copia de todos los invitados registrados.
   * @returns {GuestRecord[]}
   */
  getAll() {
    return activeGuestsCollection.map(g => ({ ...g }));
  },

  /**
   * Busca un invitado por su ID numérico o string numérico.
   * @param {number|string} id
   * @returns {GuestRecord|null}
   */
  getById(id) {
    if (id === null || id === undefined || id === "") return null;
    const rawStr = String(id).trim();
    if (!/^\d+$/.test(rawStr)) return null;
    const numericId = Number(rawStr);
    if (!Number.isFinite(numericId) || numericId <= 0) return null;

    const found = activeGuestsCollection.find(g => g.id === numericId);
    return found ? { ...found } : null;
  },

  /**
   * Busca un invitado por su código derivado (ej. "01", "1"), insensible a ceros a la izquierda.
   * @param {string|number} code
   * @returns {GuestRecord|null}
   */
  getByCode(code) {
    if (code === null || code === undefined || code === "") return null;
    const cleanCode = String(code).trim().toLowerCase();
    if (!cleanCode || !/^\d+$/.test(cleanCode)) return null;

    const numericId = Number(cleanCode);
    return this.getById(numericId);
  },

  /**
   * Busca invitados cuyo `fullName` coincida con todos los tokens de búsqueda
   * (insensible a tildes y mayúsculas). Requiere al menos MIN_SEARCH_LENGTH (2) caracteres.
   * @param {string} query
   * @returns {GuestRecord[]}
   */
  search(query) {
    if (!query) return [];
    const cleanQ = normalizeText(query);
    if (cleanQ.length < MIN_SEARCH_LENGTH) return [];

    const tokens = cleanQ.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    return activeGuestsCollection
      .filter(g => {
        const index = buildSearchIndex(g);
        return tokens.every(token => index.includes(token));
      })
      .map(g => ({ ...g }));
  },

  /**
   * Restaura la base de datos local a los valores originales de GUESTS_DATABASE (`js/invitados.js`).
   * @returns {GuestRecord[]}
   */
  resetSeed() {
    activeGuestsCollection = GUESTS_DATABASE.map(g => normalizeGuestRecord(g));
    persistToStorage(activeGuestsCollection, DB_VERSION);
    return this.getAll();
  }
};

// Auto-hidratación síncrona al cargar el módulo (Zero-FOUC)
GuestsDB.init();

/**
 * Busca todos los invitados cuyo nombre o apellido contenga el texto ingresado.
 * Delega en `GuestsDB.search(query)`.
 * @param {string} query
 * @returns {GuestRecord[]} Lista de invitados que coinciden
 */
export function searchGuestsByName(query) {
  return GuestsDB.search(query);
}

/**
 * Busca un invitado por ID, código (`?p=01`) o nombre/apellido mediante `GuestsDB`.
 * @param {string|number} query
 * @returns {GuestRecord|null} Datos del invitado, DEFAULT_GUEST si query es vacío, o null si no se encuentra
 */
export function findGuest(query) {
  if (query === null || query === undefined || String(query).trim() === "") {
    return DEFAULT_GUEST;
  }

  const rawTrimmed = String(query).trim();

  // 1. Intentar por ID o código numérico ("1", "01")
  const byId = GuestsDB.getById(rawTrimmed);
  if (byId) return byId;

  const byCode = GuestsDB.getByCode(rawTrimmed);
  if (byCode) return byCode;

  // 2. Intentar coincidencia exacta o contenida en fullName
  const cleanQ = normalizeText(rawTrimmed);
  if (!cleanQ) return DEFAULT_GUEST;

  const all = GuestsDB.getAll();
  const exactOrSubstring = all.find(g => {
    const cleanFull = normalizeText(g.fullName);
    return cleanFull === cleanQ || cleanFull.includes(cleanQ);
  });

  if (exactOrSubstring) return exactOrSubstring;

  // 3. Intentar búsqueda tokenizada (ej. "Carlos Morales" -> "Carlos Mendoza & Mariana Morales")
  const tokenMatches = GuestsDB.search(rawTrimmed);
  return tokenMatches.length > 0 ? tokenMatches[0] : null;
}

export {
  INVITADOS,
  NOTA_MADRE,
  NOTA_HIJA,
  NOTA_HERMANOS,
  NOTA_FAMILIA,
  NOTA_PARIENTES,
  NOTA_AMIGOS,
  NOTA_PADRINOS,
  NOTA_ESPECIAL
};
