import { useCallback, useEffect, useRef, useState } from "react";
import {
  AGENT,
  agentReply,
  greeting,
  humanTypingMs,
  type AgentContext,
} from "../../mocks/liveAgent";

export type DeliveryStatus = "sent" | "delivered" | "read";

export type LiveMessage =
  | { id: number; from: "me"; text: string; at: Date; status: DeliveryStatus }
  | { id: number; from: "agent"; text: string; at: Date }
  | { id: number; from: "system"; text: string; at: Date };

type NewMessage = LiveMessage extends infer M
  ? M extends LiveMessage
    ? Omit<M, "id">
    : never
  : never;

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/**
 * Simula a una persona real: confirma entrega, "lee" el mensaje,
 * escribe con tiempos variables y a veces responde en dos mensajes.
 */
export function useLiveChat(context: AgentContext, open: boolean) {
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const nextId = useRef(1);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const alive = useRef(true);
  const openRef = useRef(open);
  const greeted = useRef(false);
  /** Si la persona escribe durante el saludo, el resto del saludo se omite. */
  const greetingInterrupted = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const markRead = useCallback(() => setUnread(0), []);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const push = useCallback((message: NewMessage) => {
    const id = nextId.current++;
    setMessages((all) => [...all, { ...message, id } as LiveMessage]);
    if (message.from === "agent" && !openRef.current) setUnread((n) => n + 1);
    return id;
  }, []);

  const typeOut = useCallback(
    async (parts: string[], interruptible = false) => {
      for (const [index, part] of parts.entries()) {
        if (index > 0) await sleep(500 + Math.random() * 700);
        if (!alive.current || (interruptible && greetingInterrupted.current)) return;
        setTyping(true);
        await sleep(humanTypingMs(part));
        if (!alive.current) return;
        setTyping(false);
        if (interruptible && greetingInterrupted.current) return;
        push({ from: "agent", text: part, at: new Date() });
      }
    },
    [push],
  );

  /** Mensaje proactivo de bienvenida (una sola vez). */
  const greet = useCallback(() => {
    if (greeted.current) return;
    greeted.current = true;
    push({ from: "system", text: `${AGENT.shortName} se unió a la conversación`, at: new Date() });
    queue.current = queue.current.then(() => typeOut(greeting(context), true));
  }, [context, push, typeOut]);

  const send = useCallback(
    (text: string) => {
      greetingInterrupted.current = true;
      const id = push({ from: "me", text, at: new Date(), status: "sent" });
      const setStatus = (status: DeliveryStatus) =>
        setMessages((all) =>
          all.map((m) =>
            m.from === "me" && (m.id === id || (status === "read" && m.status !== "read"))
              ? { ...m, status }
              : m,
          ),
        );

      queue.current = queue.current.then(async () => {
        await sleep(350 + Math.random() * 300);
        if (!alive.current) return;
        setStatus("delivered");
        await sleep(700 + Math.random() * 1100);
        if (!alive.current) return;
        setStatus("read");
        await sleep(400 + Math.random() * 600);
        await typeOut(agentReply(text, context));
      });
    },
    [context, push, typeOut],
  );

  return { messages, typing, unread, send, greet, markRead };
}
