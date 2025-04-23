"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
interface NavbarProps {
  className?: string;
  children?: React.ReactNode;
}

const Navbar = ({ className, children }: NavbarProps) => {
  const HEADER_HEIGHT = "h-[var(--header-height)] max-h-[var(--header-height)]";

  return (
    <AnimatePresence mode="wait">
      <div
        className={cn(
          HEADER_HEIGHT,
          "flex items-center justify-between gap-2 px-6 py-4",
          className
        )}
      >
        {children}
      </div>
    </AnimatePresence>
  );
};

export default Navbar;
