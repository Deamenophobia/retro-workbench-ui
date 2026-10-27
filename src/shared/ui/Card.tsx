import { useId, type ReactNode } from "react";

export type CardProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  media?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

/** Compose content and actions without making the entire surface interactive. */
export function Card({ title, description, actions, media, footer, children }: CardProps) {
  const id = useId();
  return (
    <section className="panel card" aria-labelledby={id}>
      {media && <div className="card-media">{media}</div>}
      <header className="panel-heading">
        <div className="card-heading-copy">
          <h2 id={id}>{title}</h2>
          {description && <p className="muted">{description}</p>}
        </div>
        {actions && <div className="card-actions">{actions}</div>}
      </header>
      <div className="panel-body">{children}</div>
      {footer && <footer className="card-footer">{footer}</footer>}
    </section>
  );
}
