
"use client";

import { useState, useEffect } from "react";
import { useTags } from "@/hooks/use-tags";
import { Item } from "./item";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, Document, auth, removeTagFromDocument, deleteTag } from "@/firebase/config";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface TagListProps {
  level?: number;
}

export const TagList = ({ level = 0 }: TagListProps) => {
  const { tags, fetchTags } = useTags();
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleExpand = (tagId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [tagId]: !prev[tagId],
    }));
  };

  const handleClick = (tagId: string) => {
    handleExpand(tagId);
  };

  const handleArchive = (tagId: string) => {
    const promise = deleteTag(tagId).then(() => {
      fetchTags(); // Обновляем список тегов
    });
    toast.promise(promise, {
      loading: "Удаление тега...",
      success: "Тег удалён",
      error: "Не удалось удалить тег",
    });
  };

  return (
    <div>
      {tags.length === 0 ? (
        <p className="px-3 text-sm text-muted-foreground">Теги отсутствуют</p>
      ) : (
        tags.map((tag) => (
          <div key={tag.id}>
            <Item
              id={tag.id}
              label={tag.name}
              documentIcon={
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
              }
              level={level}
              onClick={() => handleClick(tag.id)}
              onExpend={() => handleExpand(tag.id)}
              expended={expanded[tag.id]}
              onArchive={() => handleArchive(tag.id)}
            />
            {expanded[tag.id] && (
              <TagDocuments tagId={tag.id} level={level + 1} />
            )}
          </div>
        ))
      )}
    </div>
  );
};

interface TagDocumentsProps {
  tagId: string;
  level: number;
}

const TagDocuments = ({ tagId, level }: TagDocumentsProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.log("TagDocuments: No authenticated user");
      return;
    }

    const q = query(
      collection(db, "documents"),
      where("userId", "==", user.uid),
      where("isArchived", "==", false),
      where("tags", "array-contains", tagId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        _id: doc.id,
        title: doc.data().title,
        userId: doc.data().userId,
        isArchived: doc.data().isArchived,
        isPublished: doc.data().isPublished,
        parentDocument: doc.data().parentDocument ?? null,
        icon: doc.data().icon,
        content: doc.data().content,
        coverImage: doc.data().coverImage,
        tags: doc.data().tags || [],
      }));
      setDocuments(docs);
      console.log("TagDocuments: fetched documents", docs);
    }, (err) => {
      console.error("TagDocuments: Snapshot error", err);
    });

    return () => unsubscribe();
  }, [tagId]);

  const handleClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const handleRemoveTag = (documentId: string) => {
    const promise = removeTagFromDocument(documentId, tagId);
    toast.promise(promise, {
      loading: "Удаление тега...",
      success: "Тег убран",
      error: "Не удалось убрать тег",
    });
  };

  return (
    <div>
      {documents.length === 0 ? (
        <p className="px-3 text-sm text-muted-foreground">Нет заметок с этим тегом</p>
      ) : (
        documents.map((doc) => (
          <Item
            key={doc._id}
            id={doc._id}
            label={doc.title}
            documentIcon={doc.icon}
            level={level}
            active={params.documentId === doc._id}
            onClick={() => handleClick(doc._id)}
            onRemoveTag={() => handleRemoveTag(doc._id)}
          />
        ))
      )}
    </div>
  );
};