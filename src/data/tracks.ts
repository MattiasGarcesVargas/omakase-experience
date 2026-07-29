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
  gallery: { label: string; caption: string }[];
};

export const tracks: Track[] = [
  {
    slug: "pienso-en-ti",
    title: "PIENSO EN TI.",
    order: "05 / 16",
    phase: "EL SAZON",
    mood: "calor / memoria / cambio de ritmo",
    image: "/images/tracks/pienso-en-ti/PiensoEnTi.png",
    placeholder: "PIENSO EN TI IMAGE",
    shortDescription: "Un recuerdo que vuelve en calor, movimiento y una luz que no termina de apagarse.",
    interpretation:
      "Una canción que cambia de forma como un recuerdo cuando vuelve de noche. La cumbia, el reggaeton y la nostalgia no compiten: se sirven juntos. Esta pieza imagina una mesa despues de la fiesta, vasos a medio terminar y el impulso de pensar en alguien aunque ya sepas que no ayuda.",
    gallery: [
      { label: "01", caption: "luz calida sobre una mesa" },
      { label: "02", caption: "baile lento / memoria activa" },
      { label: "03", caption: "un plato que cambia de sabor" },
    ],
  },
  {
    slug: "en-la-misma-ciudad",
    title: "EN LA MISMA CIUDAD.",
    order: "08 / 16",
    phase: "EL SAZON",
    mood: "ciudad / distancia / urgencia",
    image: "/images/tracks/en-la-misma-ciudad/EnLaMismaCiudad.png",
    placeholder: "CITY IMAGE",
    shortDescription: "Dos personas en la misma ciudad, pero en coordenadas emocionales distintas.",
    interpretation:
      "La ciudad hace que todo parezca cercano: las mismas calles, luces y ventanas. Pero tambien puede volver imposible el encuentro. Esta pagina piensa la cancion como un recorrido nocturno entre mensajes sin enviar, reflejos rojos sobre el carro y una distancia que no se mide en kilometros.",
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
