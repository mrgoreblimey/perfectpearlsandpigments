import type { InputHTMLAttributes } from "react";

/**
 * Uncontrolled labelled input for account forms. Uses the existing `chk-*`
 * styles. `error` renders the server-returned field error beneath it.
 */
export default function Field({
  label,
  name,
  error,
  span2,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
  span2?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name">) {
  return (
    <div style={span2 ? { gridColumn: "1 / -1" } : undefined}>
      <label className="chk-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={"chk-input" + (error ? " acct-input-err" : "")}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && <div className="acct-err">{error}</div>}
    </div>
  );
}
