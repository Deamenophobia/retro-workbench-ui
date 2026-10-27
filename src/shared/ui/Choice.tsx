import { useId, type InputHTMLAttributes, type ReactNode } from "react";

type ChoiceProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children" | "onChange" | "role"
> & {
  label: string;
  description?: string;
  onCheckedChange?: (checked: boolean) => void;
};

function Choice({
  kind,
  label,
  description,
  onCheckedChange,
  id: suppliedId,
  className = "",
  ...props
}: ChoiceProps & { kind: "checkbox" | "switch" }) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const describedBy = [props["aria-describedby"], description ? `${id}-help` : undefined]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={`choice choice-${kind} ${className}`}>
      <input
        {...props}
        id={id}
        type="checkbox"
        role={kind === "switch" ? "switch" : undefined}
        aria-describedby={describedBy || undefined}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
      />
      <div>
        <label htmlFor={id}>{label}</label>
        {description && (
          <p id={`${id}-help`} className="field-help">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function Checkbox(props: ChoiceProps) {
  return <Choice {...props} kind="checkbox" />;
}
export function Switch(props: ChoiceProps) {
  return <Choice {...props} kind="switch" />;
}

export function RadioGroup<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
  disabled,
  description,
}: {
  label: string;
  name?: string;
  value: T;
  options: readonly { value: T; label: string; disabled?: boolean }[];
  onChange: (value: T) => void;
  disabled?: boolean;
  description?: ReactNode;
}) {
  const id = useId();
  return (
    <fieldset
      className="radio-group"
      disabled={disabled}
      aria-describedby={description ? `${id}-help` : undefined}
    >
      <legend>{label}</legend>
      {description && (
        <p id={`${id}-help`} className="field-help">
          {description}
        </p>
      )}
      {options.map((option) => (
        <label key={option.value} className="radio-option">
          <input
            type="radio"
            name={name ?? id}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
