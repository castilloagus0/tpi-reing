/**
 * Imágenes libres de derechos (Unsplash License) usadas como placeholders.
 * Se referencian por id de paquete/destino para no tocar el modelo de datos.
 */
export interface Media {
  src: string;
  /** Versión mediana para tarjetas. */
  medium: string;
  /** Versión chica para miniaturas. */
  thumb: string;
  alt: string;
}

const unsplash = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=70&auto=format&fit=crop`;

const photo = (id: string, alt: string): Media => ({
  src: unsplash(id),
  medium: unsplash(id, 720),
  thumb: unsplash(id, 320),
  alt,
});

const destinationImages: Record<string, Media> = {
  cancun: photo("1510097467424-192d713fd8b2", "Vista aérea de la zona hotelera de Cancún con mar turquesa"),
  roma: photo("1552832230-c0197dd311b5", "El Coliseo de Roma al atardecer"),
  paris: photo("1502602898657-3e91760cbb34", "La Torre Eiffel junto al río Sena al anochecer"),
  bariloche: photo("1501785888041-af3ef285b470", "Lago de aguas turquesas rodeado de montañas"),
  "punta-cana": photo("1590523741831-ab7e8b8f9c7f", "Playa caribeña con palmeras y arena blanca"),
  "nueva-york": photo("1485871981521-5b1fd3805eee", "Skyline de Nueva York al atardecer"),
  "buenos-aires": photo("1589909202802-8f4aadce1849", "Vista aérea del Obelisco de Buenos Aires"),
};

const hotelImages: Record<string, Media> = {
  cancun: photo("1520250497591-112f2f40a3f4", "Piscina del hotel rodeada de palmeras y camastros"),
  roma: photo("1571896349842-33c89424de2d", "Terraza y piscina del hotel al atardecer"),
  paris: photo("1535827841776-24afc1e255ac", "Patio interior del hotel con fuente y vegetación"),
  bariloche: photo("1566073771259-6a8506099945", "Lodge de madera con piscina y reposeras"),
  "punta-cana": photo("1582719508461-905c673771fd", "Deck de madera con reposeras frente a una piscina infinita"),
};

const fallback = destinationImages.cancun;

export const getDestinationImage = (id: string): Media =>
  destinationImages[id] ?? fallback;

export const getHotelImage = (id: string): Media =>
  hotelImages[id] ?? hotelImages.cancun;

export const imageUrl = unsplash;
