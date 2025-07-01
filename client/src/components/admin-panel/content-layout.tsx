import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="pt-8 pb-8 px-4 sm:px-8 h-[calc(100vh-56px)] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
