"use client";

import { cn } from "@/lib/utils";
import Form from "../form";

interface ToolbarProps {
  type: "create" | "edit";
  className?: string;
}

const ToolBar = ({type,  className }: ToolbarProps) => {
  return (
    <div className={cn("w-[360px] h-full border-l bg-background", className)}>
      <div className="flex flex-col h-full">
        <Form type={type} />
      </div>
    </div>
  );
};

export default ToolBar;
