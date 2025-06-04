

"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getSidebarDocuments, createDocument, archiveDocument } from "@/firebase/config";
import { Item } from "./item";
import { toast } from "sonner";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Document {
  _id: string;
  title: string;
  userId: string;
  isArchived: boolean;
  isPublished: boolean;
  parentDocument?: string | null;
  icon?: string;
  order?: number;
}

interface DocumentListProps {
  parentDocumentId?: string;
  level?: number;
  data?: Document[];
}

export const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initialExpanded: Record<string, boolean> = {};
    if (params.documentId) {
      initialExpanded[params.documentId as string] = true;
    }
    return initialExpanded;
  });

  useEffect(() => {
    const unsubscribe = getSidebarDocuments((docs) => {
      const sortedDocs = [...docs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      console.log("DocumentList: Setting documents", {
        parentDocumentId,
        count: sortedDocs.length,
        documents: sortedDocs.map((d) => ({ _id: d._id, title: d.title, order: d.order })),
      });
      setDocuments(sortedDocs);
    }, parentDocumentId);
    return () => unsubscribe();
  }, [parentDocumentId]);

  const handleExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const handleClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const handleCreate = (documentId: string) => {
    const promise = createDocument("Untitled", documentId).then((newDocumentId) => {
      if (!expanded[documentId]) {
        handleExpand(documentId);
      }
      router.push(`/documents/${newDocumentId}`);
    });

    toast.promise(promise, {
      loading: "Создание новой записки",
      success: "Новая записка добавлена",
      error: "Ошибка создания записки",
    });
  };

  const handleArchive = (documentId: string) => {
    const promise = archiveDocument(documentId).then(() => router.push("/documents"));

    toast.promise(promise, {
      loading: "Перенос в корзину...",
      success: "Записка перенесена в корзину",
      error: "Не получилось удалить записку",
    });
  };

  console.log("DocumentList: Rendering", { documents, parentDocumentId });

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {!documents.length && !parentDocumentId && (
          <p className="px-3 text-sm text-muted-foreground">Нет заметок</p>
        )}
        {documents.map((document) => (
          <div key={document._id}>
            <Item
              id={document._id}
              label={document.title}
              level={level}
              documentIcon={document.icon}
              active={params.documentId === document._id}
              expended={expanded[document._id]}
              onExpend={() => handleExpand(document._id)}
              onClick={() => handleClick(document._id)}
              onCreate={() => handleCreate(document._id)}
              onArchive={() => handleArchive(document._id)}
              parentDocumentId={parentDocumentId}
            />
            {expanded[document._id] && (
              <DocumentList parentDocumentId={document._id} level={level + 1} />
            )}
          </div>
        ))}
      </div>
    </DndProvider>
  );
};