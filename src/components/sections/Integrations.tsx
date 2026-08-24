import { Marquee } from "../fx/Marquee";

const systems = [
  "Shopware",
  "JTL",
  "Shopify",
  "Amazon",
  "OTTO",
  "Kaufland",
  "eBay",
  "idealo",
  "Magento",
  "WooCommerce",
  "weclapp",
  "xentral",
  "Odoo",
  "BMEcat",
  "DATANORM",
];

export function Integrations() {
  return (
    <section className="border-b-2 border-ink bg-ground py-10">
      <p className="dl-label mb-6 text-center text-steel-500">
        Angebunden an die Systeme, mit denen Sie arbeiten
      </p>
      <Marquee duration={45}>
        {systems.map((s) => (
          <span
            key={s}
            className="mx-8 whitespace-nowrap font-mono text-[15px] font-medium text-steel-600"
          >
            {s}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
