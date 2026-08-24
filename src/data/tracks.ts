export type Track = {
  slug: "pienso-en-ti" | "en-la-misma-ciudad" | "inarow62" | "no-podemos-ser-amigos";
  title: string;
  order: string;
  phase: "EL SAZON" | "EL EMPLATADO";
  mood: string;
  image: string;
  placeholder: string;
  shortDescription: string;
  interpretation: string;
  meaningLines?: string[];
  gallery: { label: string; caption: string; image?: string; alt?: string }[];
};

export const tracks: Track[] = [
  {
    slug: "pienso-en-ti",
    title: "PIENSO EN TI.",
    order: "05 / 16",
    phase: "TRACK",
    mood: "cumbia / memoria / hermandad",
    image: "/images/tracks/pienso-en-ti/PiensoEnTi.png",
    placeholder: "PIENSO EN TI IMAGE",
    shortDescription: "Una cumbia de Álvaro Díaz para Milkman: memoria, hermandad y un homenaje que sigue en movimiento.",
    interpretation:
      "PIENSO EN TI. transforma una pérdida profunda en movimiento. Álvaro Díaz recuerda a Milkman, amigo, hermano creativo y figura esencial desde sus inicios, a través de una cumbia que no busca cerrar la ausencia: la mantiene presente. El personaje que Milkman diseñó para el video lleva ese homenaje al plano visual.",
    meaningLines: [
      "Una cumbia para sostener una ausencia.",
      "Álvaro Díaz recuerda a Milkman: amigo, hermano y compañero desde el comienzo.",
      "El dolor no se queda quieto... cambia de ritmo, vuelve, acompaña.",
      "El personaje que Milkman diseñó para el video conserva una parte de su mundo.",
      "PIENSO EN TI, es memoria en movimiento, un homenaje que sigue presente.",
    ],
    gallery: [
      { label: "01", caption: "en memoria a 'Milkman'", image: "/images/tracks/pienso-en-ti/pienso_en_ti_mov.jpg", alt: "Personaje del video de Pienso en ti junto a una mesa" },
      { label: "02", caption: "Alvaro Diaz recuerdo", image: "/images/tracks/pienso-en-ti/alvarodiaz_pienso.jpg", alt: "Fotografia de Alvaro Diaz" },
      { label: "03", caption: "tributo que sigue presente", image: "/images/tracks/pienso-en-ti/tributo_milk.jpeg", alt: "Personaje creado por Milkman como tributo" },
    ],
  },
  {
    slug: "en-la-misma-ciudad",
    title: "EN LA MISMA CIUDAD.",
    order: "08 / 16",
    phase: "TRACK",
    mood: "ansiedad / distancia / ciudad vacia",
    image: "/images/tracks/en-la-misma-ciudad/EnLaMismaCiudad.png",
    placeholder: "CITY IMAGE",
    shortDescription: "Alvaro Diaz y Jesse Baez recorren una ciudad enorme mientras la distancia emocional vuelve todo vacio.",
    interpretation:
      "EN LA MISMA CIUDAD. convierte la cercania fisica en una forma de ansiedad. Alvaro Diaz y Jesse Baez persiguen a alguien que sigue cerca, pero ya no responde igual. El beat acelera mientras la ciudad se llena de luces, llamadas sin contestar y gente que no logra ocupar la ausencia. Escapar de los pensamientos parece posible por un momento, pero nunca suficiente.",
    meaningLines: [
      "La cercania fisica tambien puede sentirse como distancia.",
      "Siguen cerca, pero ya no responde igual.",
      "El beat acelera entre luces y llamadas sin contestar.",
      "La ciudad se llena de gente, pero no ocupa la ausencia.",
      "Escapar de los pensamientos nunca es suficiente.",
    ],
    gallery: [
      { label: "01", caption: "ventanas encendidas" },
      { label: "02", caption: "lluvia sobre el parabrisas" },
      { label: "03", caption: "la misma ciudad / otra vida" },
    ],
  },
  {
    slug: "inarow62",
    title: "INAROW62.",
    order: "13 / 16",
    phase: "EL EMPLATADO",
    mood: "intimidad / promesa / aire",
    image: "/images/tracks/inarow62/Inarow62..png",
    placeholder: "INAROW62 IMAGE",
    shortDescription: "Una pieza de cercania: quedarse cuando el ruido exterior pierde importancia.",
    interpretation:
      "En el emplatado, todo lo que paso antes encuentra su forma final. INAROW62. se siente como ese momento de calma despues de mucho movimiento: una habitacion en penumbra, una promesa sin necesidad de explicarse y el espacio para simplemente acompañar.",
    gallery: [
      { label: "01", caption: "una habitacion con luz baja" },
      { label: "02", caption: "silencio compartido" },
      { label: "03", caption: "el plato final antes de servir" },
    ],
  },
  {
    slug: "no-podemos-ser-amigos",
    title: "NO PODEMOS SER AMIGOS.",
    order: "14 / 16",
    phase: "EL EMPLATADO",
    mood: "despedida / tension / espacio negativo",
    image: "/images/tracks/no-podemos-ser-amigos/NoPodemosSerAmigos.png",
    placeholder: "FAREWELL IMAGE",
    shortDescription: "Cuando todavia existe un vinculo, pero ya no cabe en el lugar que tenia antes.",
    interpretation:
      "Hay despedidas que no son limpias. Todavia quedan objetos, costumbres y frases que no se sabe donde poner. Esta cancion se interpreta como una mesa vacia despues de la ultima cena: elegante, fria y llena de todo lo que no se dijo.",
    gallery: [
      { label: "01", caption: "una silla sin ocupar" },
      { label: "02", caption: "foto doblada / mensaje final" },
      { label: "03", caption: "lo que queda despues" },
    ],
  },
];
