import type { Metadata } from "next";
import { GuidePage } from "../../components/GuidePage";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  robots: { index: false },
};

/* Entwurf nach gängigem SaaS Muster, vor dem ersten zahlenden
   Kunden anwaltlich prüfen lassen. */
export default function Page() {
  return (
    <GuidePage
      label="Rechtliches"
      title="Allgemeine Geschäftsbedingungen"
      intro="Bedingungen für die Nutzung der Datalio Plattform. Das Angebot richtet sich ausschließlich an Unternehmen."
    >
      <h2>§ 1 Geltungsbereich</h2>
      <p>
        Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge
        zwischen Marius Strauss, Rüppurrer Straße 26, 76137 Karlsruhe
        (nachfolgend „Anbieter") und dem Kunden über die Nutzung der
        Softwareplattform Datalio. Das Angebot richtet sich ausschließlich an Unternehmer im
        Sinne des § 14 BGB, an juristische Personen des öffentlichen Rechts
        und an öffentlich-rechtliche Sondervermögen. Abweichende Bedingungen
        des Kunden finden keine Anwendung, es sei denn, der Anbieter stimmt
        ihnen ausdrücklich schriftlich zu.
      </p>

      <h2>§ 2 Vertragsgegenstand</h2>
      <p>
        Datalio ist eine über das Internet bereitgestellte Software (Software
        as a Service) für Product Information Management: die
        Zusammenführung, Anreicherung und Verteilung von Produktdaten. Teile
        der Anreicherung werden durch Systeme der künstlichen Intelligenz
        unterstützt. Der konkrete Funktionsumfang ergibt sich aus der
        Leistungsbeschreibung auf datalio.de zum Zeitpunkt des
        Vertragsschlusses. Die Plattform befindet sich in fortlaufender
        Weiterentwicklung; der Anbieter darf Funktionen erweitern oder
        anpassen, soweit der Vertragszweck dadurch nicht gefährdet wird.
      </p>

      <h2>§ 3 Vertragsschluss und Konto</h2>
      <p>
        Der Vertrag kommt durch die Registrierung eines Kontos und deren
        Bestätigung durch den Anbieter zustande, oder durch Annahme eines
        individuellen Angebots. Der Kunde sichert zu, dass die Registrierung
        für ein Unternehmen erfolgt und die angegebenen Daten zutreffen.
      </p>

      <h2>§ 4 Leistungsumfang und Verfügbarkeit</h2>
      <p>
        Der Anbieter stellt die Plattform mit einer im Jahresmittel
        angemessenen Verfügbarkeit bereit. Hiervon ausgenommen sind Zeiten
        geplanter Wartung, Störungen außerhalb des Einflussbereichs des
        Anbieters (etwa bei Unterauftragnehmern für Hosting) und Fälle
        höherer Gewalt. Der Anbieter darf zur Leistungserbringung
        Unterauftragnehmer einsetzen, derzeit insbesondere Vercel (Hosting)
        und Supabase (Datenbank, Serverstandort Frankfurt am Main).
      </p>

      <h2>§ 5 Entgelte und Testphase</h2>
      <p>
        Soweit eine kostenfreie Testphase vereinbart ist, endet diese
        automatisch, ohne dass es einer Kündigung bedarf; ein
        kostenpflichtiger Vertrag entsteht erst durch ausdrückliche
        Beauftragung. Entgelte richten sich nach der bei Vertragsschluss
        vereinbarten Preisübersicht beziehungsweise dem individuellen
        Angebot. Rechnungen sind 14 Tage nach Zugang ohne Abzug zahlbar.
        Alle Preise verstehen sich zuzüglich gesetzlicher Umsatzsteuer.
      </p>

      <h2>§ 6 Pflichten des Kunden</h2>
      <p>
        Der Kunde hält seine Zugangsdaten geheim und informiert den Anbieter
        unverzüglich bei Verdacht auf Missbrauch. Der Kunde stellt sicher,
        dass er an allen hochgeladenen Inhalten (Produktdaten, Texte, Bilder)
        die erforderlichen Rechte hält und dass die Inhalte keine Rechte
        Dritter und keine gesetzlichen Vorschriften verletzen. Der Kunde
        stellt den Anbieter von Ansprüchen Dritter frei, die auf einer
        Verletzung dieser Pflichten beruhen.
      </p>

      <h2>§ 7 Daten des Kunden, Export und Löschung</h2>
      <p>
        Alle vom Kunden hochgeladenen oder in der Plattform erzeugten
        Produktdaten bleiben Eigentum des Kunden. Der Anbieter nutzt sie
        ausschließlich zur Vertragserfüllung. Der Kunde kann seine Daten
        während der Vertragslaufzeit in gängigen Formaten exportieren. Nach
        Vertragsende werden die Daten des Kunden innerhalb von 90 Tagen
        gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.
        Soweit der Anbieter personenbezogene Daten im Auftrag des Kunden
        verarbeitet, schließen die Parteien auf Anforderung einen
        Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.
      </p>

      <h2>§ 8 KI gestützte Inhalte</h2>
      <p>
        Von der Plattform automatisch erzeugte Inhalte (etwa Produkttexte,
        Attributvorschläge, Übersetzungen) sind Vorschläge. Der Kunde prüft
        sie vor Veröffentlichung auf Richtigkeit, Vollständigkeit und
        rechtliche Zulässigkeit, insbesondere bei produktbezogenen
        Pflichtangaben. Eine Gewähr für die inhaltliche Richtigkeit
        automatisch erzeugter Vorschläge übernimmt der Anbieter nicht; die
        Freigabe liegt beim Kunden.
      </p>

      <h2>§ 9 Haftung</h2>
      <p>
        Der Anbieter haftet unbeschränkt bei Vorsatz und grober
        Fahrlässigkeit sowie bei Verletzung von Leben, Körper und
        Gesundheit. Bei einfacher Fahrlässigkeit haftet der Anbieter nur bei
        Verletzung wesentlicher Vertragspflichten (Pflichten, deren
        Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt
        erst ermöglicht und auf deren Einhaltung der Kunde regelmäßig
        vertrauen darf), begrenzt auf den vertragstypischen, vorhersehbaren
        Schaden. Die Haftung nach dem Produkthaftungsgesetz bleibt
        unberührt. Für Datenverlust haftet der Anbieter nur in dem Umfang,
        der auch bei ordnungsgemäßer, regelmäßiger Datensicherung durch den
        Kunden eingetreten wäre.
      </p>

      <h2>§ 10 Laufzeit und Kündigung</h2>
      <p>
        Der Vertrag läuft auf unbestimmte Zeit und kann von beiden Seiten
        mit einer Frist von einem Monat zum Monatsende gekündigt werden,
        soweit nicht individuell etwas anderes vereinbart ist. Das Recht zur
        außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
        Kündigungen bedürfen der Textform.
      </p>

      <h2>§ 11 Änderungen dieser Bedingungen</h2>
      <p>
        Der Anbieter kann diese Bedingungen mit Wirkung für die Zukunft
        ändern, soweit dies aus triftigen Gründen erforderlich ist und den
        Kunden nicht unangemessen benachteiligt. Änderungen werden dem
        Kunden mindestens sechs Wochen vor Wirksamwerden in Textform
        mitgeteilt. Widerspricht der Kunde nicht innerhalb der Frist, gelten
        die Änderungen als angenommen; auf diese Folge wird in der
        Mitteilung gesondert hingewiesen.
      </p>

      <h2>§ 12 Schlussbestimmungen</h2>
      <p>
        Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss
        des UN Kaufrechts. Gerichtsstand für alle Streitigkeiten aus diesem
        Vertrag ist Karlsruhe, soweit der Kunde Kaufmann,
        juristische Person des öffentlichen Rechts oder
        öffentlich-rechtliches Sondervermögen ist. Sollten einzelne
        Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen
        Bestimmungen unberührt.
      </p>

      <h2>Stand</h2>
      <p>Stand dieser Bedingungen: August 2026.</p>
    </GuidePage>
  );
}
