import { useId, type ReactNode } from "react";

export function Field({
  label,
  help,
  error,
  children,
}: {
  label: string;
  help?: string;
  error?: string;
  children: (props: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean;
  }) => ReactNode;
}) {
  const id = useId();
  const description = error ?? help;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        "aria-describedby": description ? `${id}-help` : undefined,
        "aria-invalid": Boolean(error),
      })}
      {description && (
        <p id={`${id}-help`} className={error ? "field-error" : "field-help"}>
          {description}
        </p>
      )}
    </div>
  );
}
