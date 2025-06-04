"use client";

import { ArchitectureSection } from "./_components/architecture-section";
import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";
import { MarketAnalysisSection } from "./_components/market-analysis-section";
import { NotesSection } from "./_components/notes-section";
import { TechStackSection } from "./_components/tech-stack-section";
import { WireframesSection } from "./_components/wireframes-section";

const MarketingPage = () => {
  return (
    <div className="pt-60 flex-col">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 px-6 pt-10">
        <Heading />
      </div>
      <div className="pt-80 pb-80 dark:bg-[#1F1F1F]">
        <NotesSection/>
        <MarketAnalysisSection/>
        <ArchitectureSection/>
        <WireframesSection/>
        <TechStackSection/>
      </div>
    </div>
  );
};

export default MarketingPage;