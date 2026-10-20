import { SimpleForm } from "@/components/SimpleForm";
import { requireUser } from "@/lib/auth";
import { setNewPassword } from "../auth-actions";

export const metadata = { title: "Lag passord · TapZon" };

export default async function NewPasswordPage() {
  const { user } = await requireUser({ allowTempPassword: true });
  const firstTime = Boolean(user.user_metadata?.must_change_password);

  return (
    <main className="wrap narrow" style={{ paddingTop: 64 }}>
      <div className="brand">TapZon</div>
      <h1 style={{ margin: "10px 0 6px" }}>Lag passord</h1>
      <p className="hint" style={{ marginBottom: 24 }}>
        {firstTime
          ? `Velkommen! Du logget inn med et midlertidig passord. Lag ditt eget passord for ${user.email} før du fortsetter.`
          : `For ${user.email}. Du bruker dette passordet neste gang du logger inn.`}
      </p>
      <div className="panel">
        <SimpleForm
          action={setNewPassword}
          submitLabel="Lagre passord"
          fields={[
            { name: "password", label: "Nytt passord (minst 8 tegn)", type: "password", autoComplete: "new-password" },
            { name: "repeat", label: "Gjenta passordet", type: "password", autoComplete: "new-password" },
          ]}
        />
      </div>
    </main>
  );
}
