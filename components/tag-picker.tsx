"use client";

import { useState } from "react";
import { useTags } from "@/hooks/use-tags";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TagPickerProps {
  onChange: (tagId: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
}

export const TagPicker = ({ onChange, children, asChild }: TagPickerProps) => {
  const { tags } = useTags();
  const [input, setInput] = useState("");

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-60 border border-input shadow-sm">
        <Command>
          <CommandInput
            placeholder="Найти тег..."
            value={input}
            onValueChange={setInput}
          />
          <CommandList>
            {tags
              .filter((tag) => tag.name.toLowerCase().includes(input.toLowerCase()))
              .map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => onChange(tag.id)}
                  className="flex items-center"
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};