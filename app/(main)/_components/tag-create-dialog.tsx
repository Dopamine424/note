import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTags } from "@/hooks/use-tags";
import { toast } from "sonner";

const colors = [
  "#FF0000", 
  "#00FF00", 
  "#0000FF", 
  "#FFFF00", 
  "#FF00FF", 
  "#00FFFF", 
];

export const TagCreateDialog = () => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [open, setOpen] = useState(false);
  const { addTag } = useTags();

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Название тега не может быть пустым");
      return;
    }

    try {
      await addTag(name, selectedColor);
      toast.success("Тег создан");
      setName("");
      setSelectedColor(colors[0]);
      setOpen(false);
    } catch (error) {
      toast.error("Не удалось создать тег");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить тег
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новый тег</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Название тега"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor === color ? "border-black" : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
          <Button onClick={handleSubmit}>Создать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};