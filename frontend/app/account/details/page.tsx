import { requireSession } from "@/lib/auth";
import AccountDetailsForm from "@/components/account/AccountDetailsForm";
import PasswordForm from "@/components/account/PasswordForm";

export default async function AccountDetailsPage() {
  const session = await requireSession();

  return (
    <div>
      <h2 style={{ fontSize: "1.15rem", letterSpacing: "-0.02em", marginBottom: 22 }}>Account details</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <AccountDetailsForm viewer={session.user} />
        <PasswordForm />
      </div>
    </div>
  );
}
