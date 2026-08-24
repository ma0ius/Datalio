import type { Metadata } from "next";
import { GuidePage } from "../../components/GuidePage";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

/* PLATZHALTER in eckigen Klammern vor Veröffentlichung füllen. */
export default function Page() {
  return (
    <GuidePage
      label="Rechtliches"
      title="Impressum"
      intro="Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)."
    >
      <h2>Anbieter</h2>
      <p>
        [Vor- und Nachname bzw. Firma mit Rechtsform]
        <br />
        [Straße und Hausnummer]
        <br />
        [PLZ] [Ort]
        <br />
        Deutschland
      </p>
      <h2>Kontakt</h2>
      <p>
        E-Mail: kontakt@datalio.de
        <br />
        [Telefonnummer, optional aber empfohlen]
      </p>
      <h2>Umsatzsteuer</h2>
      <p>
        [Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE…, falls
        vorhanden. Andernfalls diesen Abschnitt entfernen.]
      </p>
      <h2>Verantwortlich für redaktionelle Inhalte</h2>
      <p>
        Gemäß § 18 Abs. 2 MStV: [Vor- und Nachname], Anschrift wie oben.
      </p>
      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Das Angebot von Datalio richtet sich ausschließlich an Unternehmen.
        Zur Teilnahme an einem Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle sind wir nicht verpflichtet und nicht
        bereit.
      </p>
    </GuidePage>
  );
}
