import { type InputHTMLAttributes } from "react";
import { Field } from "./Field";

type DateInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "defaultValue"
> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  error?: string;
};

/** ISO date-only strings; the browser owns the localized calendar and editing UI. */
export function DateInput({ label, value, onChange, help, error, ...props }: DateInputProps) {
  return (
    <Field label={label} {...(help ? { help } : {})} {...(error ? { error } : {})}>
      {(field) => (
        <input
          {...props}
          {...field}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  );
}

export type DateRangeValue = { start: string; end: string };

export function DateRange({
  label,
  value,
  onChange,
  min,
  max,
  disabled,
  error,
  startLabel = "Start date",
  endLabel = "End date",
}: {
  label: string;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  error?: string;
  startLabel?: string;
  endLabel?: string;
}) {
  const startMax = [max, value.end].filter(Boolean).sort().at(0);
  const endMin = [min, value.start].filter(Boolean).sort().at(-1);
  return (
    <fieldset className="date-range" disabled={disabled}>
      <legend>{label}</legend>
      <DateInput
        label={startLabel}
        value={value.start}
        min={min}
        max={startMax}
        onChange={(start) => onChange({ ...value, start })}
      />
      <DateInput
        label={endLabel}
        value={value.end}
        min={endMin}
        max={max}
        {...(error ? { error } : {})}
        onChange={(end) => onChange({ ...value, end })}
      />
    </fieldset>
  );
}
