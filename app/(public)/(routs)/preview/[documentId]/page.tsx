// "use client";

// import { Cover } from "@/components/cover";
// import dynamic from "next/dynamic";
// import { useMemo } from "react";
// import { Toolbar } from "@/components/toolbar";
// import { Skeleton } from "@/components/ui/skeleton";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { useMutation, useQuery } from "convex/react";


// interface DocumentIdPageProps {
//   params: {
//     documentId: Id<"documents">;
//   };
// }

// const DocumentIdPage = ({ params }: DocumentIdPageProps) => {

//   const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

//   const document = useQuery(api.documents.getById, {
//     documentId: params.documentId,
//   });

//   const update = useMutation(api.documents.update);

//   const onChange = ( content:string ) => {
//     update({
//       id: params.documentId,
//       content
//     });
//   };

//   if (document === undefined) {
//     return (
//       <div>
//         <Cover.Skeleton />
//         <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
//           <div className="space-y-4 pl-8 pt-4">
//             <Skeleton className="h-14 w-[50%]"/>
//             <Skeleton className="h-4 w-[80%]"/>
//             <Skeleton className="h-4 w-[40%]"/>
//             <Skeleton className="h-4 w-[60%]"/>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (document === null) {
//     return <div> Не найдено </div>;
//   }

//   return (
//     <div className="pb-40 pt-20">
//       <Cover preview url={document.coverImage} />
//       <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
//         <Toolbar preview initialData={document} />
//         <Editor
//           onChange={onChange}
//           initialContent={document.content}
//           editable={false}
//         />
//       </div>
//     </div>
//   );
// };

// export default DocumentIdPage;





"use client";

import { Cover } from "@/components/cover";
import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { db, Document, updateDocument } from "@/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

interface DocumentIdPageProps {
  params: {
    documentId: string;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);
  const [document, setDocument] = useState<Document | null | undefined>(undefined);

  useEffect(() => {
    if (!params.documentId) return;

    const docRef = doc(db, "documents", params.documentId);
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

  const onChange = (content: string) => {
    if (document) {
      updateDocument(params.documentId, { content });
    }
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Не найдено</div>;
  }

  return (
    <div className="pb-40 pt-20">
      <Cover preview url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar preview initialData={document} />
        <Editor
          onChange={onChange}
          initialContent={document.content}
          editable={false}
        />
      </div>
    </div>
  );
};

export default DocumentIdPage;