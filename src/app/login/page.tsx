"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getSupabase } from "../../lib/supabase";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabase();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    if (mode === "register" && password !== password2) {
      setMessage("Die beiden Passwörter stimmen nicht überein.");
      return;
    }
    setBusy(true);
    setMessage(null);
    const { data, error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/login` },
          });
    setBusy(false);
    if (error) {
      setMessage(
        error.message === "Invalid login credentials"
          ? "E-Mail oder Passwort ist falsch, oder die E-Mail wurde noch nicht bestätigt."
          : error.message
      );
      return;
    }
    if (mode === "register") {
      // Bereits registrierte Adressen liefern bei Supabase einen leeren
      // identities Array statt eines Fehlers.
      if (data.user && data.user.identities?.length === 0) {
        setMessage("Für diese E-Mail Adresse existiert bereits ein Konto. Bitte melden Sie sich an.");
        setMode("login");
        return;
      }
      setMessage(
        "Konto angelegt. Wir haben Ihnen eine Bestätigungsmail geschickt. Bitte klicken Sie auf den Link darin, erst danach ist die Anmeldung möglich."
      );
      setMode("login");
      setPassword("");
      setPassword2("");
      return;
    }
    router.push("/app");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ground px-5">
      <div className="w-full max-w-[420px] border-2 border-ink bg-paper p-8">
        <Logo size={24} />
        <h1 className="dl-display mt-6 text-[26px]">
          {mode === "login" ? "Anmelden" : "Konto anlegen"}
        </h1>
        {!supabase ? (
          <p className="mt-4 text-[14px] leading-[1.6] text-steel-600">
            Die Anmeldung ist noch nicht konfiguriert. Hinterlegen Sie die
            Supabase Zugangsdaten in der Datei .env.local (Vorlage:
            .env.local.example).
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="dl-label text-steel-600">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2.5 text-[14px]"
              />
            </div>
            <div>
              <label htmlFor="password" className="dl-label text-steel-600">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2.5 text-[14px]"
              />
              {mode === "register" && (
                <p className="mt-1.5 text-[12px] text-steel-500">Mindestens 8 Zeichen.</p>
              )}
            </div>
            {mode === "register" && (
              <div>
                <label htmlFor="password2" className="dl-label text-steel-600">
                  Passwort wiederholen
                </label>
                <input
                  id="password2"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2.5 text-[14px]"
                />
                {password2.length > 0 && password !== password2 && (
                  <p className="mt-1.5 text-[12px] text-signal-strong">
                    Die Passwörter stimmen noch nicht überein.
                  </p>
                )}
              </div>
            )}
            {message && (
              <p className="border-2 border-steel-300 bg-steel-100 px-3 py-2 text-[13px] leading-[1.5] text-steel-700">
                {message}
              </p>
            )}
            <Button type="submit" disabled={busy} className="w-full justify-center">
              {busy ? "Bitte warten" : mode === "login" ? "Anmelden" : "Konto anlegen"}{" "}
              <ArrowRight size={14} strokeWidth={2.5} />
            </Button>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setMessage(null);
              }}
              className="dl-label w-full text-center text-steel-600 hover:text-ink"
            >
              {mode === "login" ? "Neues Konto anlegen" : "Zurück zur Anmeldung"}
            </button>
          </form>
        )}
        <p className="mt-6 border-t border-steel-300 pt-4 font-mono text-[12px] text-steel-500">
          <a href="/">← Zurück zur Website</a>
        </p>
      </div>
    </main>
  );
}
