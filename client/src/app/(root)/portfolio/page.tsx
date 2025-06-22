import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

const PortfolioPage = () => {
  return (
    <ContentLayout title="Portfolio">
      <div className="h-full w-full p-6 flex items-center justify-center">
        <div className="w-full rounded-lg p-8 max-w-md bg-purple-950/50 border border-purple-500/20">
          <div className="flex flex-col items-center text-center space-y-4">
            <Award className="w-16 h-16 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Coming Soon</h1>
            <p className="text-gray-400">
              Our portfolio features are under development. Stay tuned for updates!
            </p>
            <Button variant="outline">Get Notified</Button>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default PortfolioPage;
