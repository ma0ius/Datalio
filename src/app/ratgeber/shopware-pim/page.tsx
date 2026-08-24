import type { Metadata } from "next";
import { GuidePage } from "../../../components/GuidePage";

export const metadata: Metadata = {
  title: "PIM für Shopware 6: Produktdaten zentral pflegen",
  description:
    "Wann Shopware 6 ein PIM braucht: Grenzen der Produktpflege im Shopadmin, Arbeitsteilung zwischen Shop und PIM und wie Datalio Shopware Kataloge mit KI anreichert.",
};

export default function Page() {
  return (
    <GuidePage
      label="Ratgeber"
      title="PIM für Shopware 6"
      intro="Shopware 6 ist ein starkes Schaufenster: Storefront, Checkout, Erlebniswelten. Die Produktpflege im Adminbereich ist aber auf einzelne Artikel ausgelegt, nicht auf tausende. Diese Seite zeigt, wann ein PIM die Shopware Pflege ablöst und wie die Arbeitsteilung aussieht."
    >
      <h2>Die Grenzen der Pflege im Shopware Admin</h2>
      <p>
        Wer 50 Artikel verkauft, pflegt sie bequem direkt in Shopware. Ab
        einigen hundert Artikeln kippt das: Massenänderungen über Eigenschaften
        hinweg sind mühsam, Vollständigkeit ist nicht prüfbar, Lieferantendaten
        müssen von Hand übertragen werden, und sobald ein zweiter Kanal oder
        eine zweite Sprache dazukommt, wird jede Änderung zur Mehrfacharbeit.
      </p>
      <ul>
        <li>Keine Vollständigkeitsprüfung: niemand sieht, welchen Artikeln Bilder, Attribute oder Texte fehlen.</li>
        <li>Kein Freigabeprozess: Änderungen gehen direkt live.</li>
        <li>Kein Lieferantenimport: Excel Listen werden abgetippt oder über Einzelplugins gequetscht.</li>
        <li>Varianten und Eigenschaften: strukturelle Änderungen an vielen Artikeln gleichzeitig sind kaum machbar.</li>
      </ul>
      <h2>Arbeitsteilung: Shopware verkauft, das PIM pflegt</h2>
      <p>
        Mit einem PIM davor wird Shopware zu dem, was es am besten kann: dem
        Verkaufskanal. Die Inhalte entstehen im PIM, werden dort geprüft und
        landen fertig im Shop:
      </p>
      <ul>
        <li><strong>Import:</strong> Lieferantenlisten, ERP Stamm und Bestandsdaten laufen im PIM zusammen, ein Datensatz je Artikel.</li>
        <li><strong>Anreicherung:</strong> KI ergänzt Attribute, schreibt SEO Texte in mehreren Sprachen, ordnet Kategorien zu. Freigabe bleibt beim Team.</li>
        <li><strong>Synchronisation:</strong> Freigegebene Inhalte gehen automatisch nach Shopware, auf Wunsch parallel zu Amazon, OTTO und in den Katalog.</li>
      </ul>
      <h2>Worauf Shopware Betreiber bei der PIM Wahl achten sollten</h2>
      <p>
        Drei Punkte entscheiden in der Praxis: Erstens die Tiefe der Shopware
        Anbindung, also ob Eigenschaften, Varianten, Erlebniswelten Felder und
        mehrere Verkaufskanäle sauber ankommen. Zweitens der Umgang mit
        Sprachen, weil Shopware Übersetzungen je Verkaufskanal erwartet.
        Drittens die Frage, wer die Daten füllt: ein PIM ohne Anreicherung
        verlagert die Tipparbeit nur in ein anderes System.
      </p>
      <p>
        Datalio setzt genau dort an: die KI Anreicherung füllt den Katalog,
        Ihr Team gibt frei, die Shopware Synchronisation hält den Shop
        aktuell. Aus dem Adminbereich wird ein Schaufenster, nicht länger eine
        Werkbank.
      </p>
    </GuidePage>
  );
}
