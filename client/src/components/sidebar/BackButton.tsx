"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const BackButton = ({ className, children }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className={cn("flex items-center gap-2 hover:bg-accent/50 transition-colors", className)}
    >
      <ChevronLeft className="h-5 w-5 text-muted-foreground" />
      {children}
    </Button>
  );
};

export default BackButton;
