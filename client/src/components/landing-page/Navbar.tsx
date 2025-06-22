"use client";

import { PART } from "@/constants/part";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const navItems = Object.entries(PART).map(([key, value]) => ({
    name: key,
    href: `#${value}`,
  }));

  return (
    <nav
      className={cn(
        "bg-black/20 backdrop-blur-sm border border-border rounded-full px-6 py-2",
        className
      )}
    >
      <ul className="flex items-center gap-6">
        {navItems.map((item) => (
          <motion.li key={item.name} whileHover={{ scale: 1.05 }}>
            <Link
              href={item.href}
              className="text-gray-300 hover:text-crypto-blue transition-colors"
            >
              {item.name}
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
