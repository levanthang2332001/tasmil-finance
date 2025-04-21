import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const SearchBar: React.FC = () => {
  return (
    <motion.div
      className="relative w-full"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="absolute -top-5 -left-2 text-crypto-teal text-xs font-mono rotate-6 opacity-70">
        find signals...
      </div>
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={16}
      />
      <Input
        placeholder="Search what you want ..."
        className="pl-10 py-6 bg-transparent focus:ring-0 border border-gray-700 rounded-xl text-white backdrop-blur-xl
                  shadow-[0_0_15px_rgba(45,212,191,0.15)] transition-all duration-300"
      />
      <div className="absolute -bottom-4 -right-2 text-crypto-blue text-xs font-handwriting rotate-[-4deg] opacity-80">
        discover alpha
      </div>
    </motion.div>
  );
};

export default SearchBar;
