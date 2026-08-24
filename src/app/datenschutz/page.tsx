import type { Metadata } from "next";
import { GuidePage } from "../../components/GuidePage";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false },
};

/* PLATZHALTER: vor Veröffentlichung prüfen und vervollständigen (DSGVO). */
export default function Page() {
  return (
    <GuidePage
      label="Rechtliches"
      title="Datenschutzerklärung"
      intro="Informationen zur Verarbeitung personenbezogener Daten auf dieser Website."
    >
      <h2>Verantwortlicher</h2>
      <p>[Vor- und Nachname / Firma, Anschrift, E-Mail: kontakt@datalio.de]</p>
      <h2>Hosting</h2>
      <p>
        Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
        91789, USA gehostet. Beim Aufruf der Website verarbeitet Vercel
        technisch notwendige Daten (IP Adresse, Zeitpunkt, abgerufene Seite)
        zur Auslieferung und Absicherung des Dienstes. Rechtsgrundlage ist
        Art. 6 Abs. 1 lit. f DSGVO.
      </p>
      <h2>Schriftarten</h2>
      <p>
        Die Website bindet Schriftarten von Google Fonts ein. Dabei wird Ihre
        IP Adresse an Google übertragen. [Vor Veröffentlichung: Schriften
        lokal einbinden oder Hinweis vervollständigen.]
      </p>
      <h2>Kontaktaufnahme</h2>
      <p>
        Bei Kontakt per E-Mail werden Ihre Angaben zur Bearbeitung der Anfrage
        gespeichert (Art. 6 Abs. 1 lit. b DSGVO).
      </p>
      <h2>Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
        Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch
        sowie ein Beschwerderecht bei einer Aufsichtsbehörde.
      </p>
    </GuidePage>
  );
}
