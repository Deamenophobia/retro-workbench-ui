import { useRef } from "react";
import { Button } from "../Button";
import { OptionInput } from "./OptionInput";
import type { SelectionFieldProps } from "./types";

export function MultiSelect({
  value,
  onChange,
  name,
  ...props
}: SelectionFieldProps & {
  value: readonly string[];
  onChange: (value: readonly string[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const selected = [...new Set(value)];
  function toggle(item: string) {
    onChange(
      selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item],
    );
  }
  return (
    <div className="selection-field">
      <OptionInput
        {...props}
        mode="multiple"
        inputRef={input}
        selected={selected}
        displayValue=""
        onSelect={toggle}
      />
      {selected.length > 0 && (
        <ul className="selection-tags" aria-label={`Selected ${props.label}`}>
          {selected.map((item) => {
            const option = props.options.find((option) => option.value === item);
            return (
              <li key={item}>
                <span>{option?.label ?? item}</span>
                <Button
                  variant="text"
                  aria-label={`Remove ${option?.label ?? item}`}
                  disabled={props.disabled || option?.disabled}
                  onClick={() => {
                    toggle(item);
                    input.current?.focus();
                  }}
                >
                  ×
                </Button>
                {name && <input type="hidden" name={name} value={item} disabled={props.disabled} />}
              </li>
            );
          })}
        </ul>
      )}
      <span className="sr-only" role="status">
        {selected.length} selected
      </span>
    </div>
  );
}
