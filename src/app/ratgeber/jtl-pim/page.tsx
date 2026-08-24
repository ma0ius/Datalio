import type { Metadata } from "next";
import { GuidePage } from "../../../components/GuidePage";

export const metadata: Metadata = {
  title: "PIM für JTL: Produktdaten für JTL Wawi und JTL Shop",
  description:
    "Warum JTL Händler ein PIM ergänzen: Grenzen der Artikelpflege in JTL Wawi, was ein PIM übernimmt und wie Datalio Produktdaten für JTL Shop und Marktplätze anreichert.",
};

export default function Page() {
  return (
    <GuidePage
      label="Ratgeber"
      title="PIM für JTL"
      intro="JTL Wawi ist im deutschen Onlinehandel der Standard für Bestände, Preise und Aufträge. Bei Produktinhalten stößt die Artikelpflege aber an Grenzen: Texte, Attribute und Übersetzungen bleiben Handarbeit. Diese Seite zeigt, wo ein PIM die JTL Landschaft ergänzt."
    >
      <h2>Was JTL gut kann, und was nicht</h2>
      <p>
        JTL Wawi führt Artikel als wirtschaftliche Objekte: Einkaufspreis,
        Bestand, Lieferant, Auftragsabwicklung. Dafür ist sie gebaut, und das
        kann sie. Produktinhalte sind dort aber Felder, keine Werkstatt: es
        gibt keinen Freigabeprozess für Texte, keine Vollständigkeitsprüfung
        je Kanal, keine automatische Anreicherung aus Lieferantendaten und
        keine Übersetzungsverwaltung über Sprachen hinweg.
      </p>
      <p>
        In der Praxis heißt das: die Wawi weiß, dass Artikel 4711 existiert
        und was er kostet. Ob seine Produktseite verkauft, entscheidet sich
        woanders.
      </p>
      <h2>Arbeitsteilung: JTL führt Bestände, das PIM führt Inhalte</h2>
      <div className="guide-table">
        <table>
          <thead>
            <tr>
              <th>Aufgabe</th>
              <th>JTL Wawi</th>
              <th>PIM</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bestände, Preise, Aufträge</td>
              <td>führend</td>
              <td>liest mit</td>
            </tr>
            <tr>
              <td>Attribute, Texte, Bilderzuordnung</td>
              <td>Ablage</td>
              <td>führend, mit KI Anreicherung</td>
            </tr>
            <tr>
              <td>Übersetzungen</td>
              <td>manuell je Feld</td>
              <td>automatisch, mit Freigabe</td>
            </tr>
            <tr>
              <td>Vollständigkeit je Kanal</td>
              <td>nicht vorgesehen</td>
              <td>Kernfunktion</td>
            </tr>
            <tr>
              <td>Marktplatz Inhalte (Amazon, OTTO, Kaufland)</td>
              <td>über Anbindungen</td>
              <td>liefert kanalfertige Daten zu</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>So arbeitet Datalio mit JTL</h2>
      <ul>
        <li><strong>Import:</strong> Artikelstamm aus JTL Wawi, dazu Lieferantenlisten als CSV oder Excel. Datalio führt beides zu einem Datensatz je Artikel zusammen.</li>
        <li><strong>Anreicherung:</strong> KI füllt fehlende Attribute, schreibt SEO Texte und übersetzt sie. Ihr Team gibt frei, nichts geht ungeprüft raus.</li>
        <li><strong>Rückspielung:</strong> Fertige Inhalte gehen zurück in die JTL Welt und in weitere Kanäle, vom JTL Shop bis zum Amazon Feed.</li>
      </ul>
      <p>
        Bestände und Preise bleiben dabei unangetastet in der Wawi. Das PIM
        ergänzt die Inhaltsebene, es ersetzt kein Stück Ihrer JTL
        Infrastruktur.
      </p>
      <h2>Für wen sich das rechnet</h2>
      <p>
        Die Rechnung ist einfach: bei manueller Pflege kostet ein Artikel rund
        20 Minuten, mit Anreicherung und Freigabe unter einer Minute. Ab
        einigen hundert Artikeln pro Jahr, mehreren Kanälen oder einer zweiten
        Sprache übersteigt die eingesparte Zeit die Kosten eines PIM deutlich.
      </p>
    </GuidePage>
  );
}
