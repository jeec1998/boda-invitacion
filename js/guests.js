/**
 * BASE DE DATOS DE INVITADOS
 * 
 * Cada invitado tiene asignado un número identificador (ID).
 * Puedes agregar, editar o eliminar invitados fácilmente siguiendo este formato.
 * Para acceder a una invitación por URL:
 *   index.html?id=1
 *   index.html?id=2
 *   index.html?p=3
 */

export const GUESTS_DATABASE = [
  {
    id: 1,
    code: "01",
    greeting: "Apreciable Familia",
    fullName: "Carlos Mendoza & Mariana Morales",
    passes: 2,
    passesText: "2 Lugares reservados en su honor",
    table: "Mesa #01 — Jardín de las Rosas",
    customNote: "Para nosotros es un verdadero honor contar con su presencia en el inicio de esta nueva etapa.",
    phone: "+52 1 55 1234 5678"
  },
  {
    id: 2,
    code: "02",
    greeting: "Estimado",
    fullName: "Dr. Fernando Ruiz Alarcón",
    passes: 1,
    passesText: "1 Pase personal reservado",
    table: "Mesa #03 — Los Olivos",
    customNote: "Tu amistad y apoyo han sido fundamentales para nosotros. ¡No puedes faltar a celebrar!",
    phone: "+52 1 55 2345 6789"
  },
  {
    id: 3,
    code: "03",
    greeting: "Queridos amigos",
    fullName: "Roberto Gómez, Andrea Soto & Familia",
    passes: 4,
    passesText: "4 Lugares reservados para su familia",
    table: "Mesa #05 — Las Gardenias",
    customNote: "Será una noche mágica y queremos brindar junto a ustedes por todos los momentos vividos y los que vienen.",
    phone: "+52 1 55 3456 7890"
  },
  {
    id: 4,
    code: "04",
    greeting: "Apreciable",
    fullName: "Lic. Sofía Valenzuela & Acompañante",
    passes: 2,
    passesText: "2 Lugares reservados en su honor",
    table: "Mesa #02 — Los Laureles",
    customNote: "¡Estamos listos para bailar y festejar contigo este gran día!",
    phone: "+52 1 55 4567 8901"
  },
  {
    id: 5,
    code: "05",
    greeting: "Querida",
    fullName: "Dra. Valentina Castro Méndez",
    passes: 1,
    passesText: "1 Pase personal reservado",
    table: "Mesa #04 — Orquídeas",
    customNote: "Nuestra boda no estaría completa sin tu cariño y compañía. ¡Te esperamos con los brazos abiertos!",
    phone: "+52 1 55 5678 9012"
  },
  {
    id: 6,
    code: "06",
    greeting: "Estimada Familia",
    fullName: "Familia Herrera Ramos",
    passes: 3,
    passesText: "3 Lugares reservados en su honor",
    table: "Mesa #06 — Magnolias",
    customNote: "Agradecemos de corazón todo su cariño y bendiciones en nuestro camino.",
    phone: "+52 1 55 6789 0123"
  }
];

/**
 * Invitado predeterminado que se muestra si no se pasa ningún número por URL
 * o si el número ingresado no coincide con la base de datos.
 */
export const DEFAULT_GUEST = {
  id: 0,
  code: "--",
  greeting: "Apreciables",
  fullName: "Familia & Amigos",
  passes: 2,
  passesText: "2 Lugares reservados en su honor",
  table: "Mesa Asignada en Recepción",
  customNote: "Tenemos el honor de invitarte a celebrar nuestra boda y ser testigo de nuestro amor.",
  phone: ""
};

/**
 * Normaliza cadenas removiendo tildes y caracteres diacríticos
 */
function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Busca todos los invitados cuyo nombre contenga el texto ingresado
 * @param {string} query
 * @returns {Array} Lista de invitados que coinciden
 */
export function searchGuestsByName(query) {
  if (!query) return [];
  const cleanQ = normalizeText(query);
  if (!cleanQ) return [];

  return GUESTS_DATABASE.filter(g => {
    const cleanName = normalizeText(g.fullName);
    return cleanName.includes(cleanQ);
  });
}

/**
 * Busca un invitado por nombre o identificador
 * @param {string|number} query
 * @returns {object|null} Datos del invitado o null si no se encuentra
 */
export function findGuest(query) {
  if (!query) return DEFAULT_GUEST;
  
  const cleanQ = normalizeText(query);
  
  // Buscar coincidencia por nombre (exacta o contenida) o por ID/código
  const found = GUESTS_DATABASE.find(g => {
    const cleanName = normalizeText(g.fullName);
    return cleanName === cleanQ ||
      cleanName.includes(cleanQ) ||
      String(g.id) === String(query).trim() ||
      String(g.code).toLowerCase() === String(query).trim().toLowerCase();
  });

  return found || null;
}
