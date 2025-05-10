import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AgentType, useAgent } from "@/store/useAgent";
import { useRouter } from "next/navigation";

interface Agent {
  agent: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    features: string[];
  };
  className?: string;
}

const DefiCard = ({ agent, className }: Agent) => {
  const { setSelectedAgent } = useAgent();
  const router = useRouter();

  const handleClick = () => {
    setSelectedAgent(agent.name as AgentType);
    router.push(`/defi-agent/${agent.id}`);
    router.refresh();
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card
        className={cn(
          "hover:shadow-lg transition-shadow cursor-pointer hover:border-primary",
          className
        )}
      >
        <CardHeader>
          <div className="flex items-center space-x-4">
            <img
              src={agent.imageUrl}
              alt={agent.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <CardTitle>{agent.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{agent.description}</p>
          <div className="flex flex-wrap gap-2">
            {agent.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefiCard;
