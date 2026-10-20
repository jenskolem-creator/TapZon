import Link from "next/link";
import { SimpleForm } from "@/components/SimpleForm";
import { requestPasswordReset } from "../auth-actions";

export const metadata = { title: "Glemt passord · TapZon" };

export default function ForgotPasswordPage() {
  return (
    <main className="wrap narrow" style={{ paddingTop: 64 }}>
      <div className="brand">TapZon</div>
      <h1 style={{ margin: "10px 0 6px" }}>Glemt passord</h1>
      <p className="hint" style={{ marginBottom: 24 }}>
        Skriv inn e-postadressen din, så sender vi en lenke der du lager et nytt passord.
      </p>
      <div className="panel">
        <SimpleForm
          action={requestPasswordReset}
          submitLabel="Send lenke"
          fields={[{ name: "email", label: "E-post", type: "email", autoComplete: "email" }]}
        />
      </div>
      <p style={{ marginTop: 16 }}>
        <Link className="linkbtn" href="/admin/logg-inn">&larr; Tilbake til innlogging</Link>
      </p>
      <p className="hint" style={{ marginTop: 24 }}>
        Får du ingen e-post i løpet av noen minutter? Kontakt TapZon, så får du et nytt midlertidig passord.
      </p>
    </main>
  );
}
