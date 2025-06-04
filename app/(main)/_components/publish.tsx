"use client";

import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { updateDocument, Document } from "@/firebase/config";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe, Share2 } from "lucide-react";

interface PublishProps {
  initialData: Document;
}

export const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);

    const promise = updateDocument(initialData._id, { isPublished: true }).finally(() =>
      setIsSubmitting(false)
    );

    toast.promise(promise, {
      loading: "Публикация....",
      success: "Записка опубликована",
      error: "Не удалось опубликовать записку",
    });
  };

  const onUnpublish = () => {
    setIsSubmitting(true);

    const promise = updateDocument(initialData._id, { isPublished: false }).finally(() =>
      setIsSubmitting(false)
    );

    toast.promise(promise, {
      loading: "Снять с публикации....",
      success: "Записка снята с публикации",
      error: "Не удалось снять с публикации записку",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          {initialData.isPublished ? (
            <>
              <Globe className="text-sky-500 w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Опубликовано</span>
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Опубликовать</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">
                Эта записка опубликована
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              Снять с публикации
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Опубликуйте записку</p>
            <span className="text-xs text-muted-foreground mb-4">
              Поделитесь своей работой с другими
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              Опубликовать
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};