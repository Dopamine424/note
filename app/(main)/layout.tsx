

// "use client";

// import { Spinner } from "@/components/spinner";
// import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Navigation } from "./_components/navigation";
// import { SearchCommand } from "@/components/search-command";
// import { GraphPanel } from "./_components/graph-panel";

// const MainLayout = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, isLoading } = useFirebaseAuth();
//   const router = useRouter();
//   const [isGraphOpen, setIsGraphOpen] = useState(false);

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       router.push("/");
//     }
//   }, [isAuthenticated, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return null;
//   }

//   return (
//     <div className={`h-full flex dark:bg-[#1F1F1F] ${isGraphOpen ? "graph-open" : ""}`}>
//       <Navigation isGraphOpen={isGraphOpen} setIsGraphOpen={setIsGraphOpen} />
//       <main className="main-content flex-1 h-full overflow-y-auto">
//         <SearchCommand />
//         {children}
//       </main>
//       <GraphPanel isOpen={isGraphOpen} setIsOpen={setIsGraphOpen} />
//     </div>
//   );
// };

// export default MainLayout;


"use client";

import { Spinner } from "@/components/spinner";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navigation } from "./_components/navigation";
import { SearchCommand } from "@/components/search-command";
import { GraphPanel } from "./_components/graph-panel";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useFirebaseAuth();
  const router = useRouter();
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [graphPanelWidth, setGraphPanelWidth] = useState(256);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--graph-panel-width",
      `${graphPanelWidth / 16}rem`
    );
  }, [graphPanelWidth]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`h-full flex dark:bg-[#1F1F1F] ${isGraphOpen ? "graph-open" : ""}`}>
      <Navigation isGraphOpen={isGraphOpen} setIsGraphOpen={setIsGraphOpen} />
      <main className="main-content flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
      <GraphPanel
        isOpen={isGraphOpen}
        setIsOpen={setIsGraphOpen}
        setGraphPanelWidth={setGraphPanelWidth}
      />
    </div>
  );
};

export default MainLayout;