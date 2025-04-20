import { Button } from "@/components/ui/button";
import { Landmark } from "lucide-react";

const DefiAgentPage = () => {
  return (
    <div className="h-full w-full p-6 flex items-center justify-center">
      <div className="w-full rounded-lg p-8 max-w-md bg-crypto-blue/20 border border-crypto-blue/20">
        <div className="flex flex-col items-center text-center space-y-4">
          <Landmark className="w-16 h-16 text-crypto-blue" />
          {/* <h1 className="text-3xl font-bold text-white">Coming Soon</h1> */}
          <p className="text-gray-400">
            Our defi agent features are under development. Stay tuned for
            updates!
          </p>
          <Button
            variant="outline"
            className="bg-crypto-blue text-black hover:bg-crypto-blue/80"
          >
            Get Notified
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DefiAgentPage;
