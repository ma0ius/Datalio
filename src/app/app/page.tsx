"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, Download, Inbox, LogOut, Sparkles, Upload, X } from "lucide-react";
import { getSupabase } from "../../lib/supabase";
import { parseCsv, guessMapping, umlautify, type ParsedCsv } from "../../lib/csv";
import { Logo } from "../../components/ui/Logo";
import { Tag } from "../../components/ui/Tag";
import { Button } from "../../components/ui/Button";

type Vorschlag = {
  name: string;
  beschreibung: string;
  attribute: Record<string, string>;
  hinweis: string;
};

type Artikel = {
  id: string;
  sku: string;
  name: string | null;
  beschreibung: string | null;
  attribute: Record<string, string>;
  vorschlag: Vorschlag | null;
  status: string;
  created_at: string;
};

type Feld = "sku" | "name" | "attribut" | "ignorieren";

const HILFE = {
  sku: "Eindeutige Artikelnummer aus Ihrem Import. Gleiche SKU wird beim erneuten Import aktualisiert, nicht doppelt angelegt.",
  artikel: "Artikelname. Die KI normalisiert Schreibweise und Vollständigkeit, ändert aber nie die Bedeutung.",
  vollstaendigkeit: "Anteil der gefüllten Felder: Name, SEO Text und alle bekannten Attribute.",
  attribute: "Gefüllte Attribute dieses Artikels im Verhältnis zu allen Attributspalten des Katalogs.",
  status: "Neu = importiert. Vorschlag = die KI hat Vorschläge erstellt, die auf Ihre Freigabe warten. Freigegeben = von Ihnen geprüft.",
  beschreibung: "Von der KI erstellter Produkttext für Shop und Marktplatz. Wird erst nach Ihrer Freigabe Teil des Datensatzes.",
  attributHerkunft: "Attributspalte aus Ihrem CSV Import.",
};

function statusTag(a: Artikel) {
  if (a.vorschlag) return <Tag tone="warning">Vorschlag</Tag>;
  if (a.status === "freigegeben") return <Tag tone="success">Freigegeben</Tag>;
  return <Tag tone="neutral">Neu</Tag>;
}

function Vollstaendigkeit({ artikel, alleKeys }: { artikel: Artikel; alleKeys: string[] }) {
  const gesamt = alleKeys.length + 2;
  let gefuellt = (artikel.name?.trim() ? 1 : 0) + (artikel.beschreibung?.trim() ? 1 : 0);
  for (const k of alleKeys) {
    if ((artikel.attribute[k] ?? "").toString().trim() !== "") gefuellt++;
  }
  const pct = gesamt === 0 ? 100 : Math.round((gefuellt / gesamt) * 100);
  const color =
    pct >= 90 ? "var(--color-ink)" : pct >= 60 ? "var(--color-steel-400)" : "var(--color-signal)";
  return (
    <div className="flex items-center gap-2" title={HILFE.vollstaendigkeit}>
      <div className="h-2 w-16 bg-steel-200">
        <div className="h-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono text-[11px]">{pct} %</span>
    </div>
  );
}

/* Vorschlag anwenden: KI Werte füllen nur Lücken oder ersetzen nach Prüfung. */
function vorschlagAnwenden(a: Artikel): { name: string | null; beschreibung: string | null; attribute: Record<string, string> } {
  const v = a.vorschlag;
  if (!v) return { name: a.name, beschreibung: a.beschreibung, attribute: a.attribute };
  const attribute = { ...a.attribute };
  for (const [k, wert] of Object.entries(v.attribute ?? {})) {
    if ((wert ?? "").trim() !== "") attribute[k] = wert;
  }
  return {
    name: v.name?.trim() ? v.name : a.name,
    beschreibung: v.beschreibung?.trim() ? v.beschreibung : a.beschreibung,
    attribute,
  };
}

