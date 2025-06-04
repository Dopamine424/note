

"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Добавляем Button
import { getTrashDocuments, restoreDocument, removeDocument } from "@/firebase/config";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Document {
  _id: string;
  title: string;
  userId: string;
  isArchived: boolean;
  isPublished: boolean;
  parentDocument?: string | null;
  icon?: string;
  content?: string;
  coverImage?: string;
}

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const [documents, setDocuments] = useState<Document[] | undefined>(undefined);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = getTrashDocuments((docs) => {
      setDocuments(docs);
    });
    return () => unsubscribe();
  }, []);

  const filteredDocuments = documents?.filter((document) =>
    document.title.toLowerCase().includes(search.toLowerCase())
  );

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: string
  ) => {
    event.stopPropagation();
    const promise = restoreDocument(documentId);

    toast.promise(promise, {
      loading: "Восстановление записки...",
      success: "Записка восстановлена",
      error: "Ошибка восстановления записки",
    });
  };

  const onRemove = (documentId: string) => {
    const promise = removeDocument(documentId);

    toast.promise(promise, {
      loading: "Удаление записки...",
      success: "Записка удалена",
      error: "Ошибка удаления записки",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  const onRemoveAll = () => {
    if (!documents) return;

    const promises = documents.map((doc) => removeDocument(doc._id));
    const promiseAll = Promise.all(promises);

    toast.promise(promiseAll, {
      loading: "Удаление всех записок...",
      success: "Все записки удалены",
      error: "Ошибка при удалении записок",
    });

    if (documents.some((doc) => doc._id === params.documentId)) {
      router.push("/documents");
    }
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Фильтровать по названию страницы"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          Документы не найдены
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, document._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
      {filteredDocuments && filteredDocuments.length > 0 && (
        <div className="p-2">
          <ConfirmModal onConfirm={onRemoveAll}>
            <Button variant="ghost" size="sm" className="w-full">
              Удалить все
            </Button>
          </ConfirmModal>
        </div>
      )}
    </div>
  );
};