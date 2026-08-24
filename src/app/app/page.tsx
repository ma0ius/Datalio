"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Inbox, LogOut, Upload, X } from "lucide-react";
import { getSupabase } from "../../lib/supabase";
import { parseCsv, guessMapping, type ParsedCsv } from "../../lib/csv";
import { Logo } from "../../components/ui/Logo";
import { Tag } from "../../components/ui/Tag";
import { Button } from "../../components/ui/Button";

type Artikel = {
  id: string;
  sku: string;
  name: string | null;
  attribute: Record<string, string>;
  created_at: string;
};

type Feld = "sku" | "name" | "attribut" | "ignorieren";

function Vollstaendigkeit({ artikel, alleKeys }: { artikel: Artikel; alleKeys: string[] }) {
  const gesamt = alleKeys.length + 1;
  let gefuellt = artikel.name?.trim() ? 1 : 0;
  for (const k of alleKeys) {
    if ((artikel.attribute[k] ?? "").toString().trim() !== "") gefuellt++;
  }
  const pct = gesamt === 0 ? 100 : Math.round((gefuellt / gesamt) * 100);
  const color =
    pct >= 90 ? "var(--color-ink)" : pct >= 60 ? "var(--color-steel-400)" : "var(--color-signal)";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 bg-steel-200">
        <div className="h-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono text-[11px]">{pct} %</span>
    </div>
  );
}