/* ── Artikeldetail: prüfen, nachbearbeiten, freigeben ── */
function ArtikelDialog({
  artikel,
  alleKeys,
  onClose,
  onSaved,
}: {
  artikel: Artikel;
  alleKeys: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = getSupabase()!;
  const angewendet = vorschlagAnwenden(artikel);
  const [name, setName] = useState(angewendet.name ?? "");
  const [beschreibung, setBeschreibung] = useState(angewendet.beschreibung ?? "");
  const [attribute, setAttribute] = useState<Record<string, string>>(() => {
    const merged: Record<string, string> = {};
    for (const k of alleKeys) merged[k] = angewendet.attribute[k] ?? "";
    for (const [k, v] of Object.entries(angewendet.attribute)) merged[k] = v ?? "";
    return merged;
  });
  const [kiHinweis, setKiHinweis] = useState<string | null>(artikel.vorschlag?.hinweis ?? null);
  const [kiGefuellt, setKiGefuellt] = useState<Set<string>>(() => {
    const s = new Set<string>();
    const v = artikel.vorschlag;
    if (v) {
      if (v.name?.trim() && v.name !== artikel.name) s.add("__name");
      if (v.beschreibung?.trim() && v.beschreibung !== artikel.beschreibung) s.add("__beschreibung");
      for (const [k, wert] of Object.entries(v.attribute ?? {})) {
        if ((wert ?? "").trim() !== "" && wert !== artikel.attribute[k]) s.add(k);
      }
    }
    return s;
  });
  const [busy, setBusy] = useState<"ki" | "speichern" | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);

  async function anreichern() {
    setBusy("ki");
    setFehler(null);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Sitzung abgelaufen, bitte neu anmelden.");
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sku: artikel.sku,
          name,
          beschreibung,
          attribute,
          katalogKeys: Object.keys(attribute),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.fehler ?? `Fehler ${res.status}`);
      const gefuellt = new Set<string>();
      if (json.name && json.name !== name) gefuellt.add("__name");
      if (json.beschreibung && json.beschreibung !== beschreibung) gefuellt.add("__beschreibung");
      setName(json.name || name);
      setBeschreibung(json.beschreibung || beschreibung);
      setAttribute((prev) => {
        const next = { ...prev };
        for (const [k, v] of Object.entries(json.attribute ?? {})) {
          const wert = String(v ?? "");
          if (wert.trim() !== "" && wert !== prev[k]) {
            next[k] = wert;
            gefuellt.add(k);
          }
        }
        return next;
      });
      setKiGefuellt(gefuellt);
      setKiHinweis(json.hinweis || "Anreicherung abgeschlossen.");
    } catch (e) {
      setFehler(e instanceof Error ? e.message : "Unbekannter Fehler.");
    }
    setBusy(null);
  }

  async function speichern() {
    setBusy("speichern");
    setFehler(null);
    const { error } = await supabase
      .from("artikel")
      .update({
        name: name.trim() || null,
        beschreibung: beschreibung.trim() || null,
        attribute,
        vorschlag: null,
        status: "freigegeben",
        updated_at: new Date().toISOString(),
      })
      .eq("id", artikel.id);
    setBusy(null);
    if (error) {
      setFehler(
        error.message.includes("vorschlag") || error.message.includes("status")
          ? "Die Datenbank kennt die neuen Spalten noch nicht. Bitte das Skript supabase/migrations/003_vorschlag_status.sql im Supabase SQL Editor ausführen."
          : error.message
      );
      return;
    }
    onSaved();
  }

  const markiert = (key: string) =>
    kiGefuellt.has(key) ? { background: "var(--color-signal-tint)" } : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-6">
      <div
        className="flex max-h-full w-full max-w-[760px] flex-col border-2 border-ink bg-paper"
        style={{ boxShadow: "0 24px 48px rgba(22,24,26,0.22)" }}
      >
        <div className="flex items-center justify-between border-b-2 border-ink px-6 py-4">
          <div>
            <p className="font-mono text-[12px] text-steel-500">{artikel.sku}</p>
            <h2 className="dl-display text-[20px]">Artikel bearbeiten</h2>
          </div>
          <button onClick={onClose} aria-label="Schließen">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className="dl-label text-steel-600" htmlFor="a-name" title={HILFE.artikel}>
              Artikelname
            </label>
            <input
              id="a-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={markiert("__name")}
              className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2.5 text-[14px]"
            />
          </div>
          <div>
            <label className="dl-label text-steel-600" htmlFor="a-beschreibung" title={HILFE.beschreibung}>
              Beschreibung (SEO Text)
            </label>
            <textarea
              id="a-beschreibung"
              rows={5}
              value={beschreibung}
              onChange={(e) => setBeschreibung(e.target.value)}
              style={markiert("__beschreibung")}
              className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2.5 text-[14px] leading-[1.55]"
            />
          </div>
          <div>
            <p className="dl-label text-steel-600" title={HILFE.attribute}>Attribute</p>
            <div className="mt-2 border-2 border-ink">
              {Object.keys(attribute).length === 0 && (
                <p className="px-3 py-3 text-[13px] text-steel-500">
                  Noch keine Attribute. Attribute entstehen beim CSV Import.
                </p>
              )}
              {Object.keys(attribute).map((k) => (
                <div
                  key={k}
                  className="grid grid-cols-1 gap-1 border-b border-steel-300 px-3 py-2 last:border-b-0 sm:grid-cols-[220px_1fr] sm:items-center sm:gap-3"
                >
                  <span className="truncate text-[13px] font-semibold" title={HILFE.attributHerkunft}>
                    {k}
                  </span>
                  <input
                    value={attribute[k]}
                    onChange={(e) => setAttribute({ ...attribute, [k]: e.target.value })}
                    style={markiert(k)}
                    className="w-full border border-steel-300 bg-paper px-2 py-1.5 text-[13px]"
                  />
                </div>
              ))}
            </div>
          </div>
          {kiHinweis && (
            <p className="border-2 border-ink bg-steel-100 px-3 py-2 text-[13px] leading-[1.5]">
              <span className="dl-label mr-2 text-signal-strong">KI Hinweis</span>
              {kiHinweis} Rot hinterlegte Felder sind KI Vorschläge — bitte prüfen, dann freigeben.
            </p>
          )}
          {fehler && (
            <p className="border-2 border-signal bg-signal-tint px-3 py-2 text-[13px] text-signal-deep">
              {fehler}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink px-6 py-4">
          <Button variant="outline" onClick={anreichern} disabled={busy !== null}>
            <Sparkles size={14} strokeWidth={2.5} />
            {busy === "ki" ? "KI arbeitet …" : "Neu anreichern"}
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose} disabled={busy !== null}>
              Abbrechen
            </Button>
            <Button onClick={speichern} disabled={busy !== null}>
              {busy === "speichern" ? "Speichert …" : "Freigeben und speichern"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CSV Import (Stufe 1) ── */
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
      parsed.headers = parsed.headers.map(umlautify);
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
                  className="grid grid-cols-1 gap-1.5 border-b border-steel-300 px-3 py-2 last:border-b-0 sm:grid-cols-[1fr_1fr_160px] sm:items-center sm:gap-3"
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
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setCsv(null)}
                className="dl-label text-steel-600 hover:text-ink"
              >
                Andere Datei wählen
              </button>
              <Button onClick={importieren} disabled={busy || !skuGewaehlt}>
                {busy ? "Import läuft" : `${csv.rows.length.toLocaleString("de-DE")} Zeilen importieren`}
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

/* ── CSV Export ── */
function exportCsv(artikel: Artikel[], alleKeys: string[]) {
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const header = ["sku", "name", "beschreibung", "status", ...alleKeys];
  const zeilen = artikel.map((a) =>
    [
      esc(a.sku),
      esc(a.name ?? ""),
      esc(a.beschreibung ?? ""),
      esc(a.vorschlag ? "vorschlag" : a.status),
      ...alleKeys.map((k) => esc(a.attribute[k] ?? "")),
    ].join(";")
  );
  const csv = [header.map(esc).join(";"), ...zeilen].join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "datalio-katalog.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AppPage() {
  const router = useRouter();
  const supabase = getSupabase();
  const [email, setEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [artikel, setArtikel] = useState<Artikel[]>([]);
  const [ladeFehler, setLadeFehler] = useState<string | null>(null);
  const [importOffen, setImportOffen] = useState(false);
  const [aktiverArtikel, setAktiverArtikel] = useState<Artikel | null>(null);
  const [meldung, setMeldung] = useState<string | null>(null);
  const [lauf, setLauf] = useState<{ fertig: number; gesamt: number } | null>(null);
  const [freigabeLauf, setFreigabeLauf] = useState(false);
  const abbruch = useRef(false);

  const laden = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("artikel")
      .select("id, sku, name, beschreibung, attribute, vorschlag, status, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) {
      setLadeFehler(
        error.code === "42P01"
          ? "Die Datenbanktabelle fehlt noch. Bitte einmalig das Skript supabase/migrations/001_artikel.sql im Supabase SQL Editor ausführen (Anleitung im README)."
          : error.message.includes("beschreibung")
            ? "Die Spalte beschreibung fehlt noch. Bitte einmalig das Skript supabase/migrations/002_beschreibung.sql ausführen."
            : error.message.includes("vorschlag") || error.message.includes("status")
              ? "Die Spalten für KI Vorschläge fehlen noch. Bitte einmalig das Skript supabase/migrations/003_vorschlag_status.sql im Supabase SQL Editor ausführen."
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

  const offeneVorschlaege = artikel.filter((a) => a.vorschlag).length;
  const anzureichern = artikel.filter((a) => !a.vorschlag && !a.beschreibung?.trim()).length;

  /* Alle Artikel ohne SEO Text anreichern, Ergebnisse als Vorschläge speichern. */
  async function alleAnreichern() {
    if (!supabase) return;
    const ziel = artikel.filter((a) => !a.vorschlag && !a.beschreibung?.trim());
    if (ziel.length === 0) return;
    abbruch.current = false;
    setLauf({ fertig: 0, gesamt: ziel.length });
    setMeldung(null);
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setLauf(null);
      setMeldung("Sitzung abgelaufen, bitte neu anmelden.");
      return;
    }
    let fertig = 0;
    let fehler = 0;
    const warteschlange = [...ziel];
    const arbeiter = Array.from({ length: 3 }, async () => {
      while (warteschlange.length > 0 && !abbruch.current) {
        const a = warteschlange.shift()!;
        try {
          const res = await fetch("/api/enrich", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              sku: a.sku,
              name: a.name,
              beschreibung: a.beschreibung,
              attribute: a.attribute,
              katalogKeys: alleKeys,
            }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.fehler ?? `Fehler ${res.status}`);
          const vorschlag: Vorschlag = {
            name: json.name ?? "",
            beschreibung: json.beschreibung ?? "",
            attribute: json.attribute ?? {},
            hinweis: json.hinweis ?? "",
          };
          const { error } = await supabase
            .from("artikel")
            .update({ vorschlag, status: "vorschlag" })
            .eq("id", a.id);
          if (error) throw new Error(error.message);
        } catch {
          fehler++;
          if (fehler >= 3 && fertig === 0) abbruch.current = true;
        }
        fertig++;
        setLauf({ fertig, gesamt: ziel.length });
      }
    });
    await Promise.all(arbeiter);
    setLauf(null);
    setMeldung(
      fehler === 0
        ? `${ziel.length - fehler} Artikel angereichert. Die Vorschläge warten auf Ihre Freigabe.`
        : `${ziel.length - fehler} Artikel angereichert, ${fehler} fehlgeschlagen. ${abbruch.current ? "Lauf abgebrochen — prüfen Sie, ob der KI Schlüssel hinterlegt ist." : ""}`
    );
    laden();
  }

  /* Alle offenen Vorschläge auf einmal übernehmen. */
  async function alleFreigeben() {
    if (!supabase) return;
    const ziel = artikel.filter((a) => a.vorschlag);
    if (ziel.length === 0) return;
    setFreigabeLauf(true);
    let fehler = 0;
    for (const a of ziel) {
      const angewendet = vorschlagAnwenden(a);
      const { error } = await supabase
        .from("artikel")
        .update({
          name: angewendet.name,
          beschreibung: angewendet.beschreibung,
          attribute: angewendet.attribute,
          vorschlag: null,
          status: "freigegeben",
          updated_at: new Date().toISOString(),
        })
        .eq("id", a.id);
      if (error) fehler++;
    }
    setFreigabeLauf(false);
    setMeldung(
      fehler === 0
        ? `${ziel.length} Artikel freigegeben.`
        : `${ziel.length - fehler} Artikel freigegeben, ${fehler} fehlgeschlagen.`
    );
    laden();
  }

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
          <div className="flex flex-wrap gap-3">
            {anzureichern > 0 && !lauf && (
              <Button
                variant="outline"
                onClick={alleAnreichern}
                title="Erstellt KI Vorschläge für alle Artikel ohne SEO Text. Nichts wird ohne Ihre Freigabe übernommen."
              >
                <Sparkles size={14} strokeWidth={2.5} /> Alle anreichern ({anzureichern})
              </Button>
            )}
            {offeneVorschlaege > 0 && (
              <Button
                onClick={alleFreigeben}
                disabled={freigabeLauf || lauf !== null}
                title="Übernimmt alle offenen KI Vorschläge auf einmal in die Artikel."
              >
                <CheckCheck size={14} strokeWidth={2.5} />
                {freigabeLauf ? "Gibt frei …" : `Alle freigeben (${offeneVorschlaege})`}
              </Button>
            )}
            {artikel.length > 0 && (
              <Button
                variant="outline"
                onClick={() => exportCsv(artikel, alleKeys)}
                title="Lädt den kompletten Katalog als CSV Datei herunter, inklusive SEO Texten und Status."
              >
                <Download size={14} strokeWidth={2.5} /> CSV exportieren
              </Button>
            )}
            <Button onClick={() => setImportOffen(true)} variant={artikel.length > 0 ? "outline" : "primary"}>
              <Upload size={14} strokeWidth={2.5} /> CSV importieren
            </Button>
          </div>
        </div>

        {lauf && (
          <div className="mt-4 border-2 border-ink bg-paper px-4 py-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold">KI Anreicherung läuft …</span>
              <span className="font-mono text-[12px] text-steel-600">
                {lauf.fertig} / {lauf.gesamt}
              </span>
            </div>
            <div className="mt-2 h-2 bg-steel-200">
              <div
                className="h-full bg-signal"
                style={{ width: `${Math.round((lauf.fertig / lauf.gesamt) * 100)}%` }}
              />
            </div>
          </div>
        )}
        {meldung && !lauf && (
          <p className="mt-4 border-2 border-ink bg-paper px-3 py-2 text-[13px]">{meldung}</p>
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
            <div className="grid min-w-[720px] grid-cols-[130px_1fr_150px_100px_130px] gap-4 border-b-2 border-ink px-4 py-2.5">
              <span className="dl-label text-steel-500" title={HILFE.sku}>SKU</span>
              <span className="dl-label text-steel-500" title={HILFE.artikel}>Artikel</span>
              <span className="dl-label text-steel-500" title={HILFE.vollstaendigkeit}>Vollständigkeit</span>
              <span className="dl-label text-steel-500" title={HILFE.attribute}>Attribute</span>
              <span className="dl-label text-steel-500" title={HILFE.status}>Status</span>
            </div>
            {artikel.map((a) => (
              <button
                key={a.id}
                onClick={() => setAktiverArtikel(a)}
                className="grid w-full min-w-[720px] grid-cols-[130px_1fr_150px_100px_130px] items-center gap-4 border-b border-steel-300 px-4 py-3 text-left transition-colors duration-150 last:border-b-0 hover:bg-steel-100"
              >
                <span className="truncate font-mono text-[12px] text-steel-600">{a.sku}</span>
                <span className="truncate text-[14px] font-semibold">
                  {a.name || <span className="text-steel-400">ohne Namen</span>}
                </span>
                <Vollstaendigkeit artikel={a} alleKeys={alleKeys} />
                <span className="font-mono text-[12px] text-steel-600" title={HILFE.attribute}>
                  {Object.values(a.attribute ?? {}).filter((v) => (v ?? "").toString().trim() !== "").length} / {alleKeys.length}
                </span>
                <span title={HILFE.status}>{statusTag(a)}</span>
              </button>
            ))}
            <p className="px-4 py-3 font-mono text-[12px] text-steel-500">
              {artikel.length.toLocaleString("de-DE")} Artikel · Zum Prüfen und Freigeben Artikel anklicken
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
      {aktiverArtikel && (
        <ArtikelDialog
          artikel={aktiverArtikel}
          alleKeys={alleKeys}
          onClose={() => setAktiverArtikel(null)}
          onSaved={() => {
            setAktiverArtikel(null);
            setMeldung(`Artikel ${aktiverArtikel.sku} freigegeben.`);
            laden();
          }}
        />
      )}
    </main>
  );
}
