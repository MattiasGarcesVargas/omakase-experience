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
    title: "PIENSO EN TI",
    order: "05 / 16",
    phase: "TRACK",
    mood: "CUMBIA / MEMORIA / HERMANDAD",
    image: "/images/tracks/pienso-en-ti/PiensoEnTi.png",
    imageWidth: 1254,
    imageHeight: 1254,
    placeholder: "PIENSO EN TI IMAGE",
    shortDescription: "UNA CUMBIA DE ÁLVARO DÍAZ PARA MILKMAN: MEMORIA, HERMANDAD Y UN HOMENAJE QUE SIGUE EN MOVIMIENTO.",
    interpretation:
      "PIENSO EN TI TRANSFORMA UNA PÉRDIDA PROFUNDA EN MOVIMIENTO. ÁLVARO DÍAZ RECUERDA A MILKMAN, AMIGO, HERMANO CREATIVO Y FIGURA ESENCIAL DESDE SUS INICIOS, A TRAVÉS DE UNA CUMBIA QUE NO BUSCA CERRAR LA AUSENCIA: LA MANTIENE PRESENTE. EL PERSONAJE QUE MILKMAN DISEÑÓ PARA EL VIDEO LLEVA ESE HOMENAJE AL PLANO VISUAL.",
    meaningLines: [
      "UNA CUMBIA PARA SOSTENER UNA AUSENCIA.",
      "ÁLVARO DÍAZ RECUERDA A MILKMAN: AMIGO, HERMANO Y COMPAÑERO DESDE EL COMIENZO.",
      "EL DOLOR NO SE QUEDA QUIETO... CAMBIA DE RITMO, VUELVE, ACOMPAÑA.",
      "EL PERSONAJE QUE MILKMAN DISEÑÓ PARA EL VIDEO CONSERVA UNA PARTE DE SU MUNDO.",
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
    title: "EN LA MISMA CIUDAD",
    order: "08 / 16",
    phase: "TRACK",
    mood: "ansiedad / distancia / ciudad vacia",
    image: "/images/tracks/en-la-misma-ciudad/EnLaMismaCiudad.png",
    imageWidth: 1254,
    imageHeight: 1254,
    placeholder: "CITY IMAGE",
    shortDescription: "Alvaro Diaz y Jesse Baez recorren una ciudad enorme mientras la distancia emocional vuelve todo vacio.",
    interpretation:
      "EN LA MISMA CIUDAD convierte la cercania fisica en una forma de ansiedad. Alvaro Diaz y Jesse Baez persiguen a alguien que sigue cerca, pero ya no responde igual. El beat acelera mientras la ciudad se llena de luces, llamadas sin contestar y gente que no logra ocupar la ausencia. Escapar de los pensamientos parece posible por un momento, pero nunca suficiente.",
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
    mood: "HOGAR / TIEMPO / CERCANÍA",
    image: "/images/tracks/inarow62/Inarow62..png",
    imageWidth: 1254,
    imageHeight: 1254,
    placeholder: "INAROW62 IMAGE",
    shortDescription: "Una pieza de cercania: quedarse cuando el ruido exterior pierde importancia.",
    interpretation:
      "EN EL EMPLATADO, TODO LO QUE PASO ANTES ENCUENTRA SU FORMA FINAL. INAROW62. SE SIENTE COMO ESE MOMENTO DE CALMA DESPUES DE MUCHO MOVIMIENTO: UNA HABITACION EN PENUMBRA, UNA PROMESA SIN NECESIDAD DE EXPLICARSE Y EL ESPACIO PARA SIMPLEMENTE ACOMPAÑAR.",
    meaningLines: [
      "Llego cuando mas roto estabas.",
      "No encontro perfeccion. Encontro a alguien intentando volver a creer.",
      "Mientras todos se iban, decidio quedarse.",
      "Su presencia empezo a sentirse como hogar.",
      "No hacian falta promesas. Solo un ratito mas para volver a creer en el amor.",
    ],
    gallery: [
      { label: "01", caption: "llego y se quedo", image: "/images/tracks/inarow62/anucement.jpeg", alt: "Anuncio", width: 300, height: 300 },
      { label: "02", caption: "presencia que se vuelve hogar", image: "/images/tracks/inarow62/show.jpeg", alt: "Shown en vivo", width: 387, height: 516 },
      { label: "03", caption: "volver a creer", image: "/images/tracks/inarow62/alvaro-album.jpg", alt: "Alvaro Diaz junto a un album", width: 735, height: 725 },
      { label: "04", caption: "grafiti", image: "/images/tracks/inarow62/grafiti.jpeg", alt: "Grafiti relacionado con INAROW62", width: 736, height: 920 },
      { label: "05", caption: "photo-album", image: "/images/tracks/inarow62/photo-album.jpeg", alt: "Foto de album de INAROW62", width: 736, height: 981 },
      { label: "06", caption: "ecuador", image: "/images/tracks/inarow62/ecuador.jpeg", alt: "Referencia de Ecuador en la galeria de INAROW62", width: 590, height: 332 },
      { label: "07", caption: "sold-out", image: "/images/tracks/inarow62/sold-out.jpeg", alt: "Imagen sold out de INAROW62", width: 720, height: 720 },
    ],
  },
  {
    slug: "no-podemos-ser-amigos",
    title: "NO PODEMOS SER AMIGOS",
    order: "14 / 16",
    phase: "EL EMPLATADO",
    mood: "despedida / espacio / tiempo",
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
