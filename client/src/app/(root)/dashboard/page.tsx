"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import BiophilicBackground from "@/components/dashboard/BiophilicBackground";
import FilterOptions from "@/components/dashboard/FilterOptions";
import Navigation from "@/components/dashboard/Navigation";
import ScrollableModules from "@/components/dashboard/ScrollableModules";
import SearchBar from "@/components/dashboard/SearchBar";
import TraderSection from "@/components/dashboard/TraderSection";
import { modules, topTraders, topWhales } from "@/data/dashboardMockData";
import { motion } from "framer-motion";
import { useState } from "react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"spotlight" | "dashboard">("dashboard");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <ContentLayout title="Dashboard">
      <div className="min-h-screen bg-background overflow-auto relative">
        {/* Biophilic design elements */}
        <BiophilicBackground />

        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            className="flex flex-col space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div
              className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
              variants={itemVariants}
            >
              <div className="relative">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <div className="absolute -top-2 -left-3 w-10 h-10 border-t-2 border-l-2 border-crypto-blue/30 rounded-tl-lg opacity-50"></div>
                <div className="absolute -bottom-2 -right-3 w-10 h-10 border-b-2 border-r-2 border-crypto-teal/30 rounded-br-lg opacity-50"></div>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
              variants={itemVariants}
            >
              <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
            </motion.div>

            {/* Search */}
            <motion.div variants={itemVariants}>
              <SearchBar />
            </motion.div>

            {/* Filter Options */}
            <motion.div variants={itemVariants}>
              <FilterOptions />
            </motion.div>

            {/* Scrollable Modules */}
            <motion.div variants={itemVariants}>
              <ScrollableModules modules={modules} />
            </motion.div>

            {/* Trader Sections */}
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={itemVariants}>
              <TraderSection title="Top Traders" traders={topTraders} />
              <TraderSection title="Top Whales" traders={topWhales} />
            </motion.div>
          </motion.div>
        </div>

        {/* Maximum contrast dark footer */}
        <div className="w-full py-2 mt-8 bg-black relative z-10">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="text-xs text-gray-500 font-mono">DEFI.ANALYTICS.PLATFORM</div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-crypto-teal"></span>
              <span>ALPHA v0.1</span>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
