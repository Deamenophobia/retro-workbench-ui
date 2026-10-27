import { useId } from "react";
import { Button } from "./Button";

export function Skeleton({ lines = 3 }: { lines?: number }) {
  const count = Number.isFinite(lines) ? Math.max(1, Math.min(20, Math.floor(lines))) : 3;
  return (
    <div className="skeleton" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

export function Progress({
  label,
  value,
  max = 100,
}: {
  label: string;
  value?: number;
  max?: number;
}) {
  const id = useId();
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current =
    value === undefined || !Number.isFinite(value)
      ? undefined
      : Math.max(0, Math.min(value, limit));
  return (
    <div className="progress-field">
      <label id={`${id}-label`} htmlFor={id}>
        {label}
      </label>
      <progress id={id} aria-labelledby={`${id}-label`} max={limit} value={current} />
      <span className="muted">
        {current === undefined ? "In progress…" : `${Math.round((current / limit) * 100)}%`}
      </span>
    </div>
  );
}

export type ToastMessage = { id: string; text: string; tone?: "info" | "success" | "error" };

/** Always mounted live region; the feature owns messages, actions, and lifetime. */
export function Toast({
  message,
  onDismiss,
}: {
  message: ToastMessage | null;
  onDismiss: () => void;
}) {
  return (
    <aside className="toast-region" aria-label="Notifications">
      <div className="sr-only" role="status" aria-atomic="true">
        {message && message.tone !== "error" && <span key={message.id}>{message.text}</span>}
      </div>
      <div className="sr-only" role="alert" aria-atomic="true">
        {message?.tone === "error" && <span key={message.id}>{message.text}</span>}
      </div>
      {message && (
        <div className={`toast notice-${message.tone ?? "info"}`}>
          <p aria-hidden="true">{message.text}</p>
          <Button onClick={onDismiss} aria-label="Dismiss notification">
            Dismiss
          </Button>
        </div>
      )}
    </aside>
  );
}
