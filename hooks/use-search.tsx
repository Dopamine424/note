// import { create } from "zustand";

// type SearchStore = {
//   isOpen: boolean;
//   onOpen: () => void;
//   onClose: () => void;
//   toggle: () => void;
// };

// export const useSearch = create<SearchStore>((set, get) => ({
//   isOpen: false,
//   onOpen: () => set({ isOpen: true }),
//   onClose: () => set({ isOpen: false }),
//   toggle: () => set({ isOpen: !get().isOpen }),
// }));


import { create } from "zustand";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/firebase/config";

interface SearchResult {
  id: string;
  title: string;
  content: string;
}

interface SearchStore {
  isOpen: boolean;
  results: SearchResult[];
  tagFilter: string | null;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
  search: (term: string, tagId?: string) => Promise<void>;
  filterByTag: (tagId: string | null) => void;
}

export const useSearch = create<SearchStore>((set) => ({
  isOpen: false,
  results: [],
  tagFilter: null,
  onOpen: () => {
    console.log("Search modal opened");
    set({ isOpen: true });
  },
  onClose: () => {
    console.log("Search modal closed");
    set({ isOpen: false, results: [], tagFilter: null });
  },
  toggle: () => {
    console.log("Search modal toggled");
    set((state) => ({ isOpen: !state.isOpen }));
  },
  search: async (term: string, tagId?: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    let q = query(collection(db, "documents"), where("userId", "==", userId));
    if (tagId) {
      q = query(q, where("tags", "array-contains", tagId));
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content,
    }));

    const filtered = docs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(term.toLowerCase()) ||
        doc.content.toLowerCase().includes(term.toLowerCase())
    );

    set({ results: filtered });
  },
  filterByTag: (tagId: string | null) => {
    set({ tagFilter: tagId });
    if (tagId) {
      useSearch.getState().search("", tagId);
    }
  },
}));