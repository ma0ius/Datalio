/* Kleiner CSV Parser für Lieferantenlisten: erkennt ; , und Tab als
   Trennzeichen, versteht Anführungszeichen und Windows Zeilenumbrüche. */

export type ParsedCsv = {
  headers: string[];
  rows: string[][];
  delimiter: string;
};

function detectDelimiter(firstLine: string): string {
  const candidates = [";", ",", "\t"];
  let best = ";";
  let bestCount = -1;
  for (const c of candidates) {
    const count = firstLine.split(c).length - 1;
    if (count > bestCount) {
      best = c;
      bestCount = count;
    }
  }
  return best;
}

export function parseCsv(text: string): ParsedCsv {
  const clean = text.replace(/^﻿/, "");
  const firstLineEnd = clean.indexOf("\n");
  const delimiter = detectDelimiter(
    firstLineEnd === -1 ? clean : clean.slice(0, firstLineEnd)
  );

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && clean[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((f) => f.trim() !== "")) rows.push(row);
  }

  const headers = (rows.shift() ?? []).map((h, i) => h.trim() || `Spalte ${i + 1}`);
  return { headers, rows, delimiter };
}

/* Automatische Zuordnung: rät SKU und Namensspalte aus üblichen Bezeichnungen. */
export function guessMapping(headers: string[]): Record<number, "sku" | "name" | "attribut"> {
  const mapping: Record<number, "sku" | "name" | "attribut"> = {};
  const skuWords = ["sku", "artikelnummer", "artnr", "art-nr", "artikel-nr", "artikelnr", "nummer", "ean", "id"];
  const nameWords = ["name", "bezeichnung", "titel", "artikelname", "beschreibung kurz", "produktname"];
  let skuSet = false;
  let nameSet = false;
  headers.forEach((h, i) => {
    const low = h.toLowerCase().trim();
    if (!skuSet && skuWords.some((w) => low === w || low.startsWith(w))) {
      mapping[i] = "sku";
      skuSet = true;
    } else if (!nameSet && nameWords.some((w) => low === w || low.startsWith(w))) {
      mapping[i] = "name";
      nameSet = true;
    } else {
      mapping[i] = "attribut";
    }
  });
  if (!skuSet && headers.length > 0) mapping[0] = "sku";
  return mapping;
}
