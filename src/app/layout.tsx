import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://datalio.de"),
  title: {
    default: "datalio — Ein Datensatz. Alle Kanäle.",
    template: "%s · datalio",
  },
  description:
    "Datalio ist das Product Information Management für den Mittelstand: Artikeldaten aus ERP und Lieferantenlisten zusammenführen, mit KI anreichern und in Shop, Marktplatz und Katalog publizieren.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
