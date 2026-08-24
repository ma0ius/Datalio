import { Nav } from "../components/sections/Nav";
import { Hero } from "../components/sections/Hero";
import { StatStrip } from "../components/sections/StatStrip";
import { Integrations } from "../components/sections/Integrations";
import { Problem } from "../components/sections/Problem";
import { LlmSeo } from "../components/sections/LlmSeo";
import { Solutions } from "../components/sections/Solutions";
import { Platform } from "../components/sections/Platform";
import { Workflow } from "../components/sections/Workflow";
import { DemoCta } from "../components/sections/DemoCta";
import { Faq } from "../components/sections/Faq";
import { Closing } from "../components/sections/Closing";
import { Footer } from "../components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatStrip />
        <Integrations />
        <Problem />
        <LlmSeo />
        <Solutions />
        <Platform />
        <Workflow />
        <DemoCta />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
