import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "../index.css";

/* Schriften werden beim Build heruntergeladen und von der eigenen Domain
   ausgeliefert. Es findet keine Verbindung zu Google Servern statt. */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

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
    <html lang="de" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
