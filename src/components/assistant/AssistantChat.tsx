import { ArrowUp, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { OPTION_LABELS, type AssistantContext, type BotReply } from "../../mocks/assistantFlow";
import { IconButton } from "../ui/IconButton";
import { useAssistantChat } from "./useAssistantChat";

function BotMessage({ reply }: { reply: BotReply }) {
  const List = reply.list?.ordered ? "ol" : "ul";
  return (
    <div className="bot-msg">
      <span className="bot-msg__avatar" aria-hidden="true">
        <Sparkles />
      </span>
      <div className="bot-msg__bubble">
        <span className="sr-only">Asistente:</span>
        {reply.paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
        {reply.card && (
          <div className="case-card">
            <p className="case-card__title">{reply.card.title}</p>
            <dl>
              {reply.card.rows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {reply.list && (
          <List className="bot-msg__list">
            {reply.list.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </List>
        )}
        {reply.note && <p className="bot-msg__note">{reply.note}</p>}
      </div>
    </div>
  );
}

export function AssistantChat({ context }: { context: AssistantContext }) {
  const { entries, typing, choose, send } = useAssistantChat(context);
  const [draft, setDraft] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const usedKeyboard = useRef(false);

  const last = entries[entries.length - 1];
  const optionsFor = !typing && last.from === "bot" ? last.id : -1;
  const options = last.from === "bot" && optionsFor >= 0 ? last.reply.options : [];

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    log.scrollTo({ top: log.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [entries.length, typing]);

  // Tras una respuesta, devolvemos el foco a las opciones nuevas
  // (solo si la persona venía usando las opciones con teclado/clic).
  useEffect(() => {
    if (optionsFor >= 0 && usedKeyboard.current) {
      optionsRef.current?.querySelector("button")?.focus({ preventScroll: true });
      usedKeyboard.current = false;
    }
  }, [optionsFor]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || typing) return;
    send(text);
    setDraft("");
  }

  return (
    <section className="assistant" aria-labelledby="assistant-title">
      <header className="assistant__header">
        <span className="assistant__logo" aria-hidden="true">
          <Sparkles />
        </span>
        <div>
          <h2 id="assistant-title" className="assistant__title">
            Asistente de viaje
          </h2>
          <p className="assistant__subtitle">Asistente virtual · responde al instante</p>
        </div>
      </header>

      <div
        ref={logRef}
        className="assistant__log"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Conversación con el asistente"
        tabIndex={0}
      >
        {entries.map((entry) =>
          entry.from === "bot" ? (
            <BotMessage key={entry.id} reply={entry.reply} />
          ) : (
            <div key={entry.id} className="user-msg">
              <span className="sr-only">Vos:</span>
              {entry.text}
            </div>
          ),
        )}
        {typing && (
          <div className="bot-msg bot-msg--typing">
            <span className="bot-msg__avatar" aria-hidden="true">
              <Sparkles />
            </span>
            <div className="bot-msg__bubble">
              <span className="typing" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="sr-only">El asistente está escribiendo…</span>
            </div>
          </div>
        )}
      </div>

      <div className="assistant__footer">
        {options.length > 0 && (
          <div
            ref={optionsRef}
            className="quick-replies"
            role="group"
            aria-label="Opciones rápidas"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className="quick-reply"
                onClick={(event) => {
                  // detail === 0 → activado con teclado (Enter/Espacio).
                  usedKeyboard.current = event.detail === 0;
                  choose(option);
                }}
              >
                {OPTION_LABELS[option]}
              </button>
            ))}
          </div>
        )}
        <form className="assistant__form" onSubmit={submit}>
          <label htmlFor="assistant-input" className="sr-only">
            Escribí tu consulta
          </label>
          <input
            id="assistant-input"
            className="control assistant__input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Escribí tu consulta…"
            autoComplete="off"
          />
          <IconButton
            type="submit"
            variant="primary"
            label="Enviar mensaje"
            icon={<ArrowUp />}
            disabled={!draft.trim() || typing}
          />
        </form>
      </div>
    </section>
  );
}
