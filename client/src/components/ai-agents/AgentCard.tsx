import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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

const AgentCard = ({ agent, className }: Agent) => {
  return (
    <Link href={`/ai-agent/${agent.id}`} className="cursor-pointer">
      <Card
        className={cn(
          "hover:shadow-lg transition-shadow cursor-pointer hover:border-primary",
          className
        )}
      >
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Image
              src={agent.imageUrl}
              alt={agent.name}
              className="w-12 h-12 rounded-full object-cover"
              width={48}
              height={48}
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
    </Link>
  );
};

export default AgentCard;
