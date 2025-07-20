import { SheetMenu } from "@/components/admin-panel/sheet-menu";

interface NavbarProps {
  title: string | React.ReactNode;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="w-full bg-background/10 supports-[backdrop-filter]:bg-background/10 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          {typeof title === "string" ? (
            <h1 className="font-bold">{title}</h1>
          ) : (
            title
          )}
        </div>
      </div>
    </header>
  );
}
