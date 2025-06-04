// "use client";

// import { ConfirmModal } from "@/components/modals/confirm-modal";
// import { Button } from "@/components/ui/button";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { useMutation } from "convex/react";
// import { useRouter } from "next/navigation";

// import { toast } from "sonner";

// interface BannerProps {
//   documentId: Id<"documents">;
// }

// export const Banner = ({ documentId }: BannerProps) => {
//   const router = useRouter();

//   const remove = useMutation(api.documents.remove);
//   const restore = useMutation(api.documents.restore);

//   const onRemove = () => {
//     const promise = remove({ id: documentId });

//     toast.promise(promise, {
//       loading: "Удаление записки...",
//       success: "Записка удалена",
//       error: "Ошибка удаления записки",
//     });

//     router.push("/documents");
//   };
//   const onRestore = () => {
//     const promise = restore({ id: documentId });
//     toast.promise(promise, {
//       loading: "Восстановелние записки...",
//       success: "Записка востановлена",
//       error: "Ошибка восстановления записки",
//     });
//   };
//   return (
//     <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
//       <p>Эта страница находится в корзине.</p>
//       <Button
//         size="sm"
//         onClick={onRestore}
//         variant="outline"
//         className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
//       >
//         Восстановить страницу
//       </Button>
//       <ConfirmModal onConfirm={onRemove}>
//         <Button
//           size="sm"
//           variant="outline"
//           className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
//         >
//           Удалить навсегда
//         </Button>
//       </ConfirmModal>
//     </div>
//   );
// };



"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { removeDocument, restoreDocument } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
  documentId: string;
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const onRemove = () => {
    const promise = removeDocument(documentId).then(() => router.push("/documents"));

    toast.promise(promise, {
      loading: "Удаление записки...",
      success: "Записка удалена",
      error: "Ошибка удаления записки",
    });
  };

  const onRestore = () => {
    const promise = restoreDocument(documentId);

    toast.promise(promise, {
      loading: "Восстановление записки...",
      success: "Записка восстановлена",
      error: "Ошибка восстановления записки",
    });
  };

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>Эта страница находится в корзине.</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Восстановить страницу
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Удалить навсегда
        </Button>
      </ConfirmModal>
    </div>
  );
};