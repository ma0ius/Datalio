import type { Metadata } from "next";
import { GuidePage } from "../../../components/GuidePage";

export const metadata: Metadata = {
  title: "Was ist ein PIM? Product Information Management erklärt",
  description:
    "Was ein PIM System ist, wann sich die Einführung lohnt und wie sich PIM von ERP und Shopsystem unterscheidet. Erklärt für Händler und Hersteller im Mittelstand.",
};

export default function Page() {
  return (
    <GuidePage
      label="Ratgeber"
      title="Was ist ein PIM?"
      intro="PIM steht für Product Information Management: ein System, das alle Produktdaten an einem Ort pflegt und von dort in Shop, Marktplatz und Katalog verteilt. Diese Seite erklärt, was ein PIM leistet, wie es sich von ERP und Shopsystem unterscheidet und woran Sie erkennen, dass Sie eines brauchen."
    >
      <h2>Das Problem, das ein PIM löst</h2>
      <p>
        Produktdaten entstehen selten an einem Ort. Der Lieferant schickt eine
        Excel Liste, das ERP kennt Preise und Bestände, im Shop liegen Texte und
        Bilder, und der Katalog hat noch einmal eigene Beschreibungen. Sobald
        sich etwas ändert, muss dieselbe Information an mehreren Stellen
        angefasst werden. Bei 100 Artikeln ist das lästig, bei 10.000 Artikeln
        ist es ein Vollzeitjob mit Fehlergarantie.
      </p>
      <p>
        Ein PIM dreht das um: <strong>ein Datensatz je Artikel</strong>, gepflegt
        an einer Stelle, publiziert in jeden Kanal. Ändert sich ein Attribut,
        ändert es sich überall.
      </p>
      <h2>PIM, ERP, Shopsystem: wer macht was?</h2>
      <p>
        Die drei Systeme werden oft verwechselt, weil alle drei Artikel kennen.
        Sie beantworten aber verschiedene Fragen:
      </p>
      <div className="guide-table">
        <table>
          <thead>
            <tr>
              <th>System</th>
              <th>Kernfrage</th>
              <th>Typische Daten</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>ERP / Warenwirtschaft</strong></td>
              <td>Was besitze ich, was kostet es?</td>
              <td>Bestände, Einkaufspreise, Lieferanten, Aufträge</td>
            </tr>
            <tr>
              <td><strong>PIM</strong></td>
              <td>Wie beschreibe ich es, wo verkaufe ich es?</td>
              <td>Attribute, Texte, Bilder, Übersetzungen, Kanalzuordnung</td>
            </tr>
            <tr>
              <td><strong>Shopsystem</strong></td>
              <td>Wie kauft der Kunde?</td>
              <td>Warenkorb, Checkout, Kundenkonten</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Das PIM ersetzt weder ERP noch Shop. Es sitzt dazwischen: es nimmt
        Rohdaten aus ERP und Lieferantenlisten auf, macht daraus vollständige,
        verkaufsfertige Produktinformationen und liefert sie an Shop,
        Marktplatz und Katalog aus.
      </p>
      <h2>Woran Sie erkennen, dass Sie ein PIM brauchen</h2>
      <ul>
        <li>Produktdaten werden in Excel gepflegt und per Copy and Paste in den Shop übertragen.</li>
        <li>Neue Produkte brauchen Wochen, bis sie online stehen.</li>
        <li>Derselbe Artikel hat in Shop, Marktplatz und Katalog unterschiedliche Beschreibungen.</li>
        <li>Retouren entstehen, weil Maße oder Spezifikationen falsch waren.</li>
        <li>Mehr als ein Verkaufskanal, mehr als eine Sprache, mehr als tausend Artikel: sobald zwei davon zutreffen, rechnet sich ein PIM fast immer.</li>
      </ul>
      <h2>Was ein modernes PIM zusätzlich kann</h2>
      <p>
        Klassische PIM Systeme verwalten Daten, die Pflege bleibt Handarbeit.
        Neuere Systeme wie Datalio ergänzen den Schritt davor: KI liest
        Lieferantenlisten ein, ordnet Spalten zu, füllt fehlende Attribute,
        schreibt Produkttexte und übersetzt sie. Ihr Team prüft und gibt frei,
        statt zu tippen. Aus 20 Minuten Pflege pro Artikel werden unter einer
        Minute Kontrolle.
      </p>
      <p>
        Ein zweiter neuer Aspekt ist die Sichtbarkeit in KI Suchen: ChatGPT,
        Gemini und Perplexity empfehlen Produkte auf Basis strukturierter
        Daten. Vollständige, maschinenlesbare Produktinformationen sind damit
        nicht mehr nur eine Frage der Conversion im eigenen Shop, sondern
        entscheiden, ob ein Produkt in KI Antworten überhaupt vorkommt.
      </p>
    </GuidePage>
  );
}
