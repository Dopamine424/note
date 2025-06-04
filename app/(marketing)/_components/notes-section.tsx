"use client";

import ScrollReveal from "./scroll-reveal";
import Image from "next/image";

export const NotesSection = () => {
  const text =
    "Notes — адаптивное приложение для заметок, созданное для удобной организации информации. Работает на любых устройствах — от мобильных до десктопных.";

  return (
    <div className="flex flex-col items-center justify-center gap-y-8 px-6 py-16 bg-white dark:bg-[#1F1F1F]">
      <ScrollReveal
        animationDuration={1.5}
        ease="power4.out"
        scrollStart="top bottom"
        scrollEnd="center top"
        stagger={0.02}
        containerClassName="max-w-7xl"
        textClassName="text-4xl md:text-4xl lg:text-4xl font-medium text-gray-900 dark:text-gray-100"
      >
        {text}
      </ScrollReveal>
      <Image
        src="/images/adaptive.png"
        alt="Адаптивность Notes"
        width={1280}
        height={720} 
        className="w-full max-w-7xl rounded-lg shadow-md"
      />
    </div>
  );
};