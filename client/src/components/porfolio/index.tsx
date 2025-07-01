"use client";
import React from "react";
import AptosPortfolio from "./AptosPortfolio";
import TasmilPortfolio from "./TasmilPortfolio";
import TransferSection from "./TransferSection";

const Portfolio = () => {
  // Mock APT balances for transfer component
  const aptosAptBalance = "125.50";
  const tasmilAptBalance = "50.25";

  return (
    <div className="h-full w-full p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-6 items-start">
          <div className="flex-1">
            <AptosPortfolio />
          </div>
          <div className="flex-shrink-0">
            <TransferSection aptosBalance={aptosAptBalance} tasmilBalance={tasmilAptBalance} />
          </div>
          <div className="flex-1">
            <TasmilPortfolio />
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden space-y-6">
          <AptosPortfolio />
          <div className="flex justify-center">
            <TransferSection aptosBalance={aptosAptBalance} tasmilBalance={tasmilAptBalance} />
          </div>
          <TasmilPortfolio />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
