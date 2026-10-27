import { useId, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Field } from "../Field";
import { useFloatingPosition } from "../overlays/useFloatingPosition";
import { filterOptions, moveOption } from "./optionModel";
import type { SelectionFieldProps } from "./types";

type Props = Omit<SelectionFieldProps, "name"> & {
  selected: readonly string[];
  displayValue: string;
  mode: "single" | "multiple";
  onSelect: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

/** One keyboard and popup implementation for both public selection controls. */
export function OptionInput({
  label,
  options,
  selected,
  displayValue,
  mode,
  onSelect,
  inputRef,
  help,
  error,
  disabled,
  placeholder = "Search options…",
}: Props) {
  const id = useId();
  const anchor = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const activeOption = useRef<HTMLLIElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const filtered = filterOptions(options, query ?? "");
  const activeIndex = filtered.findIndex((option) => option.value === active && !option.disabled);
  const expanded = open && !disabled;
  function close() {
    setOpen(false);
    setQuery(null);
    setActive(null);
  }
  function show() {
    setQuery("");
    setOpen(true);
    setActive(null);
  }
  function choose(value: string) {
    onSelect(value);
    if (mode === "single") close();
    else {
      setQuery("");
      setActive(value);
    }
  }
  useLayoutEffect(() => {
    if (expanded) surface.current?.showPopover();
    else surface.current?.hidePopover();
  }, [expanded]);
  useFloatingPosition(expanded, anchor, surface);
  useLayoutEffect(() => {
    if (expanded) activeOption.current?.scrollIntoView({ block: "nearest" });
  }, [expanded, active, query]);
  return (
    <Field label={label} {...(help ? { help } : {})} {...(error ? { error } : {})}>
      {(field) => (
        <div ref={anchor} className="option-field">
          <input
            {...field}
            ref={inputRef}
            type="text"
            role="combobox"
            autoComplete="off"
            disabled={disabled}
            aria-autocomplete="list"
            aria-expanded={expanded}
            aria-controls={`${id}-list`}
            aria-activedescendant={
              expanded && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
            }
            placeholder={placeholder}
            value={query ?? displayValue}
            onFocus={show}
            onClick={() => {
              if (!expanded) show();
            }}
            onBlur={close}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setActive(null);
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;
              if (event.key === "Escape" && expanded) {
                event.preventDefault();
                event.stopPropagation();
                close();
                return;
              }
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                setOpen(true);
                if (!expanded) setQuery("");
                setActive(
                  moveOption(
                    expanded ? filtered : options,
                    expanded ? active : null,
                    event.key === "ArrowDown" ? "next" : "previous",
                  ),
                );
              } else if (expanded && (event.key === "Home" || event.key === "End")) {
                event.preventDefault();
                setActive(moveOption(filtered, active, event.key === "Home" ? "first" : "last"));
              } else if (expanded && event.key === "Enter") {
                event.preventDefault();
                const option = filtered[activeIndex];
                if (option && !option.disabled) choose(option.value);
              }
            }}
          />
          <span className="option-chevron" aria-hidden="true">
            ▾
          </span>
          <div
            ref={surface}
            popover="manual"
            className="floating-surface option-popup"
            onPointerDown={(event) => event.preventDefault()}
          >
            <ul
              id={`${id}-list`}
              role="listbox"
              aria-label={`${label} options`}
              aria-multiselectable={mode === "multiple" ? true : undefined}
            >
              {filtered.map((option, index) => (
                <li
                  key={option.value}
                  id={`${id}-option-${index}`}
                  role="option"
                  ref={index === activeIndex ? activeOption : undefined}
                  aria-selected={selected.includes(option.value)}
                  aria-disabled={option.disabled || undefined}
                  data-active={index === activeIndex || undefined}
                  onClick={() => {
                    if (!option.disabled) choose(option.value);
                  }}
                >
                  <span>{option.label}</span>
                  {option.description && <small>{option.description}</small>}
                  {selected.includes(option.value) && (
                    <span className="option-check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {filtered.length === 0 && (
              <p role="status" className="option-empty">
                No matching options.
              </p>
            )}
          </div>
        </div>
      )}
    </Field>
  );
}