function ImportDialog({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: (anzahl: number) => void;
}) {
  const supabase = getSupabase()!;
  const fileRef = useRef<HTMLInputElement>(null);
  const [csv, setCsv] = useState<ParsedCsv | null>(null);
  const [dateiname, setDateiname] = useState("");
  const [mapping, setMapping] = useState<Record<number, Feld>>({});
  const [busy, setBusy] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden = useCallback((file: File) => {
    setDateiname(file.name);
    setFehler(null);
    file.text().then((text) => {
      const parsed = parseCsv(text);
      if (parsed.headers.length < 2 || parsed.rows.length === 0) {
        setFehler("Die Datei konnte nicht gelesen werden. Erwartet wird eine CSV Datei mit Kopfzeile und mindestens einer Datenzeile.");
        return;
      }
      setCsv(parsed);
      setMapping(guessMapping(parsed.headers));
    });
  }, []);

  const skuGewaehlt = Object.values(mapping).includes("sku");

  async function importieren() {
    if (!csv) return;
    setBusy(true);
    setFehler(null);
    const skuIdx = Number(Object.entries(mapping).find(([, f]) => f === "sku")?.[0]);
    const nameIdx = Object.entries(mapping).find(([, f]) => f === "name")?.[0];
    const attrIdx = Object.entries(mapping)
      .filter(([, f]) => f === "attribut")
      .map(([i]) => Number(i));

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setFehler("Sitzung abgelaufen. Bitte neu anmelden.");
      setBusy(false);
      return;
    }

    const zeilen = csv.rows
      .map((r) => {
        const sku = (r[skuIdx] ?? "").trim();
        if (!sku) return null;
        const attribute: Record<string, string> = {};
        for (const i of attrIdx) {
          attribute[csv.headers[i]] = (r[i] ?? "").trim();
        }
        return {
          user_id: userId,
          sku,
          name: nameIdx !== undefined ? (r[Number(nameIdx)] ?? "").trim() || null : null,
          attribute,
        };
      })
      .filter(Boolean) as { user_id: string; sku: string; name: string | null; attribute: Record<string, string> }[];

    // Dubletten innerhalb der Datei auflösen: letzte Zeile gewinnt
    const jeSku = new Map(zeilen.map((z) => [z.sku, z]));
    const eindeutig = [...jeSku.values()];

    for (let i = 0; i < eindeutig.length; i += 500) {
      const { error } = await supabase
        .from("artikel")
        .upsert(eindeutig.slice(i, i + 500), { onConflict: "user_id,sku" });
      if (error) {
        setFehler(
          error.code === "42P01"
            ? "Die Datenbanktabelle fehlt noch. Bitte das Skript supabase/migrations/001_artikel.sql im Supabase SQL Editor ausführen."
            : `Import fehlgeschlagen: ${error.message}`
        );
        setBusy(false);
        return;
      }
    }
    setBusy(false);
    onDone(eindeutig.length);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4">
      <div className="max-h-[85vh] w-full max-w-[720px] overflow-y-auto border-2 border-ink bg-paper p-6" style={{ boxShadow: "0 24px 48px rgba(22,24,26,0.22)" }}>
        <div className="flex items-center justify-between">
          <h2 className="dl-display text-[22px]">Artikel importieren</h2>
          <button onClick={onClose} aria-label="Schließen">
            <X size={20} />
          </button>
        </div>

        {!csv ? (
          <div className="mt-6">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && laden(e.target.files[0])}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-steel-400 px-6 py-12 text-center transition-colors duration-150 hover:border-ink"
            >
              <Upload size={24} strokeWidth={2} className="mx-auto text-steel-500" />
              <p className="mt-3 text-[15px] font-bold">CSV Datei auswählen</p>
              <p className="mt-1 text-[13px] text-steel-600">
                Lieferantenliste oder Export aus Wawi und Shop. Trennzeichen
                Semikolon, Komma oder Tab werden erkannt.
              </p>
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <p className="font-mono text-[12px] text-steel-600">
              {dateiname} · {csv.rows.length.toLocaleString("de-DE")} Zeilen ·
              Trennzeichen {csv.delimiter === "\t" ? "Tab" : `"${csv.delimiter}"`}
            </p>
            <p className="mt-4 text-[14px] text-steel-700">
              Ordnen Sie die Spalten zu. Eine Spalte muss die SKU sein, alles
              als Attribut Markierte wird als Merkmal übernommen.
            </p>
            <div className="mt-4 max-h-[300px] overflow-y-auto border-2 border-ink">
              {csv.headers.map((h, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_1fr_160px] items-center gap-3 border-b border-steel-300 px-3 py-2 last:border-b-0"
                >
                  <span className="truncate text-[13px] font-semibold">{h}</span>
                  <span className="truncate font-mono text-[11px] text-steel-500">
                    z. B. {csv.rows[0]?.[i] || "—"}
                  </span>
                  <select
                    value={mapping[i]}
                    onChange={(e) =>
                      setMapping({ ...mapping, [i]: e.target.value as Feld })
                    }
                    className="border-2 border-ink bg-paper px-2 py-1.5 text-[12px]"
                  >
                    <option value="sku">SKU (Artikelnummer)</option>
                    <option value="name">Artikelname</option>
                    <option value="attribut">Attribut übernehmen</option>
                    <option value="ignorieren">Ignorieren</option>
                  </select>
                </div>
              ))}
            </div>
            {fehler && (
              <p className="mt-4 border-2 border-signal bg-signal-tint px-3 py-2 text-[13px] text-signal-deep">
                {fehler}
              </p>
            )}
            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => setCsv(null)}
                className="dl-label text-steel-600 hover:text-ink"
              >
                Andere Datei wählen
              </button>
              <Button onClick={importieren} disabled={busy || !skuGewaehlt}>
                {busy ? "Import läuft" : `${csv.rows.length.toLocaleString("de-DE")} Zeilen importieren`}{" "}
                <ArrowRight size={14} strokeWidth={2.5} />
              </Button>
            </div>
            {!skuGewaehlt && (
              <p className="mt-2 text-right text-[12px] text-steel-500">
                Bitte genau eine Spalte als SKU markieren.
              </p>
            )}
          </div>
        )}
        {fehler && !csv && (
          <p className="mt-4 border-2 border-signal bg-signal-tint px-3 py-2 text-[13px] text-signal-deep">
            {fehler}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AppPage() {
  const router = useRouter();
  const supabase = getSupabase();
  const [email, setEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [artikel, setArtikel] = useState<Artikel[]>([]);
  const [ladeFehler, setLadeFehler] = useState<string | null>(null);
  const [importOffen, setImportOffen] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);

  const laden = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("artikel")
      .select("id, sku, name, attribute, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) {
      setLadeFehler(
        error.code === "42P01"
          ? "Die Datenbanktabelle fehlt noch. Bitte einmalig das Skript supabase/migrations/001_artikel.sql im Supabase SQL Editor ausführen (Anleitung im README)."
          : error.message
      );
    } else {
      setLadeFehler(null);
      setArtikel((data as Artikel[]) ?? []);
    }
  }, [supabase]);

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
        laden();
      }
    });
  }, [supabase, router, laden]);

  const alleKeys = useMemo(() => {
    const s = new Set<string>();
    for (const a of artikel) Object.keys(a.attribute ?? {}).forEach((k) => s.add(k));
    return [...s];
  }, [artikel]);

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
          <a href="/" aria-label="Zur Website">
            <Logo size={22} />
          </a>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[12px] text-steel-600 md:inline">{email}</span>
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

      <div className="mx-auto max-w-[1240px] px-5 py-10 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="dl-display text-[30px]">Katalog</h1>
            <Tag tone="signal">Vorabversion</Tag>
          </div>
          <Button onClick={() => setImportOffen(true)}>
            <Upload size={14} strokeWidth={2.5} /> CSV importieren
          </Button>
        </div>

        {meldung && (
          <p className="mt-4 border-2 border-ink bg-paper px-3 py-2 text-[13px]">
            {meldung}
          </p>
        )}
        {ladeFehler && (
          <p className="mt-4 border-2 border-signal bg-signal-tint px-3 py-2 text-[13px] text-signal-deep">
            {ladeFehler}
          </p>
        )}

        {artikel.length === 0 && !ladeFehler ? (
          <div className="mt-8 border-2 border-ink bg-paper px-8 py-16 text-center">
            <Inbox size={28} strokeWidth={2} className="mx-auto text-steel-400" />
            <p className="mt-4 text-[16px] font-bold">Noch keine Artikel</p>
            <p className="mx-auto mt-2 max-w-[48ch] text-[14px] leading-[1.6] text-steel-600">
              Importieren Sie eine CSV Datei, zum Beispiel eine
              Lieferantenliste oder einen Export aus Wawi oder Shop. Datalio
              legt einen Datensatz je Artikel an.
            </p>
            <Button onClick={() => setImportOffen(true)} className="mt-6">
              <Upload size={14} strokeWidth={2.5} /> CSV importieren
            </Button>
          </div>
        ) : artikel.length > 0 ? (
          <div className="mt-8 overflow-x-auto border-2 border-ink bg-paper">
            <div className="grid min-w-[640px] grid-cols-[140px_1fr_160px_120px] gap-4 border-b-2 border-ink px-4 py-2.5">
              {["SKU", "Artikel", "Vollständigkeit", "Attribute"].map((h) => (
                <span key={h} className="dl-label text-steel-500">{h}</span>
              ))}
            </div>
            {artikel.map((a) => (
              <div
                key={a.id}
                className="grid min-w-[640px] grid-cols-[140px_1fr_160px_120px] items-center gap-4 border-b border-steel-300 px-4 py-3 last:border-b-0"
              >
                <span className="truncate font-mono text-[12px] text-steel-600">{a.sku}</span>
                <span className="truncate text-[14px] font-semibold">
                  {a.name || <span className="text-steel-400">ohne Namen</span>}
                </span>
                <Vollstaendigkeit artikel={a} alleKeys={alleKeys} />
                <span className="font-mono text-[12px] text-steel-600">
                  {Object.values(a.attribute ?? {}).filter((v) => (v ?? "").toString().trim() !== "").length} / {alleKeys.length}
                </span>
              </div>
            ))}
            <p className="px-4 py-3 font-mono text-[12px] text-steel-500">
              {artikel.length.toLocaleString("de-DE")} Artikel · Vollständigkeit gemessen an allen bekannten Attributen
            </p>
          </div>
        ) : null}
      </div>

      {importOffen && (
        <ImportDialog
          onClose={() => setImportOffen(false)}
          onDone={(anzahl) => {
            setImportOffen(false);
            setMeldung(`${anzahl.toLocaleString("de-DE")} Artikel importiert.`);
            laden();
          }}
        />
      )}
    </main>
  );
}
