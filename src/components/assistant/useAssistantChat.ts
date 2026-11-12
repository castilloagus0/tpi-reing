import { useCallback, useEffect, useRef, useState } from "react";
import {
  getReply,
  OPTION_LABELS,
  typingDelay,
  type AssistantContext,
  type AssistantNodeId,
  type AssistantOptionId,
  type BotReply,
} from "../../mocks/assistantFlow";

export type ChatEntry =
  | { id: number; from: "bot"; reply: BotReply }
  | { id: number; from: "user"; text: string };

/** Máquina de estados mínima del chatbot simulado. */
export function useAssistantChat(context: AssistantContext) {
  const nextId = useRef(1);
  const timer = useRef<number | undefined>(undefined);
  const [entries, setEntries] = useState<ChatEntry[]>(() => [
    { id: 0, from: "bot", reply: getReply("welcome", context) },
  ]);
  const [typing, setTyping] = useState(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const respond = useCallback(
    (userText: string, node: AssistantNodeId) => {
      const reply = getReply(node, context);
      setEntries((all) => [...all, { id: nextId.current++, from: "user", text: userText }]);
      setTyping(true);
      timer.current = window.setTimeout(() => {
        setTyping(false);
        setEntries((all) => [...all, { id: nextId.current++, from: "bot", reply }]);
      }, typingDelay(reply));
    },
    [context],
  );

  const choose = useCallback(
    (option: AssistantOptionId) => respond(OPTION_LABELS[option], option),
    [respond],
  );

  const send = useCallback(
    (text: string) => {
      const normalized = text.toLowerCase();
      const node: AssistantNodeId = /urgen|emergen/.test(normalized)
        ? "medical-urgent"
        : /m[eé]dic|fiebre|dolor|enferm/.test(normalized)
          ? "medical"
          : /equipaje|valija|maleta/.test(normalized)
            ? "luggage"
            : /hotel|habitaci/.test(normalized)
              ? "hotel"
              : "fallback";
      respond(text, node);
    },
    [respond],
  );

  return { entries, typing, choose, send };
}
