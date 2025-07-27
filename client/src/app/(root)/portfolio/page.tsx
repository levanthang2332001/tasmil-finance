import { ContentLayout } from "@/components/admin-panel/content-layout";
import Portfolio from "@/components/portfolio";
import Image from "next/image";

const PortfolioPage = () => {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2">
          <Image
            src="/images/portfolio.png"
            alt="logo"
            width={40}
            height={40}
          />
          <h1 className="text-2xl font-semibold">Portfolio</h1>
        </div>
      }
    >
      <Portfolio />
    </ContentLayout>
  );
};

export default PortfolioPage;
