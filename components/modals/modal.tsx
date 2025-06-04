"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ModalProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Modal = ({ trigger, title, children, open, onOpenChange }: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};