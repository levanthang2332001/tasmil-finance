import { Navbar } from "@/components/admin-panel/navbar";
import { cn } from "@/lib/utils";

interface ContentLayoutProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContentLayout({ title, children, className }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className={cn("pt-8 pb-8 px-4 sm:px-8 h-[calc(100vh-56px)] overflow-y-auto", className)}>
        {children}
      </div>
    </div>
  );
}
