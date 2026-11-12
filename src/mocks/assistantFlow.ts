/**
 * Conversación 100 % simulada del asistente virtual (sin backend ni IA).
 * Cada nodo es una respuesta del bot y las opciones apuntan a otros nodos.
 */
export interface AssistantContext {
  name: string;
  hotel: string;
  hotelCode: string;
  destination: string;
  bookingId: string;
}

export interface CaseCard {
  title: string;
  rows: Array<[string, string]>;
}

export interface BotReply {
  paragraphs: string[];
  list?: { ordered?: boolean; items: string[] };
  card?: CaseCard;
  note?: string;
  options: AssistantOptionId[];
}

export type AssistantNodeId =
  | "welcome"
  | "menu"
  | "medical"
  | "medical-mild"
  | "medical-urgent"
  | "luggage"
  | "luggage-lost"
  | "luggage-damaged"
  | "hotel"
  | "hotel-room"
  | "hotel-booking"
  | "hotel-service"
  | "fallback";

export type AssistantOptionId = Exclude<AssistantNodeId, "welcome" | "fallback">;

export const OPTION_LABELS: Record<AssistantOptionId, string> = {
  menu: "Tengo otra consulta",
  medical: "Evaluación médica inicial de los pasajeros",
  "medical-mild": "Síntomas leves",
  "medical-urgent": "Es una urgencia",
  luggage: "Pérdida de equipaje",
  "luggage-lost": "No llegó a la cinta",
  "luggage-damaged": "Llegó dañado",
  hotel: "Problema con el hotel",
  "hotel-room": "La habitación no es la reservada",
  "hotel-booking": "No encuentran mi reserva",
  "hotel-service": "Limpieza o ruidos",
};

const MAIN: AssistantOptionId[] = ["medical", "luggage", "hotel"];

const caseId = (prefix: string, ctx: AssistantContext) =>
  `${prefix}-${ctx.bookingId.slice(-4)}${new Date().getMinutes().toString().padStart(2, "0")}`;

export function getReply(id: AssistantNodeId, ctx: AssistantContext): BotReply {
  switch (id) {
    case "welcome":
      return {
        paragraphs: [
          `¡Hola, ${ctx.name}! Soy el asistente virtual de MundoGlobal.`,
          `Veo que tenés un viaje a ${ctx.destination}. ¿En qué te puedo ayudar?`,
        ],
        options: MAIN,
      };
    case "menu":
      return { paragraphs: ["Claro, ¿sobre qué tema es tu consulta?"], options: MAIN };
    case "medical":
      return {
        paragraphs: [
          "Vamos a hacer una evaluación médica inicial. Tu plan MundoGlobal Plus cubre la atención sin costo.",
          "¿Cómo describirías la situación?",
        ],
        options: ["medical-mild", "medical-urgent"],
      };
    case "medical-mild":
      return {
        paragraphs: ["Registré la evaluación inicial. Un médico de la red va a visitarte en el hotel."],
        card: {
          title: "Evaluación médica registrada",
          rows: [
            ["Caso", caseId("MED", ctx)],
            ["Visita", `${ctx.hotel}`],
            ["Llegada estimada", "60 – 90 min"],
            ["Costo", "Cubierto por tu plan"],
          ],
        },
        list: {
          items: [
            "Tené a mano el pasaporte de quien tiene síntomas.",
            "Mantenete hidratado y evitá automedicarte.",
            "Si los síntomas empeoran, escribinos “urgencia”.",
          ],
        },
        options: ["medical-urgent", "menu"],
      };
    case "medical-urgent":
      return {
        paragraphs: [
          "Si hay riesgo de vida, llamá ya al número de emergencias local: 911.",
          "En paralelo, la central médica 24/7 ya tiene tu caso con prioridad alta y te va a llamar en menos de 5 minutos.",
        ],
        card: {
          title: "Derivación prioritaria",
          rows: [
            ["Caso", caseId("URG", ctx)],
            ["Central 24/7", "+54 11 5555-0100"],
            ["Centro médico más cercano", "2,1 km del hotel"],
          ],
        },
        note: "Número de demostración: este prototipo no realiza llamadas reales.",
        options: ["menu"],
      };
    case "luggage":
      return {
        paragraphs: ["Lamento lo de tu equipaje. ¿Qué pasó exactamente?"],
        options: ["luggage-lost", "luggage-damaged"],
      };
    case "luggage-lost":
      return {
        paragraphs: ["Seguí estos pasos antes de salir del aeropuerto:"],
        list: {
          ordered: true,
          items: [
            "Andá al mostrador de equipajes de la aerolínea y pedí el formulario PIR.",
            "Guardá el número de referencia que te entregan.",
            "Conservá los tickets de lo que compres mientras tanto.",
          ],
        },
        card: {
          title: "Cobertura de equipaje",
          rows: [
            ["Caso", caseId("EQ", ctx)],
            ["Pérdida total", "hasta USD 1.200"],
            ["Gastos de primera necesidad", "hasta USD 150"],
          ],
        },
        options: ["menu"],
      };
    case "luggage-damaged":
      return {
        paragraphs: [
          "Sacale fotos al daño antes de retirarte y pedí el formulario PIR en el mostrador de la aerolínea.",
          "Con esas fotos y el número de referencia gestionamos el reintegro desde acá.",
        ],
        card: {
          title: "Reclamo por daño",
          rows: [
            ["Caso", caseId("EQ", ctx)],
            ["Plazo para presentar", "7 días"],
          ],
        },
        options: ["menu"],
      };
    case "hotel":
      return {
        paragraphs: [`Vamos a resolverlo con ${ctx.hotel}. ¿Cuál es el problema?`],
        options: ["hotel-room", "hotel-booking", "hotel-service"],
      };
    case "hotel-room":
    case "hotel-booking":
    case "hotel-service":
      return {
        paragraphs: [
          `Ya avisamos al hotel con tu código ${ctx.hotelCode}.`,
          "Un asesor de MundoGlobal te va a escribir en los próximos 15 minutos para confirmar la solución.",
        ],
        card: {
          title: "Gestión con el hotel",
          rows: [
            ["Caso", caseId("HTL", ctx)],
            ["Motivo", OPTION_LABELS[id]],
            ["Estado", "En gestión"],
          ],
        },
        options: ["menu"],
      };
    case "fallback":
      return {
        paragraphs: [
          "Gracias por tu mensaje. Por ahora te puedo ayudar con estas consultas:",
        ],
        options: MAIN,
      };
  }
}

/** Tiempo de "escribiendo…" proporcional al largo de la respuesta. */
export function typingDelay(reply: BotReply): number {
  const chars = reply.paragraphs.join(" ").length;
  return Math.min(2200, 650 + chars * 9);
}
