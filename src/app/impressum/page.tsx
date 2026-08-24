import type { Metadata } from "next";
import { GuidePage } from "../../components/GuidePage";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

/* PLATZHALTER: vor Veröffentlichung mit echten Angaben füllen (§ 5 DDG). */
export default function Page() {
  return (
    <GuidePage
      label="Rechtliches"
      title="Impressum"
      intro="Angaben gemäß § 5 DDG."
    >
      <h2>Anbieter</h2>
      <p>
        [Vor- und Nachname / Firma]
        <br />
        [Straße und Hausnummer]
        <br />
        [PLZ und Ort]
      </p>
      <h2>Kontakt</h2>
      <p>E-Mail: kontakt@datalio.de</p>
      <h2>Verantwortlich für den Inhalt</h2>
      <p>[Vor- und Nachname, Anschrift wie oben]</p>
    </GuidePage>
  );
}
