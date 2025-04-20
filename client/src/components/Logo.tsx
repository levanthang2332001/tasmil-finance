import Link from "next/link";
import React from "react";
import Image from "next/image";
import { PATHS } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      href={PATHS.AI_AGENT}
      className={cn("p-4 flex items-center gap-2", className)}
    >
      <Image
        src="/images/logo.png"
        alt="logo"
        width={40}
        height={40}
        className="w-10 h-10"
      />
      <h3 className="text-xl font-semibold bg-gradient-to-r from-crypto-blue to-crypto-blue bg-clip-text text-transparent">
        Tasmil Finance
      </h3>
    </Link>
  );
};

export default Logo;
