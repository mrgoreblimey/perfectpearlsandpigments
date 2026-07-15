"use client";

import { useActionState } from "react";
import { updateAccountAction, type FormState } from "@/lib/auth/actions";
import type { Viewer } from "@/lib/auth/types";
import Field from "./Field";
import SubmitButton from "./SubmitButton";

export default function AccountDetailsForm({ viewer }: { viewer: Viewer }) {
  const [state, action] = useActionState<FormState, FormData>(updateAccountAction, {});

  return (
    <form action={action} className="chk-card" style={{ padding: "24px 26px" }}>
      <h2 style={{ fontSize: "1.05rem", letterSpacing: "-0.015em", marginBottom: 16 }}>Your details</h2>

      {state.success && <div className="acct-alert acct-alert-ok">{state.success}</div>}
      {state.error && <div className="acct-alert acct-alert-error">{state.error}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="chk-row2">
          <Field label="First name" name="firstName" autoComplete="given-name" defaultValue={viewer.firstName} error={state.fieldErrors?.firstName} />
          <Field label="Last name" name="lastName" autoComplete="family-name" defaultValue={viewer.lastName} error={state.fieldErrors?.lastName} />
        </div>
        <Field label="Email address" name="email" type="email" autoComplete="email" defaultValue={viewer.email} error={state.fieldErrors?.email} />
        <div style={{ marginTop: 6 }}>
          <SubmitButton pendingLabel="Saving…" full={false}>Save changes</SubmitButton>
        </div>
      </div>
    </form>
  );
}
