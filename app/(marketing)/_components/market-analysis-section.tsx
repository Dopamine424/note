"use client";

import { useInView } from "@/hooks/use-in-view";

export const MarketAnalysisSection = () => {
  const introText =
    "Для анализа рынка были выбраны следующие приложения для заметок: Notion, Evernote, Google Keep и Microsoft OneNote.";
  const conclusionText =
    "Анализ показал, что рынок перенасыщен многофункциональными решениями (Notion, OneNote), которые часто жертвуют простотой ради универсальности, и минималистичными инструментами (Google Keep), которым не хватает глубины. Evernote, как бывший лидер, теряет позиции из-за устаревшего подхода. На фоне ухода Notion из некоторых регионов (например, России) и ограничений других сервисов, Notes имеет потенциал стать хорошей заменой, если сосредоточиться на балансе между простотой, функциональностью и доступностью.";

  const apps = [
    {
      name: "Notion",
      advantages:
        "Универсальность (заметки, базы данных, управление проектами), гибкость в настройке, поддержка совместной работы.",
      disadvantages: "Высокая сложность для новых пользователей, перегруженный интерфейс.",
      insights:
        "Notion отлично подходит для команд и сложных проектов, но для простых заметок его функционал избыточен, а кривая обучения отпугивает новичков.",
    },
    {
      name: "Evernote",
      advantages:
        "Мощный поиск (включая текст на изображениях), поддержка мультимедиа, система тегов.",
      disadvantages:
        "Ограничения бесплатной версии (два устройства, 60 МБ/месяц), устаревший интерфейс, высокая стоимость подписки.",
      insights:
        "Evernote теряет популярность из-за ценовой политики и недостаточной адаптации к современным UX-трендам, что открывает нишу для более доступных решений.",
    },
    {
      name: "Google Keep",
      advantages:
        "Простота, интеграция с Google-экосистемой, быстрый доступ, цветовые метки.",
      disadvantages:
        "Нет вложенности заметок, ограниченные возможности форматирования, слабая поддержка десктопного опыта.",
      insights:
        "Google Keep хорош для быстрых заметок, но не подходит для долгосрочного хранения или сложной организации.",
    },
    {
      name: "Microsoft OneNote",
      advantages:
        "Бесплатность, интеграция с Office 365, поддержка рукописного ввода, структура блокнотов.",
      disadvantages:
        "Перегруженный интерфейс, медленная синхронизация на некоторых устройствах, избыточность для простых задач.",
      insights:
        "OneNote выигрывает у конкурентов бесплатностью, но его сложность и тяжеловесность отталкивают пользователей, ищущих минимализм.",
    },
  ];

  const { ref: introRef, isInView: isIntroInView } = useInView();
  const { ref: conclusionRef, isInView: isConclusionInView } = useInView();

  return (
    <div className="flex flex-col items-center justify-center gap-y-8 px-6 py-16 bg-white dark:bg-[#1F1F1F]">
      <h2 className="text-xl font-medium text-gray-400 dark:text-gray-400 max-w-7xl w-full">
        Анализ конкурентов
      </h2>
      <div
        ref={introRef}
        className={`max-w-7xl text-4xl md:text-4xl lg:text-4xl font-medium text-gray-900 dark:text-gray-100 transition-opacity duration-800 ease-out ${
          isIntroInView ? "opacity-100" : "opacity-0"
        }`}
      >
        {introText}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {apps.map((app) => (
          <div
            key={app.name}
            className="bg-gray-50 dark:bg-[#2A2A2A] rounded-lg shadow-md p-6 flex flex-col gap-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {app.name}
            </h3>
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Преимущества:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {app.advantages}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Недостатки:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {app.disadvantages}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Инсайты:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {app.insights}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        ref={conclusionRef}
        className={`max-w-7xl text-2xl md:text-2xl lg:text-2xl font-medium text-gray-900 dark:text-gray-100 transition-opacity duration-800 ease-out ${
          isConclusionInView ? "opacity-100" : "opacity-0"
        }`}
      >
        {conclusionText}
      </div>
    </div>
  );
};

