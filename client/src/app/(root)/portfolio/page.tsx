import { ContentLayout } from "@/components/admin-panel/content-layout";
import Portfolio from "@/components/portfolio";

// export const dynamic = 'force-dynamic';

const PortfolioPage = () => {
  return (
    <ContentLayout title="Portfolio">
      <Portfolio />
    </ContentLayout>
  );
};

export default PortfolioPage;
