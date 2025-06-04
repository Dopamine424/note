
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, Document, updateDocument } from "@/firebase/config";
import { MenuIcon, Sparkles, GitGraph } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";
import { useEditor } from "@/hooks/use-editor";
import { checkTextWithAI } from "@/lib/languagetool";
import { PartialBlock } from "@blocknote/core";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
  isGraphOpen: boolean;
  setIsGraphOpen: (isOpen: boolean) => void;
}

export const Navbar = ({ isCollapsed, onResetWidth, isGraphOpen, setIsGraphOpen }: NavbarProps) => {
  const params = useParams();
  const [document, setDocument] = useState<Document | null | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(false);
  const { editor } = useEditor();

  useEffect(() => {
    if (!params.documentId) return;

    const docRef = doc(db, "documents", params.documentId as string);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const docData = { _id: snapshot.id, ...snapshot.data() } as Document;
        setDocument(docData);
      } else {
        setDocument(null);
      }
    });

    return () => unsubscribe();
  }, [params.documentId]);

  const handleAICheck = async (checkType: "TYPOS" | "PUNCTUATION") => {
    if (!editor || !document || isChecking) return;

    setIsChecking(true);

    const blocks = editor.document;
    let fullText = "";
    blocks.forEach((block: any) => {
      if (block.content && Array.isArray(block.content)) {
        const blockText = block.content
          .filter((inline: any) => inline.type === "text")
          .map((inline: any) => inline.text)
          .join("");
        fullText += blockText + "\n";
      }
    });

    const correctedText = await checkTextWithAI(fullText, checkType);

    const correctedLines = correctedText.split("\n");
    const newBlocks: PartialBlock[] = blocks.map((block: any, index: number) => {
      if (block.content && Array.isArray(block.content) && correctedLines[index]) {
        return {
          ...block,
          content: [
            {
              type: "text",
              text: correctedLines[index],
              styles: block.content.find((c: any) => c.type === "text")?.styles || {},
            },
          ],
        } as PartialBlock;
      }
      return block;
    });

    editor.replaceBlocks(
      blocks.map((b: any) => b.id),
      newBlocks
    );

    const updatedContent = JSON.stringify(newBlocks, null, 2);
    await updateDocument(document._id, { content: updatedContent });

    setTimeout(() => setIsChecking(false), 3000);
  };

  const toggleGraph = () => {
    console.log("Navbar: toggleGraph called, new isGraphOpen:", !isGraphOpen);
    setIsGraphOpen(!isGraphOpen);
  };

  if (document === undefined) {
    return (
      <nav className="bg-white dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-white dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isChecking}
                  className="md:hidden"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isChecking}
                  className="hidden md:flex"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Проверить с ИИ
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAICheck("TYPOS")}>
                  Проверить орфографию
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAICheck("PUNCTUATION")}>
                  Проверить пунктуацию
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleGraph}
              title={isGraphOpen ? "Закрыть граф" : "Открыть граф"}
            >
              <GitGraph className="h-4 w-4" />
            </Button>
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};