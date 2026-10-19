import Link from "next/link";
import { SimpleForm } from "@/components/SimpleForm";
import { signIn } from "../auth-actions";

export const metadata = { title: "Logg inn · TapZon" };

export default async function LoginPage(props: PageProps<"/admin/logg-inn">) {
  const sp = await props.searchParams;
  const neste = typeof sp.neste === "string" ? sp.neste : "/admin";
  const linkFailed = sp.feil === "lenke";

  return (
    <main className="wrap narrow" style={{ paddingTop: 64 }}>
      <div className="brand">TapZon</div>
      <h1 style={{ margin: "10px 0 6px" }}>Logg inn i butikken</h1>
      <p className="hint" style={{ marginBottom: 24 }}>Her endrer du bilder og tekst på brikkene dine.</p>
      {linkFailed && (
        <p className="msg msg-error" style={{ marginBottom: 16 }}>
          Lenken i e-posten er brukt eller utløpt. Trykk «Glemt passord?» for å få en ny.
        </p>
      )}
      <div className="panel">
        <SimpleForm
          action={signIn}
          hidden={{ neste }}
          submitLabel="Logg inn"
          fields={[
            { name: "email", label: "E-post", type: "email", autoComplete: "email" },
            { name: "password", label: "Passord", type: "password", autoComplete: "current-password" },
          ]}
        />
      </div>
      <p style={{ marginTop: 16 }}>
        <Link className="linkbtn" href="/admin/glemt-passord">Glemt passord?</Link>
      </p>
    </main>
  );
}
