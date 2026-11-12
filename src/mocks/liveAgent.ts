import { imageUrl } from "./media";

/** Agente ficticio. Respuestas 100 % mock, con tono humano. */
export const AGENT = {
  name: "Lucía Fernández",
  shortName: "Lucía",
  role: "Atención al viajero",
  avatar: imageUrl("1580489944761-15a19d654956", 160),
};

export interface AgentContext {
  name: string;
  destination: string;
  departure: string;
  hotel: string;
  bookingId: string;
}

type Rule = { test: RegExp; reply: (ctx: AgentContext) => string[] };

const RULES: Rule[] = [
  {
    test: /gracias|genial|perfecto|buenísimo|joya/,
    reply: () => [
      "¡De nada! Para eso estamos 😊",
      "Cualquier cosa escribime por acá, estoy conectada hasta las 22 h.",
    ],
  },
  {
    test: /vuelo|demora|horario|embarque|puerta/,
    reply: () => [
      "Dejame chequear tu vuelo un segundo…",
      "Listo, el AR 1302 figura en horario por ahora. Si llega a cambiar algo te aviso por acá mismo, no te preocupes 🙌",
    ],
  },
  {
    test: /hotel|habitaci|check.?in|desayuno|all inclusive/,
    reply: (ctx) => [
      `Ahí lo veo: tu reserva en el ${ctx.hotel} está confirmada.`,
      "El check-in es desde las 15 h. Si querés le pido al hotel un early check-in. No te lo puedo prometer, pero suelen darlo 😉",
    ],
  },
  {
    test: /equipaje|valija|maleta|bolso/,
    reply: () => [
      "Uh, qué mal. ¿La valija no llegó o llegó dañada?",
      "Si todavía estás en el aeropuerto, pedí el formulario PIR en el mostrador de la aerolínea. Con ese número lo gestiono yo desde acá.",
    ],
  },
  {
    test: /cambi|fecha|cancel|modific/,
    reply: (ctx) => [
      `Sí, se puede. Tu reserva ${ctx.bookingId} permite cambios de fecha.`,
      "Pasame las fechas nuevas que te interesan y te cotizo la diferencia, si la hay.",
    ],
  },
  {
    test: /pago|factura|cuota|tarjeta|precio/,
    reply: () => [
      "Te paso la info de pagos enseguida.",
      "Tu reserva ya está paga en su totalidad ✅ Si necesitás la factura a otro nombre, decime los datos y la reemito.",
    ],
  },
  {
    test: /^(hola|buenas|buen día|buenas tardes|buenas noches)\b/,
    reply: (ctx) => [`¡Hola ${ctx.name}! ¿Cómo estás? Contame en qué te ayudo.`],
  },
];

const FALLBACKS: Array<(ctx: AgentContext) => string[]> = [
  () => ["Entiendo. Dame un minutito que lo reviso con el equipo y te confirmo."],
  (ctx) => [
    "Ok, perfecto.",
    `Ya lo dejé anotado en tu reserva ${ctx.bookingId}. Te escribo apenas tenga novedades 👌`,
  ],
  () => ["Mmm, buena pregunta. Lo consulto y vuelvo con vos enseguida."],
];

let fallbackIndex = 0;

export function greeting(ctx: AgentContext): string[] {
  return [
    `¡Hola ${ctx.name}! Soy Lucía, del equipo de atención al viajero 👋`,
    `Vi que viajás a ${ctx.destination} el ${ctx.departure}. ¿Te ayudo con algo?`,
  ];
}

export function agentReply(text: string, ctx: AgentContext): string[] {
  const normalized = text.toLowerCase().trim();
  const rule = RULES.find((r) => r.test.test(normalized));
  if (rule) return rule.reply(ctx);
  const fallback = FALLBACKS[fallbackIndex % FALLBACKS.length];
  fallbackIndex += 1;
  return fallback(ctx);
}

/** "Escribiendo…" variable: depende del largo y de un poco de azar. */
export function humanTypingMs(text: string): number {
  const base = 700 + text.length * 32;
  const jitter = Math.random() * 900;
  return Math.min(4200, base + jitter);
}
