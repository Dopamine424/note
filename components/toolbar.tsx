
"use client";

import { Document, updateDocument, updateDocumentTags } from "@/firebase/config";
import { IconPicker } from "./icon-picker";
import { TagPicker } from "./tag-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X, Tag } from "lucide-react";
import { ElementRef, useRef, useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useTags } from "@/hooks/use-tags";
import { toast } from "sonner";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

interface ToolbarProps {
  initialData: Document;
  preview?: boolean;
  onTitleChange?: (title: string) => void;
}

export const Toolbar = ({ initialData, preview, onTitleChange }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);
  const coverImage = useCoverImage();
  const { tags } = useTags();
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData.tags || []);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  useEffect(() => {
    if (preview) return;

    const docRef = doc(db, "documents", initialData._id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const updatedTags = docSnap.data()?.tags || [];
        setSelectedTags(updatedTags);
        console.log("Toolbar: Tags synced from Firestore", { documentId: initialData._id, updatedTags });
      }
    }, (error) => {
      console.error("Toolbar: Firestore snapshot error", error.message);
      toast.error("Ошибка синхронизации тегов");
    });

    return () => {
      unsubscribe();
      console.log("Toolbar: Unsubscribed from Firestore snapshot", { documentId: initialData._id });
    };
  }, [initialData._id, preview]);

  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    updateDocument(initialData._id, {
      title: value || "Без названия",
    });
    if (onTitleChange) {
      onTitleChange(value || "Без названия");
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    updateDocument(initialData._id, { icon });
  };

  const onRemoveIcon = () => {
    updateDocument(initialData._id, { icon: null });
  };

  const onTagSelect = async (tagId: string) => {
    try {
      const newTags = selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId];
      setSelectedTags(newTags);
      await updateDocumentTags(initialData._id, newTags);
      console.log("Toolbar: Tags updated", { documentId: initialData._id, newTags });
      toast.success("Теги обновлены");
    } catch (error: any) {
      console.error("Toolbar: Tag update error", error.message);
      toast.error("Не удалось обновить теги");
    }
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onCheange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">{initialData.icon}</p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && <p className="text-6xl pt-6">{initialData.icon}</p>}
      {selectedTags.length > 0 && !preview && (
        <div className="flex gap-2 flex-wrap pt-2">
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? (
              <div
                key={tag.id}
                className="relative px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center text-sm"
                style={{
                  paddingRight: hoveredTag === tag.id ? "1.75rem" : "0.75rem",
                  transitionProperty: "padding-right",
                  transitionDuration: "200ms",
                }}
                onMouseEnter={() => setHoveredTag(tag.id)}
                onMouseLeave={() => setHoveredTag(null)}
              >
                <div
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: tag.color }}
                />
                <span>{tag.name}</span>
                <Button
                  onClick={() => {
                    console.log("Toolbar: Removing tag", tag.id);
                    onTagSelect(tag.id);
                  }}
                  className="absolute right-2 opacity-0 data-[hovered=true]:opacity-100 transition-opacity duration-200 rounded-full h-5 w-5 p-0 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-muted-foreground"
                  variant="ghost"
                  size="icon"
                  data-hovered={hoveredTag === tag.id}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : null;
          })}
        </div>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onCheange={onIconSelect}>
            <Button className="text-muted-foreground text-sm" variant="outline" size="sm">
              <Smile className="h-4 w-4 mr-2" />
              Добавить иконку
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Добавить обложку
          </Button>
        )}
        {!preview && (
          <TagPicker asChild onChange={onTagSelect}>
            <Button className="text-muted-foreground text-sm" variant="outline" size="sm">
              <Tag className="h-4 w-4 mr-2" />
              Добавить тег
            </Button>
          </TagPicker>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
          placeholder="Без названия"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};