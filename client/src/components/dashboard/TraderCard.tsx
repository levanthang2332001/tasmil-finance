import React from "react";

import { motion } from "framer-motion";
import { formatCurrency, formatPercentage, truncateAddress } from "@/lib/utils";
import { Trader } from "@/data/dashboardMockData";

interface TraderCardProps {
  trader: Trader;
}

const TraderCard: React.FC<TraderCardProps> = ({ trader }) => {
  // Generate a semi-realistic AI avatar gradient
  const generateAvatarGradient = () => {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 80%, 40%))`;
  };

  return (
    <motion.div
      className={`trader-card w-full transition-all duration-300 group ${
        trader.isWhale ? "border-crypto-teal/20" : "border-crypto-blue/20"
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{
        y: -3,
        boxShadow: trader.isWhale
          ? "0 5px 20px rgba(45, 212, 191, 0.2)"
          : "0 5px 20px rgba(30, 174, 219, 0.2)",
      }}
    >
      {/* High contrast decorative line */}
      <div
        className={`absolute top-0 left-0 w-full h-0.5 ${
          trader.isWhale ? "bg-crypto-teal" : "bg-crypto-blue"
        } opacity-60`}
      ></div>

      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mr-2 relative border border-white/10 overflow-hidden"
            style={{
              background: trader.avatar
                ? "transparent"
                : generateAvatarGradient(),
            }}
          >
            {trader.avatar ? (
              <img
                src={trader.avatar}
                alt="Trader"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <>
                {/* AI-generated avatar placeholder with diverse representation */}
                <div className="absolute inset-0 opacity-80"></div>
                <div className="relative z-10 text-sm font-medium text-white">
                  {trader.address.substring(2, 4)}
                </div>
              </>
            )}
            {/* Doodle-style decorative element */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background border border-gray-700"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-full h-full rounded-full bg-crypto-cyan/50 scale-50"></div>
            </motion.div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium">
              {truncateAddress(trader.address)}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              active {Math.floor(Math.random() * 24)}h ago
            </span>
          </div>
        </div>
        <div className="rounded-full bg-blue-500/10 p-1 group-hover:bg-blue-500/20 transition-colors">
          <div
            className={`w-6 h-6 rounded-full bg-gradient-to-r ${
              trader.isWhale
                ? "from-crypto-teal to-crypto-green"
                : "from-crypto-blue to-crypto-teal"
            } flex items-center justify-center`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L20 10L12 18L4 10L12 2Z" fill="#ffffff" />
              <path
                d="M20 10L12 22L4 10"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <div>
          <div className="text-gray-400 text-xs font-handwriting">30D PnL</div>
          <div
            className={`text-lg font-bold ${
              trader.pnl30d >= 0
                ? "text-crypto-positive"
                : "text-crypto-negative"
            }`}
          >
            {formatCurrency(trader.pnl30d)}
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-xs font-handwriting">Win rate</div>
          <div className="text-lg font-bold text-white flex items-center">
            {formatPercentage(trader.winRate)}
            {/* Simple geometry indicator */}
            <div className="ml-1 h-3 w-[30px] bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  trader.winRate > 0.6 ? "bg-crypto-positive" : "bg-crypto-blue"
                } rounded-full`}
                style={{ width: `${trader.winRate * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark side element */}
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10 rounded-tl-3xl bg-black/40"></div>
    </motion.div>
  );
};

export default TraderCard;
