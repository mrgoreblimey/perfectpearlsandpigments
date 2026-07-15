"use client";

import { useActionState } from "react";
import { updateAddressAction, type FormState } from "@/lib/auth/actions";
import { emptyAddress, type Address } from "@/lib/auth/types";
import Field from "./Field";
import SubmitButton from "./SubmitButton";

const COUNTRIES: [string, string][] = [
  ["GB", "United Kingdom"],
  ["IE", "Ireland"],
  ["FR", "France"],
  ["DE", "Germany"],
  ["NL", "Netherlands"],
  ["US", "United States"],
];

export default function AddressForm({
  kind,
  title,
  address,
}: {
  kind: "billing" | "shipping";
  title: string;
  address: Address | null;
}) {
  const [state, action] = useActionState<FormState, FormData>(updateAddressAction, {});
  const a = { ...emptyAddress, ...(address ?? {}) };

  return (
    <form action={action} className="chk-card" style={{ padding: "24px 26px" }}>
      <h2 style={{ fontSize: "1.05rem", letterSpacing: "-0.015em", marginBottom: 16 }}>{title}</h2>
      <input type="hidden" name="kind" value={kind} />

      {state.success && <div className="acct-alert acct-alert-ok">{state.success}</div>}
      {state.error && <div className="acct-alert acct-alert-error">{state.error}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="chk-row2">
          <Field label="First name" name="firstName" autoComplete="given-name" defaultValue={a.firstName} error={state.fieldErrors?.firstName} />
          <Field label="Last name" name="lastName" autoComplete="family-name" defaultValue={a.lastName} />
        </div>
        <Field label="Company (optional)" name="company" autoComplete="organization" defaultValue={a.company} />
        <Field label="Address line 1" name="address1" autoComplete="address-line1" defaultValue={a.address1} error={state.fieldErrors?.address1} />
        <Field label="Address line 2 (optional)" name="address2" autoComplete="address-line2" defaultValue={a.address2} />
        <div className="chk-row2">
          <Field label="Town / City" name="city" autoComplete="address-level2" defaultValue={a.city} error={state.fieldErrors?.city} />
          <Field label="County / State" name="state" autoComplete="address-level1" defaultValue={a.state} />
        </div>
        <div className="chk-row2">
          <Field label="Postcode" name="postcode" autoComplete="postal-code" defaultValue={a.postcode} error={state.fieldErrors?.postcode} />
          <div>
            <label className="chk-label" htmlFor={`${kind}-country`}>Country</label>
            <select id={`${kind}-country`} name="country" className="chk-select" defaultValue={a.country}>
              {COUNTRIES.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="chk-row2">
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" defaultValue={a.phone} />
          {kind === "billing" && (
            <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={a.email ?? ""} />
          )}
        </div>
        <div style={{ marginTop: 6 }}>
          <SubmitButton pendingLabel="Saving…" full={false}>Save address</SubmitButton>
        </div>
      </div>
    </form>
  );
}
