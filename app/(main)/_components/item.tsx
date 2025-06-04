

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { updateDocumentParent, updateDocumentOrder, getSidebarDocuments, Document } from "@/firebase/config";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ReactNode, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface ItemProps {
  id?: string;
  documentIcon?: ReactNode;
  active?: boolean;
  expended?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpend?: () => void;
  label: string;
  onClick?: () => void;
  icon?: LucideIcon;
  onCreate?: () => void;
  onArchive?: () => void;
  onRemoveTag?: () => void;
  parentDocumentId?: string; // Добавить
}

const ItemType = "DOCUMENT";

export const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpend,
  expended,
  onCreate,
  onArchive,
  onRemoveTag,
  parentDocumentId,
}: ItemProps) => {
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, parentDocumentId, order: 0 },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover: (item: { id: string }, monitor) => {
      if (item.id === id || !ref.current) return;
      const offset = monitor.getClientOffset();
      const isLeftEdge = offset && ref.current.getBoundingClientRect().left &&
        offset.x < ref.current.getBoundingClientRect().left + 20;
      ref.current.classList.remove("bg-accent", "border-l-4", "border-blue-500");
      ref.current.classList.add(isLeftEdge ? "border-l-4 border-blue-500" : "bg-accent");
    },
    drop: async (item: { id: string; parentDocumentId?: string | null; order?: number }) => {
      if (item.id === id || !id) return;
      try {
        if (ref.current?.classList.contains("border-blue-500")) {
          await updateDocumentParent(item.id, id);
          toast.success("Заметка перемещена внутрь");
          console.log("Item: Dropped as child", { draggedId: item.id, parentId: id });
        } else {
          const docs = await new Promise<Document[]>((resolve) => {
            getSidebarDocuments((docs) => resolve(docs), parentDocumentId);
          });
          const targetDoc = docs.find((d) => d._id === id);
          if (!targetDoc) return;
          await updateDocumentOrder(item.id, targetDoc.order || 0);
          toast.success("Порядок заметки изменён");
          console.log("Item: Dropped to reorder", { draggedId: item.id, order: targetDoc.order });
        }
      } catch (error: any) {
        console.error("Item: Drop error", error.message);
        toast.error("Не удалось переместить заметку");
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const handleArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id || !onArchive) return;
    onArchive();
  };

  const handleRemoveTag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id || !onRemoveTag) return;
    onRemoveTag();
  };

  const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    onExpend?.();
  };

  const handleCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id || !onCreate) return;
    onCreate();
  };

  const ChevronIcon = expended ? ChevronDown : ChevronRight;

  return (
    <div
      ref={ref}
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary",
        isDragging && "opacity-50",
        isOver && "bg-accent"
      )}
    >
      {!!id && onExpend && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        Icon && <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {!!id && (onArchive || onRemoveTag || onCreate) && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              {onRemoveTag ? (
                <DropdownMenuItem onClick={handleRemoveTag} className="flex items-center">
                  <Trash className="h-4 w-4 mr-2" />
                  Убрать тег
                </DropdownMenuItem>
              ) : (
                onArchive && (
                  <DropdownMenuItem onClick={handleArchive} className="flex items-center">
                    <Trash className="h-4 w-4 mr-2" />
                    Удалить
                  </DropdownMenuItem>
                )
              )}
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Последнее изменение: {user?.email}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {onCreate && (
            <div
              role="button"
              onClick={handleCreate}
              className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
