/**
 * LISTA DE INVITADOS DE LA BODA
 *
 * Edita únicamente este archivo para agregar, modificar o eliminar invitados.
 *
 * 1. CONSTANTES DE NOTA ESPECIAL POR CATEGORÍA:
 *    Usa cualquiera de estas constantes en `customNote` según la relación con el invitado:
 *    - `NOTA_MADRE`     : Para la madre de los novios
 *    - `NOTA_HIJA`      : Para la hija de los novios
 *    - `NOTA_SOBRINA`   : Para sobrinas de los novios
 *    - `NOTA_HERMANOS`  : Para hermanos y hermanas de los novios
 *    - `NOTA_FAMILIA`   : Para padres, núcleos familiares cercanos
 *    - `NOTA_PARIENTES` : Para tíos, primos y parientes
 *    - `NOTA_AMIGOS`    : Para amigos y compañeros especiales
 *    - `NOTA_PADRINOS`  : Para padrinos y madrinas de la boda
 *    - `NOTA_ESPECIAL`  : Nota general de cortesía (valor por defecto)
 *
 * 2. LISTA `INVITADOS`:
 *    Cada invitado solo necesita 3 campos:
 *    - `id`         : Número del invitado para su enlace personalizado (ej. index.html?id=17)
 *    - `fullName`   : Nombre tal como aparecerá en el sobre, en la tarjeta y en WhatsApp
 *    - `customNote` : Constante de nota según el caso (ej. NOTA_HERMANOS, NOTA_FAMILIA, NOTA_AMIGOS...)
 */

export const NOTA_MADRE =
  "Madre querida, gracias por tu amor incondicional, tus bendiciones y por ser nuestro mayor ejemplo en la vida. Compartir este día tan soñado a tu lado llena nuestro corazón de infinita gratitud y amor.";

export const NOTA_HIJA =
  "Hija amada, eres la mayor bendición y el tesoro más grande de nuestras vidas. Verte sonreír y estar a nuestro lado en este paso tan importante llena nuestro corazón de orgullo y felicidad infinita.";

export const NOTA_SOBRINA =
  "Querida sobrina, verte crecer y compartir momentos tan especiales ha sido una gran alegría en nuestras vidas. En este día tan soñado, contar con tu cariño y compañía hace nuestra celebración aún más inolvidable.";

export const NOTA_HERMANOS =
  "Crecimos compartiendo sueños, risas y los mejores recuerdos de la vida. Hoy, en el día más importante de nuestra historia, no podríamos dar este paso sin tu cariño y compañía. ¡Gracias por estar siempre a nuestro lado!";

export const NOTA_FAMILIA =
  "La familia es el regalo más grande que nos dio la vida. Tenemos el honor de invitarles a compartir con nosotros la alegría de unir nuestras vidas en matrimonio y celebrar juntos este momento inolvidable.";

export const NOTA_PARIENTES =
  "Llevamos en el corazón cada momento compartido en familia. Será una inmensa alegría contar con su presencia y su bendición en el día en que uniremos nuestras vidas para siempre.";

export const NOTA_AMIGOS =
  "Los amigos son la familia que se elige con el corazón. Gracias por ser parte de nuestra historia y acompañarnos en tantas aventuras; ¡prepárense para celebrar y brindar con nosotros en nuestra boda!";

export const NOTA_PADRINOS =
  "Gracias por su ejemplo, su cariño incondicional y por aceptar acompañarnos como guías en este nuevo camino que iniciamos juntos como esposos.";

export const NOTA_ESPECIAL =
  "Tenemos el honor de invitarte a compartir con nosotros la alegría de unir nuestras vidas en matrimonio. Tu presencia será el mejor regalo en este día tan especial.";

