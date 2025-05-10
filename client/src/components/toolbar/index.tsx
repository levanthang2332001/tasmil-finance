"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToolbarType, useToolbar } from "@/store/useToolbar";
import { Columns2, Pencil, Plus } from "lucide-react";

interface ToolbarProps {
  listType: ToolbarType[];
  className?: string;
}
const ToolBar = ({ listType = [ToolbarType.CREATE], className }: ToolbarProps) => {
  const { isOpen, setType, setIsOpen } = useToolbar();

  const handleOpen = (type: ToolbarType) => {
    setIsOpen(true);
    setType(type);
  };

  const renderButton = {
    create: (
      <Button onClick={() => handleOpen(ToolbarType.CREATE)} className="">
        <Plus className="mr-2 h-4 w-4" />
        Create New Agent
      </Button>
    ),
    edit: (
      <Button onClick={() => handleOpen(ToolbarType.EDIT)} className="">
        <Pencil className="mr-2 h-4 w-4" />
        Edit Agent
      </Button>
    ),
    future: (
      <Button variant={'ghost'} onClick={() => handleOpen(ToolbarType.FUTURE)} className="">
        <Columns2 className="mr-2 h-4 w-4" />
      </Button>
    ),
  };

  if (isOpen) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {listType.map((type) => renderButton[type])}
    </div>
  );
};

export default ToolBar;
