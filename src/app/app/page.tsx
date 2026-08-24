"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCheck,
  Download,
  ImagePlus,
  Inbox,
  LogOut,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { getSupabase } from "../../lib/supabase";
import { parseCsv, guessMapping, umlautify, type ParsedCsv } from "../../lib/csv";
import { Logo } from "../../components/ui/Logo";
import { Tag } from "../../components/ui/Tag";
import { Button } from "../../components/ui/Button";

type QA = { frage: string; antwort: string };
type Inhalte = { bulletpoints: string[]; qa: QA[] };
type Bild = { path: string; name: string };

type Vorschlag = {
  name: string;
  beschreibung: string;
  attribute: Record<string, string>;
  bulletpoints?: string[];
  qa?: QA[];
  hinweis: string;
};

type Artikel = {
  id: string;
  sku: string;
  name: string | null;
  beschreibung: string | null;
  attribute: Record<string, string>;
  inhalte: Inhalte | null;
  bilder: Bild[] | null;
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
  bulletpoints: "Kurze Verkaufsargumente für Shop und Marktplatz, eines je Zeile.",
  qa: "Fragen und Antworten, wie Kundinnen sie vor dem Kauf stellen — nur aus belegten Angaben.",
  recherche: "Die KI sucht vor der Anreicherung im Netz nach Herstellerangaben zu diesem Artikel (dauert länger, kostet etwas mehr, liefert deutlich vollere Daten).",
  bilder: "Bilder werden anhand der SKU im Dateinamen automatisch dem richtigen Artikel zugeordnet, zum Beispiel JB-1042-E_front.jpg.",
};

function statusTag(a: Artikel) {
  if (a.vorschlag) return <Tag tone="warning">Vorschlag</Tag>;
  if (a.status === "freigegeben") return <Tag tone="success">Freigegeben</Tag>;
  return <Tag tone="neutral">Neu</Tag>;
}

