"use client";

import { useFormStatus } from "react-dom";

/** Submit button that reflects the enclosing form's pending state. */
export default function SubmitButton({
  children,
  pendingLabel = "Please wait…",
  full = true,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  full?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="v2-btn-primary"
      disabled={pending}
      style={full ? { width: "100%", justifyContent: "center", padding: "15px 30px" } : undefined}
    >
      {pending && <span className="chk-spinner" aria-hidden="true" />}
      {pending ? pendingLabel : children}
    </button>
  );
}
