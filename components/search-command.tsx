"use client";

import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { useSearch } from "@/hooks/use-search";
import { File } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSearchDocuments, Document } from "@/firebase/config";

export const SearchCommand = () => {
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const { isOpen, toggle, onClose } = useSearch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = getSearchDocuments((docs) => {
      setDocuments(docs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey) && !e.defaultPrevented) {
        e.preventDefault();
        console.log("Cmd+K pressed");
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: string) => {
    const documentId = id.split("-")[0];
    router.push(`/documents/${documentId}`);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => {
      console.log("CommandDialog onOpenChange:", open);
      if (!open) onClose();
    }}>
      <CommandInput placeholder={`Поиск по запискам ${user?.displayName || user?.email}`} />
      <CommandList>
        <CommandEmpty>Результаты не найдены</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={onSelect}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};