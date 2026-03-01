import { MenuIcon } from "lucide-react";

import { Menu } from "@/components/admin-panel/menu";
import { SidebarBrand } from "@/components/admin-panel/sidebar-brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button className="flex justify-center items-center pb-2 pt-1" variant="link" asChild>
            <SidebarBrand href="/dashboard" isOpen className="items-center" titleClassName="font-bold text-lg" />
          </Button>
          <SheetTitle className="sr-only">Tasmil Finance</SheetTitle>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
