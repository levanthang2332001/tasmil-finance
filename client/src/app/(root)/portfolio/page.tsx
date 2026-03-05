import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import Image from "next/image";

const Portfolio = dynamic(() => import("@/features/portfolio/components/portfolio"), {
  loading: () => (
    <div className="space-y-4 p-2 md:p-4">
      <Skeleton className="h-[220px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  ),
});

const PortfolioPage = () => {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2 md:gap-3">
          <Image
            src="/images/portfolio.png"
            alt="logo"
            width={34}
            height={34}
            className="md:w-[40px] md:h-[40px]"
          />
          <h1 className="text-lg md:text-2xl font-semibold">Portfolio</h1>
        </div>
      }
    >
      <Portfolio />
    </ContentLayout>
  );
};

export default PortfolioPage;
