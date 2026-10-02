
import { useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronDown, Search } from "../icons/Icons";
import { cn } from "@/lib/utils";

type AnyErrors = Record<string, any>;

/** Walk a dotted path ("members.0.email") into a react-hook-form errors object. */
function getError(errors: AnyErrors, path: string): string | undefined {
  let current: any = errors;
  for (const part of path.split(".")) {
    if (!current) return undefined;
    current = current[part];
  }
  if (!current) return undefined;
  return (current.root?.message as string) ?? (current.message as string) ?? undefined;
}

/**
 * Shared input styling so every form in the site (registration, contact)
 * renders identical fields. Exported for the rare case a field needs to be
 * composed by hand.
 *
 * The reference site has no forms, so fields follow its token system instead:
 * `--radius` (0.5rem → `rounded-lg`), the `--input` hairline (#e6e6e6), and the
 * same `#9ca3af` placeholder ink Tailwind's preflight uses.
 */
export const inputClassName =
  "w-full rounded-lg border border-input bg-white px-3.5 py-2.5 text-sm text-brand-ink placeholder:text-[#9ca3af] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green/40";

const errorClassName = "border-red-500/60 focus:border-red-500 focus:ring-red-500/30";
const normalClassName = "hover:border-brand-green/50 focus:border-brand-green focus:ring-brand-green/30";

function FieldShell({
  name,
  label,
  hint,
  error,
  children,
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brand-muted"
      >
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-brand-muted">{hint}</p>}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs text-brand-red">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Text / email / tel input bound to a react-hook-form field name.
 * Form-agnostic: the surrounding <FormProvider> supplies the form context.
 */
export function TextField({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  hint,
  maxLength,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  hint?: string;
  maxLength?: number;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = getError(errors as AnyErrors, name);

  return (
    <FieldShell name={name} label={label} hint={hint} error={error}>
      <input
        id={name}
        {...register(name as any)}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(inputClassName, error ? errorClassName : normalClassName)}
      />
    </FieldShell>
  );
}

/** Native select bound to a react-hook-form field name. */
export function SelectField({
  name,
  label,
  options,
  placeholder = "Select an option",
  hint,
}: {
  name: string;
  label: string;
  options: readonly string[];
  placeholder?: string;
  hint?: string;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = getError(errors as AnyErrors, name);

  return (
    <FieldShell name={name} label={label} hint={hint} error={error}>
      <select
        id={name}
        {...register(name as any)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          inputClassName,
          "appearance-none bg-white",
          error ? errorClassName : normalClassName
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/**
 * Free-text input with a themed suggestion list.
 *
 * Used for "Department" so participants can type their actual department
 * instead of being forced into a fixed dropdown. A native <datalist> would
 * render an OS-styled popup that ignores the brand tokens, so the list is
 * rendered in-page and filtered as you type. The input stays free text —
 * suggestions are a convenience, never a constraint — and picking one only
 * fills the value. Keyboard support follows the ARIA combobox pattern:
 * ArrowUp/Down to move, Enter to accept, Escape to dismiss.
 */
export function ComboboxField({
  name,
  label,
  options,
  placeholder,
  hint,
  maxLength,
}: {
  name: string;
  label: string;
  options: readonly string[];
  placeholder?: string;
  hint?: string;
  maxLength?: number;
}) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = getError(errors as AnyErrors, name);
  const listId = `${name}-suggestions`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const value = (watch(name as any) as string) ?? "";

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, value]);

  const { onChange, onBlur, ...rest } = register(name as any);

  const choose = (option: string) => {
    setValue(name as any, option, { shouldDirty: true, shouldValidate: true });
    setOpen(false);
    setActive(-1);
  };

  // Arrow keys walk the list once it is open; the first press opens it so a
  // keyboard user never has to tab away from the input. Escape is handled
  // before the empty-list guard so the field always collapses cleanly.
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const n = matches.length;
    if (!open) {
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && n > 0) {
        setOpen(true);
        setActive(e.key === "ArrowDown" ? 0 : n - 1);
        e.preventDefault();
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (n === 0) return;
    if (e.key === "ArrowDown") {
      setActive((i) => (i + 1) % n);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setActive((i) => (i - 1 + n) % n);
      e.preventDefault();
    } else if (e.key === "Enter" && active >= 0 && matches[active]) {
      choose(matches[active]);
      e.preventDefault();
    }
  };

  // aria-expanded / aria-controls must only describe a list that is rendered,
  // otherwise the input advertises a listbox that does not exist.
  const showList = open && matches.length > 0;

  return (
    <FieldShell name={name} label={label} hint={hint} error={error}>
      <div
        ref={wrapRef}
        className="relative"
        // Close when focus leaves the field entirely (e.g. tabbing to the next
        // input) without racing the click that selects an option.
        onBlur={(e) => {
          if (!wrapRef.current?.contains(e.relatedTarget as Node)) {
            setOpen(false);
            setActive(-1);
          }
        }}
      >
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
        />
        <input
          id={name}
          {...rest}
          value={value}
          onChange={(e) => {
            onChange(e);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          role="combobox"
          aria-expanded={showList}
          aria-controls={showList ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          className={cn(inputClassName, "pl-9 pr-9", error ? errorClassName : normalClassName)}
        />
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted transition-transform duration-200",
            showList && "rotate-180"
          )}
        />

        {showList && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-lg border border-input bg-white p-1 shadow-brand-lg"
          >
            {matches.map((option, i) => {
              const selected = option === value;
              return (
                <li
                  key={option}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(option)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    i === active ? "bg-brand-green-soft text-brand-green-ink" : "text-brand-ink",
                    selected && "font-semibold"
                  )}
                >
                  <span>{option}</span>
                  {selected && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-green-ink" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </FieldShell>
  );
}

/** Multi-line textarea bound to a react-hook-form field name. */
export function TextareaField({
  name,
  label,
  placeholder,
  rows = 5,
  hint,
  maxLength,
}: {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  hint?: string;
  maxLength?: number;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = getError(errors as AnyErrors, name);

  return (
    <FieldShell name={name} label={label} hint={hint} error={error}>
      <textarea
        id={name}
        {...register(name as any)}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(inputClassName, "resize-y", error ? errorClassName : normalClassName)}
      />
    </FieldShell>
  );
}

export { getError };
