"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import BiophilicBackground from "./BiophilicBackground";
import Navigation from "./Navigation";
import SpotLight from "./spotlight/SpotLight";
import Trending from "./trending/Trending";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"spotlight" | "dashboard">("spotlight");

  return (
    <>
      <div className="min-h-screen relative">
        <BiophilicBackground />

        <div className="container mx-auto px-4 py-8 z-10">
          <motion.div
            className="flex flex-col space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Navigation */}
            <motion.div
              className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
            </motion.div>

            {activeTab === "spotlight" && <SpotLight />}
            {activeTab === "dashboard" && <Trending />}
          </motion.div>
        </div>
      </div>
    </>
  );
}
