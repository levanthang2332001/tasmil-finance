"use client";
import { motion } from "framer-motion";
import SocialMedia from "./SocialMedia";
import { PATHS } from "@/constants/routes";
import { Button } from "../ui/button";
import Link from "next/link";

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
            <Link href={PATHS.DEFI_AGENT} target="_blank" rel="noopener noreferrer">
              <Button variant="galaxy">🚀 Get Started</Button>
            </Link>
          </div>
        </motion.div>
      </div>
      <SocialMedia />
    </section>
  );
};

export default Footer;
