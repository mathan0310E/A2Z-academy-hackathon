
import { useFormContext } from "react-hook-form";
import { ChevronDown } from "lucide-react";
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
 * `rounded-none` matches the reference site's square field treatment.
 */
export const inputClassName =
  "w-full rounded-none border bg-white px-3.5 py-2.5 text-sm text-brand-navy placeholder:text-brand-muted/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green/40";

const errorClassName = "border-red-500/60 focus:border-red-500 focus:ring-red-500/30";
const normalClassName =
  "border-slate-300 hover:border-brand-green/50 focus:border-brand-green focus:ring-brand-green/30";

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
      {hint && !error && <p className="mt-1.5 text-xs text-brand-muted/80">{hint}</p>}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs text-red-400">
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
 * Free-text input with an optional suggestion list.
 *
 * Used for "Department" so participants can type their actual department
 * instead of being forced into a fixed dropdown. Suggestions are rendered with
 * a native <datalist>, so there is no JS, no extra bundle weight, and it
 * degrades to a plain text box in browsers without support.
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
    formState: { errors },
  } = useFormContext();

  const error = getError(errors as AnyErrors, name);
  const listId = `${name}-suggestions`;

  return (
    <FieldShell name={name} label={label} hint={hint} error={error}>
      <div className="relative">
        <input
          id={name}
          {...register(name as any)}
          list={listId}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={cn(inputClassName, "pr-9", error ? errorClassName : normalClassName)}
        />
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
        />
        <datalist id={listId}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
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
