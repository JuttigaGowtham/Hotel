"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashPage() {
  const router = useRouter();
  const [stage, setStage] = useState<"entering" | "exiting">("entering");

  useEffect(() => {
    // Start exit animation after 3 seconds
    const timer = setTimeout(() => {
      setStage("exiting");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    if (stage === "exiting") {
      router.push("/Home");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Background ambient glow */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-amber-500/10 blur-[100px]" />
      </motion.div>

      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {stage === "entering" && (
          <motion.div
            key="logo-container"
            className="z-10 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            {/* Minimalist Logo Icon */}
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="mb-8"
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-amber-400"
              >
                <path
                  d="M12 2L2 22H22L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8L6 20"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8L18 20"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            {/* Hotel Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-light tracking-[0.2em] text-white text-center uppercase"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Lumina
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-4 text-sm md:text-base tracking-[0.3em] text-zinc-400 uppercase text-center"
            >
              Hotels & Resorts
            </motion.p>

            {/* Decoration line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "40px" }}
              transition={{ duration: 1, delay: 1.8, ease: "easeInOut" }}
              className="mt-8 h-[1px] bg-amber-500"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
