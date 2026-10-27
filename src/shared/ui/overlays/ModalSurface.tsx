import { useId, useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { Button } from "../Button";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  initialFocus?: RefObject<HTMLElement | null>;
  returnFocus?: RefObject<HTMLElement | null>;
};

export function ModalSurface({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  initialFocus,
  returnFocus,
  placement,
}: ModalProps & { placement: "center" | "end" }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const opener = returnFocus?.current ?? dialog.ownerDocument.activeElement;
    dialog.showModal();
    initialFocus?.current?.focus();
    return () => {
      dialog.close();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, [open, initialFocus, returnFocus]);
  return (
    <dialog
      ref={ref}
      className={`modal-surface modal-${placement}`}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={(event) => {
        if (open && !event.currentTarget.open) onClose();
      }}
    >
      <header className="modal-heading">
        <h2 id={`${id}-title`}>{title}</h2>
        <Button aria-label={`Close ${title}`} onClick={onClose}>
          Close
        </Button>
      </header>
      <div className="modal-body">
        {description && (
          <p id={`${id}-description`} className="muted">
            {description}
          </p>
        )}
        {children}
      </div>
      {actions && <footer className="modal-actions">{actions}</footer>}
    </dialog>
  );
}
