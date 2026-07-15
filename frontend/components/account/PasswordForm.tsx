"use client";

import { useActionState } from "react";
import { changePasswordAction, type FormState } from "@/lib/auth/actions";
import Field from "./Field";
import SubmitButton from "./SubmitButton";

export default function PasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(changePasswordAction, {});

  return (
    <form action={action} className="chk-card" style={{ padding: "24px 26px" }}>
      <h2 style={{ fontSize: "1.05rem", letterSpacing: "-0.015em", marginBottom: 16 }}>Change password</h2>

      {state.success && <div className="acct-alert acct-alert-ok">{state.success}</div>}
      {state.error && <div className="acct-alert acct-alert-error">{state.error}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Current password" name="currentPassword" type="password" autoComplete="current-password" />
        <Field label="New password" name="newPassword" type="password" autoComplete="new-password" placeholder="At least 8 characters" error={state.fieldErrors?.newPassword} />
        <Field label="Confirm new password" name="confirmPassword" type="password" autoComplete="new-password" error={state.fieldErrors?.confirmPassword} />
        <div style={{ marginTop: 6 }}>
          <SubmitButton pendingLabel="Saving…" full={false}>Update password</SubmitButton>
        </div>
      </div>
    </form>
  );
}
