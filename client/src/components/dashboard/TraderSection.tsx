import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import TraderCard from "./TraderCard";
import { Trader } from "@/data/dashboardMockData";

interface TraderSectionProps {
  title: string;
  traders: Trader[];
  viewAllHref?: string;
  maxDisplay?: number;
}

const TraderSection: React.FC<TraderSectionProps> = ({
  title,
  traders,
  viewAllHref = "#",
  maxDisplay = 4,
}) => {
  // Only display up to maxDisplay traders
  const displayedTraders = traders.slice(0, maxDisplay);

  // For animation staggering
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="crypto-card w-full relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Mixed media scrapbook element */}
      <div className="absolute -top-3 -right-2 transform rotate-6">
        <div className="px-2 py-0.5 bg-gray-800/70 text-xs font-handwriting text-crypto-teal/70">
          {title === "Top Traders" ? "Best performers" : "Whale activity"}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <h2 className="text-xl font-medium text-white">{title}</h2>

          {/* Simple geometry / doodle elements */}
          <div className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-crypto-blue to-crypto-teal/0"></div>
          {title === "Top Traders" ? (
            <div className="absolute -bottom-1.5 left-1 w-2 h-2 bg-crypto-blue rounded-full"></div>
          ) : (
            <div className="absolute -bottom-1.5 left-1 w-2 h-2 bg-crypto-teal rounded-full"></div>
          )}
        </div>

        <Button
          variant="link"
          className={`text-${
            title === "Top Traders" ? "crypto-blue" : "crypto-teal"
          }`}
          asChild
        >
          <a href={viewAllHref} className="group relative overflow-hidden">
            <span>View all</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </a>
        </Button>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {displayedTraders.map((trader) => (
          <motion.div key={trader.id} variants={item}>
            <TraderCard trader={trader} />
          </motion.div>
        ))}
      </motion.div>

      {/* Anti-design element */}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-transparent border-r-2 border-b-2 border-gray-700"></div>
    </motion.div>
  );
};

export default TraderSection;
