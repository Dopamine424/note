


"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { createDocument } from "@/firebase/config";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DocumentsPage = () => {
  const router = useRouter();
  const { user, isLoading } = useFirebaseAuth();

  const onCreate = async () => {
    const promise = createDocument("Untitled").then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Создание новой записки",
      success: "Новая записка добавлена",
      error: "Не получилось создать записку",
    });
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/logo.svg"
        width="200"
        height="200"
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        width="200"
        height="200"
        alt="Logo"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Добро пожаловать {user?.displayName || user?.email}
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Создать записку
      </Button>
    </div>
  );
};

export default DocumentsPage;