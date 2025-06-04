
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useEdgeStore } from "@/lib/edgestore";
import { updateDocument, db } from "@/firebase/config";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url: initialUrl, preview }: CoverImageProps) => {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const coverImage = useCoverImage();
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    const documentId = params.documentId as string;
    if (!documentId) return;

    const docRef = doc(db, "documents", documentId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUrl(data.coverImage || undefined);
      }
    });

    return () => unsubscribe();
  }, [params.documentId]);

  const onRemove = async () => {
    const documentId = params.documentId as string;
    if (!documentId) return;

    if (url) {
      try {
        await edgestore.publicFiles.delete({
          url: url,
        });
      } catch (err) {
      }
    }

    await updateDocument(documentId, { coverImage: null });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && (
        <Image
          src={url}
          fill
          alt="Cover"
          className="object-cover"
        />
      )}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant="secondary"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Изменить обложку
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="secondary"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Удалить
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};