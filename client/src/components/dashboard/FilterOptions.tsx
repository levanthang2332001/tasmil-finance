import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "../ui/toogle-group";

const FilterOptions: React.FC = () => {
  return (
    <motion.div
      className="flex flex-wrap gap-4 items-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <ToggleGroup type="single" defaultValue="signal">
        <ToggleGroupItem value="signal" className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-md filter blur-sm group-hover:blur-md transition-all"></div>
          <div className="relative z-10 flex items-center gap-2">
            <Zap size={16} className="text-primary" />
            <span>Signal</span>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="h-8 w-0.5 bg-gray-700 rounded-full mx-1 hidden md:block"></div>

      <Button
        variant="outline"
        className="rounded-md border-gray-700 text-white group relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300"
        ></div>
        <div
          className="absolute top-0 left-0 w-full h-full border border-gray-600 rounded-md opacity-0 
                      group-hover:opacity-100 scale-110 group-hover:scale-105 transition-all"
        ></div>
        <Filter size={16} className="mr-2 relative z-10" />
        <span className="relative z-10">Filter</span>
      </Button>

      <div className="absolute right-4 bottom-[-8px] w-8 h-2 bg-secondary rounded-full opacity-20 hidden lg:block"></div>
    </motion.div>
  );
};

export default FilterOptions;
