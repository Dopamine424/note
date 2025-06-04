"use client";

import Image from "next/image";
import { useInView } from "@/hooks/use-in-view";

export const ArchitectureSection = () => {
  const introText =
    "Следующий этап — разработка информационной архитектуры и пользовательского пути (User Flow), которые легли в основу удобного и интуитивного опыта использования Notes.";

  const { ref, isInView } = useInView();

  return (
    <div className="flex flex-col items-center justify-center gap-y-8 px-6 py-16 bg-white dark:bg-[#1F1F1F]">
      <h2 className="text-xl font-medium text-gray-400 dark:text-gray-400 max-w-7xl w-full">
        Информационная архитектура и user flow
      </h2>
      <div
        ref={ref}
        className={`max-w-7xl text-4xl md:text-4xl lg:text-4xl font-medium text-gray-900 dark:text-gray-100 transition-opacity duration-800 ease-out ${
          isInView ? "opacity-100" : "opacity-0"
        }`}
      >
        {introText}
      </div>
      <div className="flex flex-col gap-y-8 w-full max-w-7xl">
        <Image
          src="/images/architecture.png"
          alt="Информационная архитектура Notes"
          width={1280}
          height={720}
          loading="eager"
          className="w-full max-w-7xl rounded-lg shadow-md"
        />
        <Image
          src="/images/flow.png"
          alt="Пользовательский путь (User Flow) Notes"
          width={1280}
          height={720}
          loading="eager"
          className="w-full max-w-7xl rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};