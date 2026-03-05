'use client';

import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BotThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex mb-4 animate-in"
    >
      <div className="flex items-end gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary hidden md:flex items-center justify-center">
          <Bot className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div className="max-w-[80%]">
          <motion.div
            layout
            className={cn(
              'rounded-2xl rounded-bl-sm bg-secondary text-secondary-foreground p-4',
              'shadow-sm transition-colors opacity-50'
            )}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-secondary-foreground"
              />
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 rounded-full bg-secondary-foreground"
              />
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 rounded-full bg-secondary-foreground"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}