"use client";

import Image from "next/image";
import { useInView } from "@/hooks/use-in-view";

export const WireframesSection = () => {
  const text =
    "Следующий этап — создание варфреймов, low-fi прототипов интерфейса. Они задают структуру и логику, помогая продумать элементы и пользовательский путь.";

  const { ref, isInView } = useInView();

  return (
    <div className="flex flex-col items-center justify-center gap-y-8 px-6 py-16 bg-white dark:bg-[#1F1F1F]">
      <h2 className="text-xl font-medium text-gray-400 dark:text-gray-400 max-w-7xl w-full">
        Wireframes
      </h2>
      <div
        ref={ref}
        className={`max-w-7xl text-2xl md:text-2xl lg:text-2xl font-medium text-gray-900 dark:text-gray-100 transition-opacity duration-1000 delay-100 ease-out will-change-opacity ${
          isInView ? "opacity-100" : "opacity-0"
        }`}
      >
        {text}
      </div>
      <Image
        src="/images/wireframes.png"
        alt="Варфреймы интерфейса Notes"
        width={1280}
        height={720}
        loading="eager"
        className="w-full max-w-7xl rounded-lg shadow-md"
      />
    </div>
  );
};