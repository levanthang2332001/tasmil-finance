"use client";

import React, { useRef, useEffect, useState, ForwardedRef, ReactNode, RefObject } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { User, Wallet, BarChart3, MessageCircle, Database, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type Point = { x: number; y: number };

type EnhancedBeamProps = {
  start: Point;
  end: Point;
  color?: string;
  pulseColor?: string;
  delay?: number;
  curveDirection?: "up" | "down";
};

const EnhancedBeam: React.FC<EnhancedBeamProps> = ({
  start,
  end,
  color = "rgba(168, 85, 247, 0.8)",
  pulseColor = "rgba(236, 72, 153, 1)",
  delay = 0,
  curveDirection = "up",
}) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [, setLength] = useState(0);

  // Calculate the curve for the path based on direction
  const curve = {
    x: (start.x + end.x) / 2,
    y: curveDirection === "up" ? (start.y + end.y) / 2 - 50 : (start.y + end.y) / 2 + 50,
  };

  const pathData = `M ${start.x},${start.y} Q ${curve.x},${curve.y} ${end.x},${end.y}`;

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, [start, end]);

  return (
    <>
      {/* Base path */}
      <path
        ref={pathRef}
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        className="opacity-80"
      />

      {/* First animated circle */}
      <motion.circle
        r={5}
        fill={pulseColor}
        initial={{ pathOffset: 0 }}
        animate={{
          pathOffset: 1,
          scale: [0.8, 1.5, 0.8],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          pathOffset: {
            duration: 3,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            delay: delay,
          },
          scale: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
          opacity: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
        style={{
          pathLength: 1,
          pathOffset: 0,
          filter: "drop-shadow(0 0 12px rgba(236, 72, 153, 0.9))",
        }}
      >
        <animateMotion dur="3s" repeatCount="indefinite" path={pathData} rotate="auto" />
      </motion.circle>

      {/* Second animated circle (going in opposite direction) */}
      <motion.circle
        r={3}
        fill={pulseColor}
        initial={{ pathOffset: 1 }}
        animate={{
          pathOffset: 0,
          scale: [0.6, 1.2, 0.6],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          pathOffset: {
            duration: 2.5,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            delay: delay + 1,
          },
          scale: {
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
          opacity: {
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
        style={{
          pathLength: 1,
          pathOffset: 1,
          filter: "drop-shadow(0 0 8px rgba(236, 72, 153, 0.7))",
        }}
      >
        <animateMotion
          dur="2.5s"
          repeatCount="indefinite"
          path={pathData}
          rotate="auto"
          keyPoints="1;0"
          keyTimes="0;1"
          calcMode="linear"
        />
      </motion.circle>
    </>
  );
};

type NodeColor = "purple" | "pink" | "blue";
type NodeSize = "sm" | "md" | "lg";

type NodeProps = {
  icon: ReactNode;
  label?: string;
  color?: NodeColor;
  size?: NodeSize;
  className?: string;
  animate?: boolean;
  delay?: number;
};

const Node = React.forwardRef<HTMLDivElement, NodeProps>(
  (
    { icon, label, color = "purple", size = "md", className, animate = true, delay = 0 },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const controls = useAnimation();
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(nodeRef, { once: false, amount: 0.3 });

    useEffect(() => {
      if (inView && animate) {
        controls.start({
          scale: [0.8, 1.1, 1],
          opacity: 1,
          transition: {
            duration: 0.6,
            delay: delay,
            ease: [0.22, 1, 0.36, 1],
          },
        });
      }
    }, [inView, controls, animate, delay]);

    const sizeClasses: Record<NodeSize, string> = {
      sm: "size-10",
      md: "size-14",
      lg: "size-20",
    };

    const colorClasses: Record<NodeColor, string> = {
      purple: "border-primary bg-primary/10 text-primary shadow-primary/30",
      pink: "border-secondary bg-secondary/10 text-secondary shadow-secondary/30",
      blue: "border-tertiary bg-tertiary/10 text-tertiary shadow-tertiary/30",
    };

    return (
      <div ref={nodeRef} className="flex flex-col items-center">
        <motion.div
          ref={ref}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={controls}
          className={cn(
            "z-10 flex items-center justify-center rounded-full border-2 p-3 backdrop-blur-sm shadow-lg",
            sizeClasses[size],
            colorClasses[color],
            className
          )}
        >
          {icon}
        </motion.div>
        {label && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2, duration: 0.5 }}
            className="mt-3 text-sm text-zinc-400 font-medium"
          >
            {label}
          </motion.div>
        )}
      </div>
    );
  }
);

Node.displayName = "Node";

type NodePositions = {
  user: Point;
  ai: Point;
  staking: Point;
  strategy: Point;
  pools: Point;
  chatbot: Point;
};

export default function FlowSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const inView = useInView(containerRef, { once: false, amount: 0.2 });

  // Node refs
  const userRef = useRef<HTMLDivElement | null>(null);
  const aiRef = useRef<HTMLDivElement | null>(null);
  const stakingRef = useRef<HTMLDivElement | null>(null);
  const strategyRef = useRef<HTMLDivElement | null>(null);
  const poolsRef = useRef<HTMLDivElement | null>(null);
  const chatbotRef = useRef<HTMLDivElement | null>(null);

  // Node positions
  const [nodePositions, setNodePositions] = useState<NodePositions>({
    user: { x: 0, y: 0 },
    ai: { x: 0, y: 0 },
    staking: { x: 0, y: 0 },
    strategy: { x: 0, y: 0 },
    pools: { x: 0, y: 0 },
    chatbot: { x: 0, y: 0 },
  });

  // Update node positions
  useEffect(() => {
    const updatePositions = () => {
      if (!svgRef.current) return;

      const svgRect = svgRef.current.getBoundingClientRect();

      const getNodeCenter = (ref: RefObject<HTMLDivElement>) => {
        if (!ref.current) return { x: 0, y: 0 };
        const rect = ref.current.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - svgRect.left,
          y: rect.top + rect.height / 2 - svgRect.top,
        };
      };

      setNodePositions({
        user: getNodeCenter(userRef),
        ai: getNodeCenter(aiRef),
        staking: getNodeCenter(stakingRef),
        strategy: getNodeCenter(strategyRef),
        pools: getNodeCenter(poolsRef),
        chatbot: getNodeCenter(chatbotRef),
      });
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);

    // Small delay to ensure DOM is fully rendered
    const timeout = setTimeout(updatePositions, 100);

    return () => {
      window.removeEventListener("resize", updatePositions);
      clearTimeout(timeout);
    };
  }, [inView]);

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,50,255,0.1),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">
            How Tasmil Finance Works
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg">
            Our AI-powered platform connects you to the Aptos blockchain ecosystem through an
            intuitive interface, making complex operations simple.
          </p>
        </motion.div>

        <div ref={containerRef} className="relative h-[600px] w-full max-w-5xl mx-auto">
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full z-0 overflow-visible"
            style={{ filter: "drop-shadow(0 0 10px rgba(139, 92, 246, 0.2))" }}
          >
            {inView &&
              Object.keys(nodePositions).every(
                (key) => (nodePositions as any)[key].x !== 0 && (nodePositions as any)[key].y !== 0
              ) && (
                <>
                  {/* Existing paths */}
                  <EnhancedBeam start={nodePositions.staking} end={nodePositions.ai} delay={0.2} />
                  <EnhancedBeam
                    start={nodePositions.strategy}
                    end={nodePositions.ai}
                    color="rgba(236, 72, 153, 0.6)"
                    pulseColor="rgba(168, 85, 247, 0.8)"
                    delay={0.5}
                  />
                  <EnhancedBeam start={nodePositions.pools} end={nodePositions.ai} delay={0.8} />
                  <EnhancedBeam
                    start={nodePositions.chatbot}
                    end={nodePositions.ai}
                    color="rgba(236, 72, 153, 0.6)"
                    pulseColor="rgba(168, 85, 247, 0.8)"
                    delay={1.1}
                  />
                  <EnhancedBeam
                    start={nodePositions.ai}
                    end={nodePositions.user}
                    color="rgba(139, 92, 246, 0.6)"
                    pulseColor="rgba(139, 92, 246, 0.8)"
                    delay={1.4}
                  />

                  {/* New mirrored path from User to AI Core (curving downwards) */}
                  <EnhancedBeam
                    start={nodePositions.user}
                    end={nodePositions.ai}
                    color="rgba(99, 102, 241, 0.6)" // Different color for visibility
                    pulseColor="rgba(99, 102, 241, 0.8)" // Different pulse color
                    delay={1.7}
                    curveDirection="down" // Curve downwards
                  />
                </>
              )}
          </svg>

          <div className="absolute inset-0 grid grid-cols-3 items-center">
            <div className="flex justify-center">
              <Node
                ref={userRef}
                icon={<User className="h-8 w-8" />}
                label="User"
                color="blue"
                size="lg"
                delay={0.2}
              />
            </div>

            <div className="flex justify-center">
              <Node
                ref={aiRef}
                icon={<Bot className="h-10 w-10" />}
                label="Tasmil Finance"
                color="pink"
                size="lg"
                delay={0.4}
              />
            </div>

            <div className="flex flex-col justify-center gap-12">
              <Node
                ref={stakingRef}
                icon={<Wallet className="h-6 w-6" />}
                label="Staking"
                color="purple"
                delay={0.6}
              />
              <Node
                ref={strategyRef}
                icon={<BarChart3 className="h-6 w-6" />}
                label="AI Strategy"
                color="pink"
                delay={0.8}
              />
              <Node
                ref={poolsRef}
                icon={<Database className="h-6 w-6" />}
                label="Top Pools"
                color="purple"
                delay={1.0}
              />
              <Node
                ref={chatbotRef}
                icon={<MessageCircle className="h-6 w-6" />}
                label="AI Chatbot"
                color="pink"
                delay={1.2}
              />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 max-w-2xl mx-auto"
        >
          <p className="text-zinc-300 text-lg font-medium mb-4">
            Seamless Integration of AI and Blockchain
          </p>
          <p className="text-zinc-400">
            Tasmil Finance architecture connects users to powerful blockchain protocols through an
            AI-powered interface, analyzing on-chain data to provide personalized recommendations
            and automate complex operations.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
