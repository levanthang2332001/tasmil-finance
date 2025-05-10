'use client'

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";
import Form from "../form";
import { useToolbar } from "@/store/useToolbar";

interface SideRightProps {
  className?: string;
}

const SideRight = ({ className }: SideRightProps) => {
  const { type, isOpen, setIsOpen } = useToolbar();

  if (!isOpen) return null;
  return (
    <div className={cn("w-[360px] h-full border-l bg-background", className)}>
      <Button variant="ghost" onClick={() => setIsOpen(false)} className="fixed right-4 top-4 z-10">
        <X className="h-4 w-4" />
      </Button>

      <div className="flex flex-col h-full">
        <Form type={type} />
      </div>
    </div>
  );
};

export default SideRight;
