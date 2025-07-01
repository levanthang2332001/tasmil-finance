"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
interface NavbarProps {
  className?: string;
  children?: React.ReactNode;
}

const Navbar = ({ className, children }: NavbarProps) => {
  return (
    <AnimatePresence mode="wait">
      <div className={cn("flex items-center gap-2 px-6 py-4 " , className)}>
        {children}
      </div>
    </AnimatePresence>
  );
};

export default Navbar;
