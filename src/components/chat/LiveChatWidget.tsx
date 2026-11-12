import { Check, CheckCheck, ChevronDown, MessageCircle, SendHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { AGENT, type AgentContext } from "../../mocks/liveAgent";
import { useTravel } from "../../services/TravelStore";
import { cx } from "../../utils/cx";
import { formatTime } from "../../utils/formatDate";
import { onOpenLiveChat } from "../../utils/liveChat";
import { Avatar } from "../ui/Avatar";
import { IconButton } from "../ui/IconButton";
import { useLiveChat, type DeliveryStatus } from "./useLiveChat";

const STATUS_LABEL: Record<DeliveryStatus, string> = {
  sent: "Enviado",
  delivered: "Entregado",
  read: "Leído",
};

function Ticks({ status }: { status: DeliveryStatus }) {
  const Icon = status === "sent" ? Check : CheckCheck;
  return (
    <span className={cx("ticks", status === "read" && "ticks--read")} title={STATUS_LABEL[status]}>
      <Icon aria-hidden="true" />
      <span className="sr-only">{STATUS_LABEL[status]}</span>
    </span>
  );
}

export function LiveChatWidget({ hideLauncher = false }: { hideLauncher?: boolean }) {
  const { bookings } = useTravel();
  const booking = bookings[0];
  const context = useMemo<AgentContext>(
    () => ({
      name: booking?.travellers[0]?.name ?? "",
      destination: booking?.package.destination ?? "tu destino",
      departure: booking
        ? new Date(`${booking.criteria.departure}T12:00`).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "numeric",
          })
        : "",
      hotel: booking?.package.hotel ?? "hotel",
      bookingId: booking?.id ?? "",
    }),
    [booking],
  );

  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [draft, setDraft] = useState("");
  const { messages, typing, unread, send, greet, markRead } = useLiveChat(context, open);
  const titleId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Saludo proactivo a los pocos segundos, como haría una persona.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      greet();
      setTeaser(true);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [greet]);

  const openChat = useCallback(() => {
    setOpen(true);
    setTeaser(false);
    markRead();
    greet();
  }, [greet, markRead]);

  useEffect(() => onOpenLiveChat(openChat), [openChat]);

  // El aviso proactivo se oculta solo para no tapar contenido.
  useEffect(() => {
    if (!teaser) return;
    const timer = window.setTimeout(() => setTeaser(false), 8000);
    return () => window.clearTimeout(timer);
  }, [teaser]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, greet]);

  useEffect(() => {
    const log = logRef.current;
    if (!log || !open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    log.scrollTo({ top: log.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, typing, open]);

  // Al cerrar, el foco vuelve al botón flotante.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) launcherRef.current?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);

  const close = () => setOpen(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    send(text);
    setDraft("");
  }

  const lastAgent = [...messages].reverse().find((m) => m.from === "agent");

  return (
    <>
      {!open && !hideLauncher && (
        <div className="lc-launcher-wrap">
          {teaser && lastAgent && (
            <div className="lc-teaser" role="status">
              <button
                type="button"
                className="lc-teaser__body"
                onClick={openChat}
              >
                <strong>{AGENT.shortName}</strong>
                <span>{lastAgent.text}</span>
              </button>
              <IconButton
                size="sm"
                label="Descartar mensaje"
                icon={<X />}
                onClick={() => setTeaser(false)}
              />
            </div>
          )}
          <button
            ref={launcherRef}
            type="button"
            className="lc-launcher"
            aria-label={`Chatear con ${AGENT.shortName}, ${AGENT.role}${unread ? `. ${unread} mensajes sin leer` : ""}`}
            aria-expanded={open}
            onClick={openChat}
          >
            <MessageCircle aria-hidden="true" />
            <Avatar name={AGENT.name} src={AGENT.avatar} size="sm" online className="lc-launcher__avatar" />
            {unread > 0 && (
              <span className="lc-launcher__badge" aria-hidden="true">
                {unread}
              </span>
            )}
          </button>
        </div>
      )}

      {open && (
        <section className="lc-panel" role="dialog" aria-modal="false" aria-labelledby={titleId}>
          <div className="lc-panel__header">
            <Avatar name={AGENT.name} src={AGENT.avatar} online />
            <div className="lc-panel__who">
              <h2 id={titleId} className="lc-panel__name">
                {AGENT.name}
              </h2>
              <p className="lc-panel__status">
                {typing ? <em>escribiendo…</em> : `${AGENT.role} · En línea`}
              </p>
            </div>
            <IconButton label="Minimizar chat" icon={<ChevronDown />} onClick={close} />
          </div>

          <div
            ref={logRef}
            className="lc-panel__log"
            role="log"
            aria-live="polite"
            aria-label={`Conversación con ${AGENT.shortName}`}
            tabIndex={0}
          >
            <p className="lc-day">Hoy</p>
            {messages.map((m) =>
              m.from === "system" ? (
                <p key={m.id} className="lc-system">
                  {m.text} · {formatTime(m.at)}
                </p>
              ) : (
                <div key={m.id} className={cx("lc-msg", m.from === "me" ? "lc-msg--out" : "lc-msg--in")}>
                  <span className="sr-only">{m.from === "me" ? "Vos:" : `${AGENT.shortName}:`}</span>
                  <span className="lc-msg__text">{m.text}</span>
                  <span className="lc-msg__meta">
                    <time dateTime={m.at.toISOString()}>{formatTime(m.at)}</time>
                    {m.from === "me" && <Ticks status={m.status} />}
                  </span>
                </div>
              ),
            )}
            {typing && (
              <div className="lc-msg lc-msg--in lc-msg--typing">
                <span className="typing" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="sr-only">{AGENT.shortName} está escribiendo…</span>
              </div>
            )}
          </div>

          <form className="lc-panel__form" onSubmit={submit}>
            <label htmlFor="lc-input" className="sr-only">
              Mensaje para {AGENT.shortName}
            </label>
            <input
              ref={inputRef}
              id="lc-input"
              className="lc-panel__input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Escribí un mensaje"
              autoComplete="off"
            />
            <IconButton
              type="submit"
              label="Enviar"
              icon={<SendHorizontal />}
              className="lc-panel__send"
              disabled={!draft.trim()}
            />
          </form>
        </section>
      )}
    </>
  );
}
