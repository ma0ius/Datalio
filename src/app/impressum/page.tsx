import type { Metadata } from "next";
import { GuidePage } from "../../components/GuidePage";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

export default function Page() {
  return (
    <GuidePage
      label="Rechtliches"
      title="Impressum"
      intro="Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)."
    >
      <h2>Anbieter</h2>
      <p>
        Marius Strauss
        <br />
        Rüppurrer Straße 26
        <br />
        76137 Karlsruhe
        <br />
        Deutschland
      </p>
      <h2>Kontakt</h2>
      <p>E-Mail: kontakt@datalio.de</p>
      <h2>Verantwortlich für redaktionelle Inhalte</h2>
      <p>Gemäß § 18 Abs. 2 MStV: Marius Strauss, Anschrift wie oben.</p>
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