export const INVITADOS = [
  {
    id: 1,
    fullName: "Sr. Carlos Mendoza & Mariana Morales",
    customNote: NOTA_FAMILIA
  },
  {
    id: 2,
    fullName: "Sr. Dr. Fernando Ruiz Alarcón",
    customNote: NOTA_AMIGOS
  },
  {
    id: 3,
    fullName: "Sr. Roberto Gómez, Andrea Soto & Familia",
    customNote: NOTA_AMIGOS
  },
  {
    id: 4,
    fullName: "Sra. Lic. Sofía Valenzuela & Acompañante",
    customNote: NOTA_AMIGOS
  },
  {
    id: 5,
    fullName: "Sra. Dra. Valentina Castro Méndez",
    customNote: NOTA_AMIGOS
  },
  {
    id: 6,
    fullName: "Familia Herrera Ramos",
    customNote: NOTA_PARIENTES
  },
  {
    id: 7,
    fullName: "Sr. Ricardo Enríquez & Elena Paredes",
    customNote: NOTA_PARIENTES
  },
  {
    id: 8,
    fullName: "Familia Cortez Villacreses",
    customNote: NOTA_FAMILIA
  },
  {
    id: 9,
    fullName: "Sr. Alejandro Morales Vega",
    customNote: NOTA_AMIGOS
  },
  {
    id: 10,
    fullName: "Sr. Daniel Salazar & Camila Domínguez",
    customNote: NOTA_AMIGOS
  },
  {
    id: 11,
    fullName: "Sra. Gabriela Montalvo León",
    customNote: NOTA_AMIGOS
  },
  {
    id: 12,
    fullName: "Sr. Andrés Zambrano, Lucía Cevallos & Hijos",
    customNote: NOTA_PARIENTES
  },
  {
    id: 13,
    fullName: "Sr. Ing. Mateo Cárdenas & Valeria Noboa",
    customNote: NOTA_ESPECIAL
  },
  {
    id: 14,
    fullName: "Sra. Patricia Delgado de Enríquez",
    customNote: NOTA_PADRINOS
  },
  {
    id: 15,
    fullName: "Sr. Arq. Sebastián Aguirre & Carolina Peñafiel",
    customNote: NOTA_AMIGOS
  },
  {
    id: 16,
    fullName: "Familia Mendoza Alcívar",
    customNote: NOTA_PARIENTES
  },
  // Hermana del novio
  {
    id: 17,
    fullName: "Sra. Nancy Magdalena Enríquez Nazate",
    customNote: NOTA_HERMANOS
  },
  {
    id: 18,
    fullName: "Sr. Héctor Guano & Lourdes Nazate",
    customNote: NOTA_FAMILIA
  },
  {
    id: 19,
    fullName: "Sr. Jairo Moreno & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 20,
    fullName: "Sr. Willian Moreno & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 21,
    fullName: "Sr. Francisco Suárez Freire & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 22,
    fullName: "Sr. Edmundo Falconí & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 23,
    fullName: "Sr. Jorge Saula & Familia",
    customNote: NOTA_AMIGOS
  },
  {
    id: 24,
    fullName: "Sra. Carmen Cortez & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 25,
    fullName: "Sra. Victoria Cortez",
    customNote: NOTA_MADRE
  },
  {
    id: 26,
    fullName: "Sr. Robinson Moreno & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 27,
    fullName: "Sra. Concepción Cortez & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 28,
    fullName: "Sr. Alex Francisco Cortez",
    customNote: NOTA_HERMANOS
  },
  {
    id: 29,
    fullName: "Sr. Luis Aníbal & Familia",
    customNote: NOTA_HERMANOS
  },
  {
    id: 30,
    fullName: "Sra. Sandra Enríquez",
    customNote: NOTA_HIJA
  },
  // Hermana
  {
    id: 31,
    fullName: "Sor María Esperanza",
    customNote: NOTA_HERMANOS
  },
  //invitados padre
  {
    id: 32,
    fullName: "Sra. Luz Angélica Nazate",
    customNote: NOTA_MADRE
  },
  {
    id: 33,
    fullName: "Sr. Marco Cazco",
    customNote: NOTA_FAMILIA
  },
  {
    id: 34,
    fullName: "Sra. Lorena Enríquez & Familia",
    customNote: NOTA_HERMANOS
  },
  {
    id: 35,
    fullName: "Sr. Rodrigo Enríquez & Familia",
    customNote: NOTA_HERMANOS
  },
  {
    id: 36,
    fullName: "Sr. Alejandro Aguilar & Familia",
    customNote: NOTA_AMIGOS
  },
  {
    id: 37,
    fullName: "Sra. Katyuska Enríquez",
    customNote: NOTA_SOBRINA
  },
  {
    id: 38,
    fullName: "Sr. Marlon Samaniego & Sra.",
    customNote: NOTA_AMIGOS
  },
  {
    id: 39,
    fullName: "Sr. Esteven Suárez & Familia",
    customNote: NOTA_AMIGOS
  },
  {
    id: 40,
    fullName: "Sr. Alexander Suárez & Familia",
    customNote: NOTA_AMIGOS
  },
  {
    id: 41,
    fullName: "Sr. Millier Suárez & Sra.",
    customNote: NOTA_AMIGOS
  },
  {
    id: 42,
    fullName: "Sr. Agusto Cazco & Familia",
    customNote: NOTA_AMIGOS
  },
  {
    id: 43,
    fullName: "Sr. Néstor Chela & Sra.",
    customNote: NOTA_AMIGOS
  },
  {
    id: 44,
    fullName: "Sra. Martha Nazate & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 45,
    fullName: "Sr. Manuel Nazate & Sra.",
    customNote: NOTA_FAMILIA
  },
  {
    id: 46,
    fullName: "Sr. David Suárez & Familia",
    customNote: NOTA_AMIGOS
  },
  {
    id: 47,
    fullName: "Sr. Alfonso Altamirano & Sra.",
    customNote: NOTA_AMIGOS
  },
  {
    id: 48,
    fullName: "Sr. José Frías & Familia",
    customNote: NOTA_AMIGOS
  },
  {
    id: 49,
    fullName: "Sra. Verónica Frías & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 50,
    fullName: "Sr. Jorge Nazate & Sra.",
    customNote: NOTA_FAMILIA
  },
  {
    id: 51,
    fullName: "Sra. Katherine Nazate & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 52,
    fullName: "Sr. David Nazate & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 53,
    fullName: "Sr. Diego Nazate",
    customNote: NOTA_FAMILIA
  },
  {
    id: 54,
    fullName: "Sr. Henry Frías",
    customNote: NOTA_FAMILIA
  },
  {
    id: 55,
    fullName: "Sr. Rodolfo Frías",
    customNote: NOTA_FAMILIA
  },
  {
    id: 56,
    fullName: "Sr. Freddy Buesaquillo & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 57,
    fullName: "Sr. Javier Naranjo",
    customNote: NOTA_AMIGOS
  },
  {
    id: 58,
    fullName: "Sr. Miltón Hernández & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 59,
    fullName: "Sr. Gustavo Jarrín & Familia",
    customNote: NOTA_AMIGOS
  },
  {
    id: 60,
    fullName: "Sra. Andrea Nazate & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 61,
    fullName: "Sra. Lupe Nazate & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 62,
    fullName: "Sra. Fernanda Granizo",
    customNote: NOTA_AMIGOS
  },
  {
    id: 63,
    fullName: "Sra María José Proaño & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 64,
    fullName: "Sr. Paul Proaño & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 65,
    fullName: "Sr. Ricardo Proaño",
    customNote: NOTA_FAMILIA
  },
  {
    id: 66,
    fullName: "Sr. Cesar Proaño & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 67,
    fullName: "Sr. Christopher Richardson & Familia",
    customNote: NOTA_HERMANOS
  },
  {
    id: 68,
    fullName: "Sr. Walter Delgado & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 69,
    fullName: "Sr. Renato Cardenas ",
    customNote: NOTA_AMIGOS
  },
  {
    id: 70,
    fullName: "Sra. Nancy Proaño & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 71,
    fullName: "Sra. Nancy Proaño & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 72,
    fullName: "Sr. Christian Zambrano",
    customNote: NOTA_AMIGOS
  },
  {
    id: 73,
    fullName: "Sr.Jhon Narvàez & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 74,
    fullName: "Sr Anibal Canacuán & Familia",
    customNote: NOTA_FAMILIA
  },
  {
    id: 75,
    fullName: "Sr. Medardo Nazate & Familia",
    customNote: NOTA_FAMILIA
  }
];
