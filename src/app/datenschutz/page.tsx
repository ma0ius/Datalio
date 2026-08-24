import type { Metadata } from "next";
import { GuidePage } from "../../components/GuidePage";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false },
};

export default function Page() {
  return (
    <GuidePage
      label="Rechtliches"
      title="Datenschutzerklärung"
      intro="Diese Erklärung informiert darüber, welche personenbezogenen Daten beim Besuch dieser Website und bei der Nutzung der Datalio Anwendung verarbeitet werden."
    >
      <h2>1. Verantwortlicher</h2>
      <p>
        Marius Strauss, Rüppurrer Straße 26, 76137 Karlsruhe, Deutschland
        <br />
        E-Mail: kontakt@datalio.de
      </p>

      <h2>2. Hosting und Server Logdateien</h2>
      <p>
        Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
        91789, USA gehostet. Beim Aufruf der Website verarbeitet Vercel
        automatisch technisch notwendige Daten: IP Adresse, Datum und Uhrzeit
        des Zugriffs, aufgerufene Seite, Browsertyp und Betriebssystem. Diese
        Daten sind für die Auslieferung und die Absicherung der Website
        erforderlich und werden nicht mit anderen Datenquellen
        zusammengeführt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
        (berechtigtes Interesse an einem sicheren und stabilen Betrieb). Mit
        Vercel besteht ein Auftragsverarbeitungsvertrag; die Übermittlung in
        die USA erfolgt auf Grundlage der EU Standardvertragsklauseln und der
        Zertifizierung von Vercel unter dem EU-US Data Privacy Framework.
      </p>

      <h2>3. Schriftarten</h2>
      <p>
        Die verwendeten Schriftarten werden lokal von unserem eigenen Server
        ausgeliefert. Eine Verbindung zu Servern von Google oder anderen
        Schriftanbietern findet beim Besuch dieser Website nicht statt.
      </p>

      <h2>4. Cookies und Tracking</h2>
      <p>
        Diese Website setzt keine Trackingdienste, keine Analysedienste und
        keine Werbecookies ein. Bei Nutzung des Anmeldebereichs wird der
        Sitzungsstatus technisch notwendig im lokalen Speicher Ihres Browsers
        abgelegt, um Sie angemeldet zu halten (Art. 6 Abs. 1 lit. b DSGVO,
        § 25 Abs. 2 Nr. 2 TDDDG).
      </p>

      <h2>5. Registrierung und Nutzung der Datalio Anwendung</h2>
      <p>
        Wenn Sie ein Konto anlegen, verarbeiten wir Ihre E-Mail Adresse und
        ein verschlüsselt gespeichertes Passwort, dazu die von Ihnen
        hochgeladenen Produkt- und Artikeldaten. Die Verarbeitung erfolgt zur
        Erfüllung des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO). Die
        Daten werden bei Supabase gespeichert, betrieben von Supabase Inc.;
        der Serverstandort unseres Projekts ist Frankfurt am Main
        (Deutschland). Mit Supabase besteht ein Auftragsverarbeitungsvertrag.
        Ihre Daten werden gelöscht, wenn Sie Ihr Konto löschen oder der
        Vertrag endet, soweit keine gesetzlichen Aufbewahrungspflichten
        entgegenstehen.
      </p>

      <h2>6. Terminbuchung</h2>
      <p>
        Für die Buchung von Demoterminen verlinken wir auf den Dienst Cal.com
        (Cal.com, Inc., USA). Die Buchungsseite öffnet sich in einem eigenen
        Fenster; erst dort werden Daten (Name, E-Mail Adresse, gewählter
        Termin) durch Cal.com verarbeitet. Es gilt die Datenschutzerklärung
        von Cal.com. Die uns übermittelten Termindaten verarbeiten wir zur
        Vorbereitung und Durchführung des Termins (Art. 6 Abs. 1 lit. b
        DSGVO).
      </p>

      <h2>7. Kontaktaufnahme</h2>
      <p>
        Bei Kontakt per E-Mail verarbeiten wir Ihre Angaben zur Bearbeitung
        der Anfrage (Art. 6 Abs. 1 lit. b DSGVO). Unser Postfach wird bei der
        IONOS SE, Elgendorfer Str. 57, 56410 Montabaur betrieben.
      </p>

      <h2>8. Ihre Rechte</h2>
      <p>
        Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer
        personenbezogenen Daten: Auskunft (Art. 15 DSGVO), Berichtigung
        (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der
        Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO)
        und Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1
        lit. f DSGVO (Art. 21 DSGVO). Daneben besteht ein Beschwerderecht bei
        einer Datenschutzaufsichtsbehörde; zuständig für uns ist der
        Landesbeauftragte für den Datenschutz und die Informationsfreiheit
        Baden-Württemberg.
      </p>

      <h2>9. Stand</h2>
      <p>Stand dieser Erklärung: August 2026.</p>
    </GuidePage>
  );
}
