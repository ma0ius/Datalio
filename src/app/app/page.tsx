"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Inbox, LogOut } from "lucide-react";
import { getSupabase } from "../../lib/supabase";
import { Logo } from "../../components/ui/Logo";
import { Tag } from "../../components/ui/Tag";

/* Platzhalter für die Datalio Applikation (Stufe 1: Import folgt). */
export default function AppPage() {
  const router = useRouter();
  const supabase = getSupabase();
  const [email, setEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!supabase) {
      router.replace("/login");
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        setEmail(data.user.email ?? null);
        setChecked(true);
      }
    });
  }, [supabase, router]);

  if (!checked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ground">
        <p className="font-mono text-[13px] text-steel-500">Anmeldung wird geprüft …</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ground">
      <header className="border-b-2 border-ink bg-ground">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:px-10">
          <Logo size={22} />
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[12px] text-steel-600 md:inline">
              {email}
            </span>
            <button
              onClick={async () => {
                await supabase?.auth.signOut();
                router.replace("/login");
              }}
              className="dl-label flex items-center gap-1.5 text-steel-600 hover:text-ink"
            >
              <LogOut size={14} /> Abmelden
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1240px] px-5 py-12 md:px-10">
        <div className="flex items-center gap-3">
          <h1 className="dl-display text-[30px]">Katalog</h1>
          <Tag tone="signal">Vorabversion</Tag>
        </div>
        <div className="mt-8 border-2 border-ink bg-paper px-8 py-16 text-center">
          <Inbox size={28} strokeWidth={2} className="mx-auto text-steel-400" />
          <p className="mt-4 text-[16px] font-bold">Noch keine Artikel</p>
          <p className="mx-auto mt-2 max-w-[48ch] text-[14px] leading-[1.6] text-steel-600">
            Hier entsteht Stufe 1 der Datalio Applikation: CSV und Excel
            Import mit Spaltenzuordnung, ein Datensatz je Artikel und die
            Vollständigkeitsansicht.
          </p>
        </div>
      </div>
    </main>
  );
}
