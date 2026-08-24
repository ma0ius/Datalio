import type { MetadataRoute } from "next";

const base = "https://datalio.de";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/ratgeber/was-ist-ein-pim",
    "/ratgeber/pim-vergleich-2026",
    "/ratgeber/jtl-pim",
    "/ratgeber/shopware-pim",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
