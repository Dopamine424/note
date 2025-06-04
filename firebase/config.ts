


import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
  getDocs,
  arrayRemove,
} from "firebase/firestore";

export interface Document {
  _id: string;
  title: string;
  userId: string;
  isArchived: boolean;
  isPublished: boolean;
  parentDocument?: string | null;
  icon?: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  order?: number;
}

const firebaseConfig = {
  apiKey: "AIzaSyAf_WAPEu88t3r8yCKelmrjEcVv0B5qJY0",
  authDomain: "notes-d80a2.firebaseapp.com",
  projectId: "notes-d80a2",
  storageBucket: "notes-d80a2.firebasestorage.app",
  messagingSenderId: "448335966624",
  appId: "1:448335966624:web:58237c341140f7dcb934c5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
}



export const getAllDocuments = (callback: (docs: Document[]) => void) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const q = query(
    collection(db, "documents"),
    where("userId", "==", user.uid),
    where("isArchived", "==", false),
    orderBy("order", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const documents: Document[] = snapshot.docs.map((doc) => ({
      _id: doc.id,
      title: doc.data().title,
      userId: doc.data().userId,
      isArchived: doc.data().isArchived,
      isPublished: doc.data().isPublished,
      parentDocument: doc.data().parentDocument ?? null,
      icon: doc.data().icon,
      content: doc.data().content,
      coverImage: doc.data().coverImage,
      order: doc.data().order,
    }));
    console.log("getAllDocuments: Fetched", {
      userId: user.uid,
      documents: documents.map((d) => ({ _id: d._id, title: d.title, parentDocument: d.parentDocument })),
    });
    callback(documents);
  });

  return unsubscribe;
};





export const createTag = async (name: string, color: string): Promise<Tag> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Пользователь не авторизован");

  const tagRef = await addDoc(collection(db, "tags"), {
    name,
    color,
    userId: user.uid,
  });

  return { id: tagRef.id, name, color, userId: user.uid };
};

export const getTags = async (): Promise<Tag[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(collection(db, "tags"), where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name ?? "",
      color: data.color ?? "#000000",
      userId: data.userId ?? user.uid,
    } as Tag;
  });
};


export const updateDocumentTags = async (documentId: string, tagIds: string[]) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("updateDocumentTags: Пользователь не авторизован");
    throw new Error("Пользователь не авторизован");
  }

  if (!documentId) {
    console.error("updateDocumentTags: documentId пустой");
    throw new Error("documentId пустой");
  }

  console.log("updateDocumentTags: Обновление тегов", { documentId, tagIds });

  try {
    const docRef = doc(db, "documents", documentId);
    await updateDoc(docRef, { tags: tagIds });
    console.log("updateDocumentTags: Теги успешно обновлены");
  } catch (error) {
    console.error("updateDocumentTags: Ошибка при обновлении тегов", error);
    throw error;
  }
};

export const updateDocumentParent = async (documentId: string, parentDocument: string | null) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const docRef = doc(db, "documents", documentId);
  await updateDoc(docRef, { parentDocument });
  console.log("updateDocumentParent: Parent updated", { documentId, parentDocument });
};

export const updateDocumentOrder = async (documentId: string, order: number) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const docRef = doc(db, "documents", documentId);
  await updateDoc(docRef, { order });
  console.log("updateDocumentOrder: Order updated", { documentId, order });
};


export const removeTagFromDocument = async (documentId: string, tagId: string) => {
  try {
    const docRef = doc(db, "documents", documentId);
    await updateDoc(docRef, {
      tags: arrayRemove(tagId),
    });
    console.log("removeTagFromDocument: Tag removed", { documentId, tagId });
  } catch (error: any) {
    console.error("removeTagFromDocument: Error", error.message);
    throw error;
  }
};


export const deleteTag = async (tagId: string) => {
  try {
    const tagRef = doc(db, "tags", tagId);
    await deleteDoc(tagRef);
    console.log("deleteTag: Tag deleted", { tagId });


    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "documents"),
      where("userId", "==", user.uid),
      where("tags", "array-contains", tagId)
    );
    const querySnapshot = await getDocs(q);

    const updatePromises = querySnapshot.docs.map((doc) =>
      updateDoc(doc.ref, {
        tags: arrayRemove(tagId),
      })
    );
    await Promise.all(updatePromises);
    console.log("deleteTag: Tag removed from documents", { count: querySnapshot.size });
  } catch (error: any) {
    console.error("deleteTag: Error", error.message);
    throw error;
  }
};


