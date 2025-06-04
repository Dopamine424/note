"use client";

import { create } from "zustand";
import { BlockNoteEditor } from "@blocknote/core";

type EditorStore = {
  editor: BlockNoteEditor | null;
  setEditor: (editor: BlockNoteEditor | null) => void;
};

export const useEditor = create<EditorStore>((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
}));