/** Permite abrir el chat en vivo desde cualquier parte de la app. */
const EVENT = "livechat:open";

export function openLiveChat(): void {
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onOpenLiveChat(handler: () => void): () => void {
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