export const createDocument = async (title: string = "Без названия", parentDocument?: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const documentData: Omit<Document, "_id"> = {
    title,
    userId: user.uid,
    isArchived: false,
    isPublished: false,
    parentDocument: parentDocument || null,
    order: 0,
  };

  const document = await addDoc(collection(db, "documents"), documentData);
  return document.id;
};

export const archiveDocument = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const docRef = doc(db, "documents", id);
  await updateDoc(docRef, { isArchived: true });
};

export const getDocumentById = async (documentId: string): Promise<Document | null> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const docRef = doc(db, "documents", documentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const document = { _id: docSnap.id, ...docSnap.data() } as Document;
  if (document.userId !== user.uid && (!document.isPublished || document.isArchived)) {
    throw new Error("Unauthorized");
  }

  return document;
};

export const updateDocument = async (
  id: string,
  updates: Partial<{
    content: string;
    isPublished: boolean;
    title: string;
    coverImage: string | null | undefined;
    icon: string | null;
  }>
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const docRef = doc(db, "documents", id);
  await updateDoc(docRef, updates);
};




export const getSidebarDocuments = (
  callback: (docs: Document[]) => void,
  parentDocument: string | undefined = undefined
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const q = query(
    collection(db, "documents"),
    where("userId", "==", user.uid),
    where("isArchived", "==", false),
    parentDocument ? where("parentDocument", "==", parentDocument) : where("parentDocument", "==", null),
    orderBy("order", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const documents: Document[] = snapshot.docs.map((doc) => ({
      _id: doc.id,
      title: doc.data().title,
      userId: doc.data().userId,
      isArchived: doc.data().isArchived,
      isPublished: doc.data().isPublished,
      parentDocument: doc.data().parentDocument ?? null,
      icon: doc.data().icon,
      content: doc.data().content,
      coverImage: doc.data().coverImage,
      order: doc.data().order,
    }));
    console.log("getSidebarDocuments: Fetched", {
      parentDocument,
      userId: user.uid,
      documents: documents.map((d) => ({ _id: d._id, title: d.title, order: d.order })),
    });
    callback(documents);
  });

  return unsubscribe;
};

export const getSearchDocuments = (callback: (docs: Document[]) => void) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const q = query(
    collection(db, "documents"),
    where("userId", "==", user.uid),
    where("isArchived", "==", false),
    orderBy("title", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const documents: Document[] = snapshot.docs.map((doc) => ({
      _id: doc.id,
      title: doc.data().title,
      userId: doc.data().userId,
      isArchived: doc.data().isArchived,
      isPublished: doc.data().isPublished,
      parentDocument: doc.data().parentDocument ?? null,
      icon: doc.data().icon,
      content: doc.data().content,
      coverImage: doc.data().coverImage,
    }));
    callback(documents);
  });

  return unsubscribe;
};

export const restoreDocument = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const docRef = doc(db, "documents", id);
  await updateDoc(docRef, { isArchived: false });
};

export const removeDocument = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const dbRef = collection(db, "documents");

  const deleteChildren = async (parentId: string) => {
    const q = query(dbRef, where("parentDocument", "==", parentId), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    for (const childDoc of querySnapshot.docs) {
      await deleteChildren(childDoc.id);
      await deleteDoc(doc(db, "documents", childDoc.id));
    }
  };

  await deleteChildren(id);

  const docRef = doc(db, "documents", id);
  await deleteDoc(docRef);
};

export const getTrashDocuments = (callback: (docs: Document[]) => void) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const q = query(
    collection(db, "documents"),
    where("userId", "==", user.uid),
    where("isArchived", "==", true),
    orderBy("title", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const documents: Document[] = snapshot.docs.map((doc) => ({
      _id: doc.id,
      title: doc.data().title,
      userId: doc.data().userId,
      isArchived: doc.data().isArchived,
      isPublished: doc.data().isPublished,
      parentDocument: doc.data().parentDocument ?? null,
      icon: doc.data().icon,
      content: doc.data().content,
      coverImage: doc.data().coverImage,
    }));
    callback(documents);
  });

  return unsubscribe;
};