"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface MagicTextProps {
  text: string;
  className?: string;
}

interface WordProps {
  children: string;
  progress: any;
  range: number[];
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const scale = useTransform(progress, range, [0.94, 1]);

  return (
    <span className="relative inline-block mr-[0.35em] my-1 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
      {/* Dim ghost text background */}
      <span className="absolute inset-0 opacity-15 dark:opacity-15 text-neutral-400 dark:text-neutral-600 select-none pointer-events-none font-normal">
        {children}
      </span>
      {/* Animated active text that lights up and thickens on scroll */}
      <motion.span
        style={{ opacity, scale }}
        className="relative z-10 text-neutral-900 dark:text-white font-bold inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({ text, className = "" }) => {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.85", "end 0.35"],
  });

  const words = text.split(" ");

  return (
    <div ref={container} className="w-full py-6">
      <div
        className={`text-justify [text-align-last:left] leading-relaxed py-2 sm:py-3 px-2 ${className}`}
      >
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;

          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </div>
    </div>
  );
};
