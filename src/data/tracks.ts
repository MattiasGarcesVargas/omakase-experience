export type Track = {
  slug: "pienso-en-ti" | "en-la-misma-ciudad" | "inarow62" | "no-podemos-ser-amigos";
  title: string;
  order: string;
  phase: "TRACK" | "EL SAZON" | "EL EMPLATADO";
  mood: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  placeholder: string;
  shortDescription: string;
  interpretation: string;
  meaningLines?: string[];
  gallery: { label: string; caption: string; image?: string; alt?: string; width?: number; height?: number }[];
};

export const tracks: Track[] = [
  {
    slug: "pienso-en-ti",
    title: "PIENSO EN TI.",
    order: "05 / 16",
    phase: "TRACK",
    mood: "cumbia / memoria / hermandad",
    image: "/images/tracks/pienso-en-ti/PiensoEnTi.png",
    imageWidth: 1254,
    imageHeight: 1254,
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
      { label: "01", caption: "en memoria a 'Milkman'", image: "/images/tracks/pienso-en-ti/pienso_en_ti_mov.jpg", alt: "Personaje del video de Pienso en ti junto a una mesa", width: 405, height: 720 },
      { label: "02", caption: "Alvaro Diaz recuerdo", image: "/images/tracks/pienso-en-ti/alvarodiaz_pienso.jpg", alt: "Fotografia de Alvaro Diaz", width: 1000, height: 1000 },
      { label: "03", caption: "tributo que sigue presente", image: "/images/tracks/pienso-en-ti/tributo_milk.jpeg", alt: "Personaje creado por Milkman como tributo", width: 417, height: 479 },
    ],
  },
  {
    slug: "en-la-misma-ciudad",
    title: "EN LA MISMA CIUDAD.",
    order: "08 / 16",
    phase: "TRACK",
    mood: "ansiedad / distancia / ciudad vacia",
    image: "/images/tracks/en-la-misma-ciudad/EnLaMismaCiudad.png",
    imageWidth: 1254,
    imageHeight: 1254,
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
    phase: "TRACK",
    mood: "hogar / tiempo / cercanía",
    image: "/images/tracks/inarow62/Inarow62..png",
    imageWidth: 1254,
    imageHeight: 1254,
    placeholder: "INAROW62 IMAGE",
    shortDescription: "Una pieza de cercania: quedarse cuando el ruido exterior pierde importancia.",
    interpretation:
      "En el emplatado, todo lo que paso antes encuentra su forma final. INAROW62. se siente como ese momento de calma despues de mucho movimiento: una habitacion en penumbra, una promesa sin necesidad de explicarse y el espacio para simplemente acompañar.",
    meaningLines: [
      "Llego cuando mas roto estabas.",
      "No encontro perfeccion. Encontro a alguien intentando volver a creer.",
      "Mientras todos se iban, decidio quedarse.",
      "Su presencia empezo a sentirse como hogar.",
      "No hacian falta promesas. Solo un ratito mas para volver a creer en el amor.",
    ],
    gallery: [
      { label: "01", caption: "llego y se quedo", image: "/images/tracks/inarow62/atardecer.jpeg", alt: "Dos personas compartiendo un atardecer", width: 300, height: 300 },
      { label: "02", caption: "presencia que se vuelve hogar", image: "/images/tracks/inarow62/snopy.jpeg", alt: "Snoopy abrazado", width: 387, height: 516 },
      { label: "03", caption: "volver a creer", image: "/images/tracks/inarow62/alvaro-album.jpg", alt: "Alvaro Diaz junto a un album", width: 735, height: 725 },
    ],
  },
  {
    slug: "no-podemos-ser-amigos",
    title: "NO PODEMOS SER AMIGOS.",
    order: "14 / 16",
    phase: "EL EMPLATADO",
    mood: "despedida / tension / espacio negativo",
    image: "/images/tracks/no-podemos-ser-amigos/NoPodemosSerAmigos.png",
    imageWidth: 1254,
    imageHeight: 1254,
    placeholder: "FAREWELL IMAGE",
    shortDescription: "Cuando todavia existe un vinculo, pero ya no cabe en el lugar que tenia antes.",
    interpretation:
      "Hay despedidas que no son limpias. Todavia quedan objetos, costumbres y frases que no se sabe donde poner. Esta cancion se interpreta como una mesa vacia despues de la ultima cena: elegante, fria y llena de todo lo que no se dijo.",
    meaningLines: [
      "Quedar como amigos es la mentira mas facil que podemos decirnos cuando todavia nos queremos.",
      "No te canto desde el rencor. Te canto desde la claridad: llamar amistad a lo que sientes es otra forma de no soltar.",
      "Hay personas con las que no puedes fingir normalidad. El corazon ya sabe demasiado.",
      "A veces 'podemos ser amigos' suena maduro, pero solo confirma que ninguno sabe que hacer con todo lo que todavia siente.",
      "No quiero recuperarte. Solo entendi que seguir cerca con otro nombre tambien seria mentirnos.",
    ],
    gallery: [
      { label: "01", caption: "tour", image: "/images/tracks/no-podemos-ser-amigos/tour.jpg", alt: "Alvaro Diaz sosteniendo un letrero OMAKASE durante un tour", width: 736, height: 1308 },
    ],
  },
];
