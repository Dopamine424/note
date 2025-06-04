"use client";

import Image from "next/image";
import { useInView } from "@/hooks/use-in-view";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const TechStackSection = () => {
  const logoText =
    "Логотип Notes — стилизованная буква 'N' в виде росчерка пера, символизирует простоту, элегантность и связь с традицией записи заметок. Минималистичный дизайн подчёркивает удобство приложения и его запоминаемость.";

  const shadcnText =
    "Интерфейс Notes создан на основе shadcn — библиотеки UI-компонентов, которая обеспечила консистентный и современный дизайн. Это позволило сосредоточиться на UX, минимизировав время на кастомизацию.";

  const techText =
    "Notes разработан с использованием Next.js, Firebase, BlockNote, EdgeStore и Zustand. Эти технологии и библиотеки выбраны за надёжность и эффективность, обеспечивая быстрый отклик, оффлайн-доступ и удобное управление состоянием.";

  const techStack = [
    {
      name: "Next.js",
      logo: "/images/nextjs.png",
      description: "Фреймворк для быстрого рендеринга и SEO-оптимизации страниц.",
    },
    {
      name: "Firebase",
      logo: "/images/firebase.png",
      description: "Платформа для авторизации, хранения данных и синхронизации в реальном времени.",
    },
    {
      name: "BlockNote",
      logo: "/images/blocknote.png",
      description: "Лёгкий редактор для форматирования заметок с поддержкой блоков.",
    },
    {
      name: "shadcn",
      logo: "/images/shadcn.png",
      description: "UI-компоненты для создания стильного и доступного интерфейса.",
    },
    {
      name: "EdgeStore",
      logo: "/images/edgestore.png",
      description: "Сервис для надёжного хранения и управления файлами пользователей.",
    },
    {
      name: "Zustand",
      logo: "/images/zustand.png",
      description: "Библиотека для простого и эффективного управления состоянием UI.",
    },
  ];

  // Слайдер
  const logoImages = [
    { src: "/images/logo1.png", alt: "Логотип Notes — монохром" },
    { src: "/images/logo2.png", alt: "Логотип Notes — цветной" },
    { src: "/images/logo3.png", alt: "Логотип Notes — в контексте" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Автопрокрутка
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % logoImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [logoImages.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + logoImages.length) % logoImages.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % logoImages.length);
  };

  const { ref: logoRef, isInView: isLogoInView } = useInView();
  const { ref: shadcnRef, isInView: isShadcnInView } = useInView();
  const { ref: techRef, isInView: isTechInView } = useInView();
  const { ref: cardsRef, isInView: isCardsInView } = useInView();

  return (
    <div className="flex flex-col items-center justify-center gap-y-8 px-6 py-16 bg-white dark:bg-[#1F1F1F]">
      <h2 className="text-xl font-medium text-gray-400 dark:text-gray-400 max-w-7xl w-full">
        Дизайн и технологии
      </h2>
      <div
        ref={logoRef}
        className={`max-w-7xl text-2xl md:text-2xl lg:text-2xl font-medium text-gray-900 dark:text-gray-100 transition-opacity duration-800 ease-out will-change-opacity ${
          isLogoInView ? "opacity-100" : "opacity-0"
        }`}
      >
        {logoText}
      </div>
      <div className="relative w-full max-w-7xl">
        <Image
          src={logoImages[currentSlide].src}
          alt={logoImages[currentSlide].alt}
          width={1280}
          height={720}
          loading="eager"
          className="w-full rounded-lg shadow-md"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-100/50 dark:bg-gray-900/50 hover:bg-gray-100/70 dark:hover:bg-gray-900/70 text-gray-900 dark:text-gray-100 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-100/50 dark:bg-gray-900/50 hover:bg-gray-100/70 dark:hover:bg-gray-900/70 text-gray-900 dark:text-gray-100 rounded-full"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <div
        ref={shadcnRef}
        className={`max-w-7xl text-2xl md:text-2xl lg:text-2xl font-medium text-gray-900 dark:text-gray-100 transition-opacity duration-800 ease-out will-change-opacity ${
          isShadcnInView ? "opacity-100" : "opacity-0"
        }`}
      >
        {shadcnText}
      </div>
      <Image
        src="/images/ui.png"
        alt="Интерфейс Notes"
        width={1280}
        height={720}
        loading="eager"
        className="w-full max-w-7xl rounded-lg shadow-md"
      />
      <div
        ref={techRef}
        className={`max-w-7xl text-2xl md:text-2xl lg:text-2xl font-medium text-gray-900 dark:text-gray-100 transition-opacity duration-800 ease-out will-change-opacity ${
          isTechInView ? "opacity-100" : "opacity-0"
        }`}
      >
        {techText}
      </div>
      <div
        ref={cardsRef}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full transition-opacity duration-800 ease-out will-change-opacity ${
          isCardsInView ? "opacity-100" : "opacity-0"
        }`}
      >
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="bg-gray-50 dark:bg-[#2A2A2A] rounded-lg shadow-md p-6 flex flex-col items-center gap-y-4"
          >
            <Image
              src={tech.logo}
              alt={`Логотип ${tech.name}`}
              width={80}
              height={80}
              loading="eager"
              className="w-20 h-20 object-contain"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {tech.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {tech.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};