function bildUrl(path: string): string {
  const supabase = getSupabase();
  if (!supabase) return "";
  return supabase.storage.from("artikelbilder").getPublicUrl(path).data.publicUrl;
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

/* Vorschlag anwenden: KI Werte füllen Lücken, Bestehendes wird ersetzt,
   wenn der Vorschlag einen Wert liefert. */
function vorschlagAnwenden(a: Artikel): {
  name: string | null;
  beschreibung: string | null;
  attribute: Record<string, string>;
  inhalte: Inhalte;
} {
  const v = a.vorschlag;
  const basisInhalte: Inhalte = {
    bulletpoints: a.inhalte?.bulletpoints ?? [],
    qa: a.inhalte?.qa ?? [],
  };
  if (!v) return { name: a.name, beschreibung: a.beschreibung, attribute: a.attribute, inhalte: basisInhalte };
  const attribute = { ...a.attribute };
  for (const [k, wert] of Object.entries(v.attribute ?? {})) {
    if ((wert ?? "").trim() !== "") attribute[k] = wert;
  }
  return {
    name: v.name?.trim() ? v.name : a.name,
    beschreibung: v.beschreibung?.trim() ? v.beschreibung : a.beschreibung,
    attribute,
    inhalte: {
      bulletpoints: v.bulletpoints?.length ? v.bulletpoints : basisInhalte.bulletpoints,
      qa: v.qa?.length ? v.qa : basisInhalte.qa,
    },
  };
}

/* ── Artikeldetail: prüfen, nachbearbeiten, freigeben ── */
function ArtikelDialog({
  artikel,
  alleKeys,
  userId,
  recherche,
  onClose,
  onSaved,
}: {
  artikel: Artikel;
  alleKeys: string[];
  userId: string;
  recherche: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = getSupabase()!;
  const angewendet = vorschlagAnwenden(artikel);
  const [name, setName] = useState(angewendet.name ?? "");
  const [beschreibung, setBeschreibung] = useState(angewendet.beschreibung ?? "");
  const [bullets, setBullets] = useState(angewendet.inhalte.bulletpoints.join("\n"));
  const [qa, setQa] = useState<QA[]>(angewendet.inhalte.qa);
  const [bilder, setBilder] = useState<Bild[]>(artikel.bilder ?? []);
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
      if (v.bulletpoints?.length) s.add("__bullets");
      if (v.qa?.length) s.add("__qa");
      for (const [k, wert] of Object.entries(v.attribute ?? {})) {
        if ((wert ?? "").trim() !== "" && wert !== artikel.attribute[k]) s.add(k);
      }
    }
    return s;
  });
  const [busy, setBusy] = useState<"ki" | "speichern" | "bild" | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const bildRef = useRef<HTMLInputElement>(null);

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
          recherche,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.fehler ?? `Fehler ${res.status}`);
      const gefuellt = new Set<string>();
      if (json.name && json.name !== name) gefuellt.add("__name");
      if (json.beschreibung && json.beschreibung !== beschreibung) gefuellt.add("__beschreibung");
      if (json.bulletpoints?.length) {
        setBullets((json.bulletpoints as string[]).join("\n"));
        gefuellt.add("__bullets");
      }
      if (json.qa?.length) {
        setQa(json.qa);
        gefuellt.add("__qa");
      }
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

  async function bilderHochladen(files: FileList) {
    setBusy("bild");
    setFehler(null);
    const neu: Bild[] = [...bilder];
    for (const file of Array.from(files)) {
      const sauber = file.name.replace(/[^A-Za-z0-9._-]/g, "_");
      const path = `${userId}/${artikel.id}/${Date.now()}-${sauber}`;
      const { error } = await supabase.storage.from("artikelbilder").upload(path, file);
      if (error) {
        setFehler(
          error.message.includes("Bucket")
            ? "Der Bildspeicher fehlt noch. Bitte das Skript supabase/migrations/004_bilder_inhalte.sql im Supabase SQL Editor ausführen."
            : `Upload fehlgeschlagen: ${error.message}`
        );
        setBusy(null);
        return;
      }
      neu.push({ path, name: file.name });
    }
    const { error } = await supabase.from("artikel").update({ bilder: neu }).eq("id", artikel.id);
    if (error) setFehler(error.message);
    else setBilder(neu);
    setBusy(null);
  }

  async function bildLoeschen(bild: Bild) {
    await supabase.storage.from("artikelbilder").remove([bild.path]);
    const neu = bilder.filter((b) => b.path !== bild.path);
    await supabase.from("artikel").update({ bilder: neu }).eq("id", artikel.id);
    setBilder(neu);
  }

  async function speichern() {
    setBusy("speichern");
    setFehler(null);
    const inhalte: Inhalte = {
      bulletpoints: bullets.split("\n").map((b) => b.trim()).filter(Boolean),
      qa: qa.filter((p) => p.frage.trim() && p.antwort.trim()),
    };
    const { error } = await supabase
      .from("artikel")
      .update({
        name: name.trim() || null,
        beschreibung: beschreibung.trim() || null,
        attribute,
        inhalte,
        vorschlag: null,
        status: "freigegeben",
        updated_at: new Date().toISOString(),
      })
      .eq("id", artikel.id);
    setBusy(null);
    if (error) {
      setFehler(
        error.message.includes("inhalte") || error.message.includes("bilder")
          ? "Die Datenbank kennt die neuen Spalten noch nicht. Bitte das Skript supabase/migrations/004_bilder_inhalte.sql im Supabase SQL Editor ausführen."
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
            <div className="flex items-center justify-between">
              <p className="dl-label text-steel-600" title={HILFE.bilder}>Bilder</p>
              <input
                ref={bildRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files?.length && bilderHochladen(e.target.files)}
              />
              <button
                onClick={() => bildRef.current?.click()}
                disabled={busy !== null}
                className="dl-label flex items-center gap-1.5 text-steel-600 hover:text-ink"
              >
                <ImagePlus size={14} /> {busy === "bild" ? "Lädt hoch …" : "Hochladen"}
              </button>
            </div>
            {bilder.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {bilder.map((b) => (
                  <span key={b.path} className="group relative border-2 border-ink">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bildUrl(b.path)} alt={b.name} className="h-20 w-20 object-cover" />
                    <button
                      onClick={() => bildLoeschen(b)}
                      title="Bild löschen"
                      className="absolute right-0 top-0 hidden bg-ink p-1 text-ground group-hover:block"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
            <label className="dl-label text-steel-600" htmlFor="a-bullets" title={HILFE.bulletpoints}>
              Bulletpoints (eine Zeile je Punkt)
            </label>
            <textarea
              id="a-bullets"
              rows={4}
              value={bullets}
              onChange={(e) => setBullets(e.target.value)}
              style={markiert("__bullets")}
              className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2.5 font-mono text-[13px] leading-[1.6]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="dl-label text-steel-600" title={HILFE.qa}>Fragen und Antworten</p>
              <button
                onClick={() => setQa([...qa, { frage: "", antwort: "" }])}
                className="dl-label text-steel-600 hover:text-ink"
              >
                + Hinzufügen
              </button>
            </div>
            {qa.length > 0 && (
              <div className="mt-2 space-y-2" style={markiert("__qa")}>
                {qa.map((p, i) => (
                  <div key={i} className="border-2 border-ink p-2">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <input
                          value={p.frage}
                          placeholder="Frage"
                          onChange={(e) =>
                            setQa(qa.map((q, j) => (j === i ? { ...q, frage: e.target.value } : q)))
                          }
                          className="w-full border border-steel-300 bg-paper px-2 py-1.5 text-[13px] font-semibold"
                        />
                        <textarea
                          value={p.antwort}
                          placeholder="Antwort"
                          rows={2}
                          onChange={(e) =>
                            setQa(qa.map((q, j) => (j === i ? { ...q, antwort: e.target.value } : q)))
                          }
                          className="w-full border border-steel-300 bg-paper px-2 py-1.5 text-[13px] leading-[1.5]"
                        />
                      </div>
                      <button
                        onClick={() => setQa(qa.filter((_, j) => j !== i))}
                        title="Entfernen"
                        className="mt-1 text-steel-500 hover:text-ink"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          <Button variant="outline" onClick={anreichern} disabled={busy !== null} title={recherche ? HILFE.recherche : undefined}>
            <Sparkles size={14} strokeWidth={2.5} />
            {busy === "ki"
              ? recherche ? "KI recherchiert …" : "KI arbeitet …"
              : recherche ? "Anreichern mit Webrecherche" : "Neu anreichern"}
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
  const header = ["sku", "name", "beschreibung", "bulletpoints", "fragen_antworten", "bilder", "status", ...alleKeys];
  const zeilen = artikel.map((a) =>
    [
      esc(a.sku),
      esc(a.name ?? ""),
      esc(a.beschreibung ?? ""),
      esc((a.inhalte?.bulletpoints ?? []).join(" | ")),
      esc((a.inhalte?.qa ?? []).map((p) => `F: ${p.frage} A: ${p.antwort}`).join(" | ")),
      esc((a.bilder ?? []).map((b) => bildUrl(b.path)).join(" ")),
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
  const [userId, setUserId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [artikel, setArtikel] = useState<Artikel[]>([]);
  const [ladeFehler, setLadeFehler] = useState<string | null>(null);
  const [importOffen, setImportOffen] = useState(false);
  const [aktiverArtikel, setAktiverArtikel] = useState<Artikel | null>(null);
  const [meldung, setMeldung] = useState<string | null>(null);
  const [lauf, setLauf] = useState<{ fertig: number; gesamt: number } | null>(null);
  const [freigabeLauf, setFreigabeLauf] = useState(false);
  const [recherche, setRecherche] = useState(true);
  const abbruch = useRef(false);
  const bildzuordnungRef = useRef<HTMLInputElement>(null);

  const laden = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("artikel")
      .select("id, sku, name, beschreibung, attribute, inhalte, bilder, vorschlag, status, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) {
      setLadeFehler(
        error.code === "42P01"
          ? "Die Datenbanktabelle fehlt noch. Bitte einmalig das Skript supabase/migrations/001_artikel.sql im Supabase SQL Editor ausführen (Anleitung im README)."
          : error.message.includes("beschreibung")
            ? "Die Spalte beschreibung fehlt noch. Bitte einmalig das Skript supabase/migrations/002_beschreibung.sql ausführen."
            : error.message.includes("vorschlag") || error.message.includes("status")
              ? "Die Spalten für KI Vorschläge fehlen noch. Bitte einmalig das Skript supabase/migrations/003_vorschlag_status.sql ausführen."
              : error.message.includes("inhalte") || error.message.includes("bilder")
                ? "Die Spalten für Bulletpoints und Bilder fehlen noch. Bitte einmalig das Skript supabase/migrations/004_bilder_inhalte.sql im Supabase SQL Editor ausführen."
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
        setUserId(data.user.id);
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
              recherche,
            }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.fehler ?? `Fehler ${res.status}`);
          const vorschlag: Vorschlag = {
            name: json.name ?? "",
            beschreibung: json.beschreibung ?? "",
            attribute: json.attribute ?? {},
            bulletpoints: json.bulletpoints ?? [],
            qa: json.qa ?? [],
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
        ? `${ziel.length - fehler} Artikel angereichert${recherche ? " (mit Webrecherche)" : ""}. Die Vorschläge warten auf Ihre Freigabe.`
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
          inhalte: angewendet.inhalte,
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

  /* Bildzuordnung: Dateien werden anhand der SKU im Dateinamen verteilt. */
  async function bilderZuordnen(files: FileList) {
    if (!supabase || !userId) return;
    setMeldung(null);
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const artikelNachSku = artikel
      .map((a) => ({ a, skuNorm: norm(a.sku) }))
      .filter((e) => e.skuNorm.length > 0)
      .sort((x, y) => y.skuNorm.length - x.skuNorm.length);
    let zugeordnet = 0;
    let ohneTreffer = 0;
    let fehlgeschlagen = 0;
    const neueBilder = new Map<string, Bild[]>();
    for (const file of Array.from(files)) {
      const nameNorm = norm(file.name.replace(/\.[^.]+$/, ""));
      const treffer = artikelNachSku.find((e) => nameNorm.includes(e.skuNorm));
      if (!treffer) {
        ohneTreffer++;
        continue;
      }
      const sauber = file.name.replace(/[^A-Za-z0-9._-]/g, "_");
      const path = `${userId}/${treffer.a.id}/${Date.now()}-${sauber}`;
      const { error } = await supabase.storage.from("artikelbilder").upload(path, file);
      if (error) {
        fehlgeschlagen++;
        if (error.message.includes("Bucket")) {
          setMeldung("Der Bildspeicher fehlt noch. Bitte das Skript supabase/migrations/004_bilder_inhalte.sql im Supabase SQL Editor ausführen.");
          return;
        }
        continue;
      }
      const liste = neueBilder.get(treffer.a.id) ?? [...(treffer.a.bilder ?? [])];
      liste.push({ path, name: file.name });
      neueBilder.set(treffer.a.id, liste);
      zugeordnet++;
    }
    for (const [id, bilder] of neueBilder) {
      const { error } = await supabase.from("artikel").update({ bilder }).eq("id", id);
      if (error) fehlgeschlagen++;
    }
    setMeldung(
      `${zugeordnet} Bilder zugeordnet` +
        (ohneTreffer > 0 ? `, ${ohneTreffer} ohne SKU Treffer im Dateinamen` : "") +
        (fehlgeschlagen > 0 ? `, ${fehlgeschlagen} fehlgeschlagen` : "") +
        "."
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
          <div className="flex flex-wrap items-center gap-3">
            <label
              className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold"
              title={HILFE.recherche}
            >
              <input
                type="checkbox"
                checked={recherche}
                onChange={(e) => setRecherche(e.target.checked)}
                className="h-4 w-4 accent-[#e23a16]"
              />
              Webrecherche
            </label>
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
              <>
                <input
                  ref={bildzuordnungRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files?.length && bilderZuordnen(e.target.files)}
                />
                <Button
                  variant="outline"
                  onClick={() => bildzuordnungRef.current?.click()}
                  title={HILFE.bilder}
                >
                  <ImagePlus size={14} strokeWidth={2.5} /> Bilder zuordnen
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportCsv(artikel, alleKeys)}
                  title="Lädt den kompletten Katalog als CSV Datei herunter, inklusive SEO Texten, Bulletpoints, Q&As und Bild Adressen."
                >
                  <Download size={14} strokeWidth={2.5} /> CSV exportieren
                </Button>
              </>
            )}
            <Button onClick={() => setImportOffen(true)} variant={artikel.length > 0 ? "outline" : "primary"}>
              <Upload size={14} strokeWidth={2.5} /> CSV importieren
            </Button>
          </div>
        </div>

        {lauf && (
          <div className="mt-4 border-2 border-ink bg-paper px-4 py-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold">
                KI Anreicherung läuft{recherche ? " (mit Webrecherche)" : ""} …
              </span>
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
            <div className="grid min-w-[760px] grid-cols-[56px_120px_1fr_150px_90px_130px] gap-4 border-b-2 border-ink px-4 py-2.5">
              <span className="dl-label text-steel-500" title={HILFE.bilder}>Bild</span>
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
                className="grid w-full min-w-[760px] grid-cols-[56px_120px_1fr_150px_90px_130px] items-center gap-4 border-b border-steel-300 px-4 py-2.5 text-left transition-colors duration-150 last:border-b-0 hover:bg-steel-100"
              >
                {a.bilder?.length ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bildUrl(a.bilder[0].path)}
                    alt=""
                    className="h-9 w-9 border border-steel-300 object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center border border-steel-300 bg-steel-100 text-[10px] text-steel-400">
                    —
                  </span>
                )}
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
      {aktiverArtikel && userId && (
        <ArtikelDialog
          artikel={aktiverArtikel}
          alleKeys={alleKeys}
          userId={userId}
          recherche={recherche}
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
