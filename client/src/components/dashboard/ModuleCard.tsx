import React from "react";
import { Module } from "@/data/dashboardMockData";
import { motion } from "framer-motion";

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  // Different background patterns based on module type
  let bgClass = "bg-gradient-cards";

  if (module.type === "money") {
    bgClass = "bg-gradient-to-br from-crypto-blue/10 to-transparent";
  } else if (module.type === "trader") {
    bgClass = "bg-gradient-to-br from-crypto-teal/10 to-transparent";
  }

  // Create a visual biophilic pattern based on module type
  const patternElements = [];
  const patternCount = module.type === "money" ? 5 : 3;

  for (let i = 0; i < patternCount; i++) {
    patternElements.push(
      <div
        key={i}
        className={`absolute ${
          i % 2 === 0 ? "bg-crypto-blue/10" : "bg-crypto-teal/10"
        } rounded-full blur-md`}
        style={{
          width: `${20 + Math.random() * 30}px`,
          height: `${20 + Math.random() * 30}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }}
      />
    );
  }

  return (
    <motion.div
      className={`crypto-card min-w-[300px] w-full h-[200px] ${bgClass} border border-gray-700/50 flex flex-col relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{
        boxShadow: "0 0 20px rgba(45, 212, 191, 0.2)",
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      {/* Biophilic patterns */}
      {patternElements}

      {/* Anti-design element: intentionally misaligned decorative element */}
      <div className="absolute -top-1 -right-1 w-12 h-12 rotate-12 border-t-4 border-r-4 border-crypto-blue/20 rounded-tr-xl"></div>

      <h3 className="text-lg font-medium text-white relative z-10 flex items-center">
        <span className="w-2 h-8 bg-crypto-blue/80 mr-2"></span>
        {module.title}
        <span className="text-xs text-gray-400 ml-auto font-mono">
          {module.type}
        </span>
      </h3>

      <div className="flex-1 flex items-center justify-center relative z-10">
        {/* Placeholder content - would be replaced with actual data/charts */}
        <div className="w-full max-w-[80%] h-20 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center">
          <p className="text-gray-400 text-sm font-mono">
            // {module.title.toLowerCase()}_data
          </p>
        </div>
      </div>

      {/* Simple geometry elements */}
      <div className="absolute bottom-2 left-2 flex gap-1">
        <div className="w-1 h-1 bg-crypto-blue rounded-full"></div>
        <div className="w-1 h-1 bg-crypto-teal rounded-full"></div>
        <div className="w-1 h-1 bg-crypto-green rounded-full"></div>
      </div>
    </motion.div>
  );
};

export default ModuleCard;
