"use client";

import { useEffect } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import "@blocknote/mantine/style.css";
import { useEdgeStore } from "@/lib/edgestore";
import { useEditor } from "@/hooks/use-editor";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  documentId: string;
  initialTags?: string[];
}

const Editor = ({
  onChange,
  initialContent,
  editable = true,
  documentId,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const { setEditor } = useEditor();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });
    return response.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });

  useEffect(() => {
    setEditor(editor);
    return () => {
      setEditor(null);
    };
  }, [editor, setEditor]);

  useEffect(() => {
    const interval = setInterval(() => {
      const content = JSON.stringify(editor.document, null, 2);
      onChange(content);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [editor, onChange]);

  return (
    <div className="p-4">
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;