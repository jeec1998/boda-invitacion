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
 * Busca un invitado por su número (ID o código)
 * @param {string|number} query
 * @returns {object} Datos del invitado o DEFAULT_GUEST
 */
export function findGuest(query) {
  if (!query) return DEFAULT_GUEST;
  
  const cleaned = String(query).trim().toLowerCase();
  
  const found = GUESTS_DATABASE.find(g => 
    String(g.id) === cleaned || 
    String(g.code).toLowerCase() === cleaned ||
    g.fullName.toLowerCase().includes(cleaned)
  );

  return found || null;
}
