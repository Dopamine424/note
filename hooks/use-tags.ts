import { create } from "zustand";
import { createTag, getTags } from "@/firebase/config";

interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
}

interface TagStore {
  tags: Tag[];
  fetchTags: () => Promise<void>;
  addTag: (name: string, color: string) => Promise<void>;
}

export const useTags = create<TagStore>((set) => ({
  tags: [],
  fetchTags: async () => {
    const fetchedTags = await getTags();
    set({ tags: fetchedTags });
  },
  addTag: async (name: string, color: string) => {
    const newTag = await createTag(name, color);
    set((state) => ({ tags: [...state.tags, newTag] }));
  },
}));