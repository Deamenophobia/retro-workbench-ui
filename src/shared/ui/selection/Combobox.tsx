import { useRef } from "react";
import { Button } from "../Button";
import { OptionInput } from "./OptionInput";
import type { SelectionFieldProps } from "./types";

export function Combobox({
  value,
  onChange,
  name,
  ...props
}: SelectionFieldProps & {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const selected = props.options.find((option) => option.value === value);
  return (
    <div className="selection-field">
      <OptionInput
        {...props}
        mode="single"
        inputRef={input}
        selected={value === null ? [] : [value]}
        displayValue={selected?.label ?? ""}
        onSelect={onChange}
      />
      {name && <input type="hidden" name={name} value={value ?? ""} disabled={props.disabled} />}
      {value !== null && (
        <Button
          variant="text"
          disabled={props.disabled}
          onClick={() => {
            onChange(null);
            input.current?.focus();
          }}
          aria-label={`Clear ${props.label}`}
        >
          Clear
        </Button>
      )}
    </div>
  );
}
