import { ContentLayout } from "@/components/admin-panel/content-layout";
import Portfolio from "@/features/portfolio/components/portfolio";
import Image from "next/image";

const PortfolioPage = () => {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/images/portfolio.png"
            alt="logo"
            width={34}
            height={34}
            className="sm:w-[40px] sm:h-[40px]"
          />
          <h1 className="text-lg sm:text-2xl font-semibold">Portfolio</h1>
        </div>
      }
    >
      <Portfolio />
    </ContentLayout>
  );
};

export default PortfolioPage;
