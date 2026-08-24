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
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage(null);
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (mode === "register") {
      setMessage(
        "Konto angelegt. Bitte bestätigen Sie die E-Mail, die wir Ihnen geschickt haben, und melden Sie sich danach an."
      );
      setMode("login");
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2.5 text-[14px]"
              />
            </div>
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
