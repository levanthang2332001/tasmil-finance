import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface SidebarBrandProps {
  isOpen?: boolean;
  href?: string;
  className?: string;
  titleClassName?: string;
}

export function SidebarBrand({
  isOpen = true,
  href = "/",
  className,
  titleClassName,
}: SidebarBrandProps) {
  return (
    <Link
      href={href}
      className={cn(
        "!p-0 flex flex-row justify-start items-start gap-2 !no-underline",
        className,
      )}
    >
      <Image
        src="/images/logo.png"
        alt="logo"
        className="w-[40px] h-[40px] object-contain"
        width={40}
        height={40}
      />
      <h3
        className={cn(
          "text-lg font-semibold text-gradient whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
          !isOpen ? "-translate-x-96 opacity-0 hidden" : "translate-x-0 opacity-100",
          titleClassName,
        )}
      >
        Tasmil Finance
      </h3>
    </Link>
  );
}
