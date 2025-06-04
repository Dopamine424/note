import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from "./config";

export const fixOrder = async () => {
  if (!auth.currentUser) {
    console.error("No user logged in");
    return;
  }
  const q = query(
    collection(db, "documents"),
    where("userId", "==", auth.currentUser.uid),
    where("isArchived", "==", false)
  );
  const snapshot = await getDocs(q);
  let index = 0;
  for (const doc of snapshot.docs) {
    await updateDoc(doc.ref, { order: index++ });
    console.log(`Updated order for document ${doc.id} to ${index - 1}`);
  }
  console.log("All documents updated");
};