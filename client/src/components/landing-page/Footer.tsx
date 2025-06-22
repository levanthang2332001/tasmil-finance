"use client";
import { motion } from "framer-motion";
import SocialMedia from "./SocialMedia";
import { AptosConnectWallet } from "../wallet";

const Footer = () => {
  return (
    <section className="pt-24 pb-8 relative bg-gradient-to-b from-transparent to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6">
            Ready to Transform Your DeFi Trading?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of traders using AI to optimize their DeFi strategies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AptosConnectWallet label="🚀 Get Started" />
          </div>
        </motion.div>
      </div>
      <SocialMedia />
    </section>
  );
};

export default Footer;
