"use client";

import React, { forwardRef, useRef, useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";

const NodeBox = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-9 sm:size-14 md:size-16 items-center justify-center rounded-xl sm:rounded-2xl md:rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-1.5 sm:p-2.5 md:p-3 shadow-md hover:scale-110 transition-transform duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
});

NodeBox.displayName = "NodeBox";

export function SkillBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const leftRef1 = useRef<HTMLDivElement>(null);
  const leftRef2 = useRef<HTMLDivElement>(null);
  const leftRef3 = useRef<HTMLDivElement>(null);
  const leftRef4 = useRef<HTMLDivElement>(null);
  const leftRef5 = useRef<HTMLDivElement>(null);

  const rightRef1 = useRef<HTMLDivElement>(null);
  const rightRef2 = useRef<HTMLDivElement>(null);
  const rightRef3 = useRef<HTMLDivElement>(null);
  const rightRef4 = useRef<HTMLDivElement>(null);
  const rightRef5 = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const c1 = isMobile ? -45 : -140;
  const c2 = isMobile ? -22 : -70;
  const c3 = 0;
  const c4 = isMobile ? 22 : 70;
  const c5 = isMobile ? 45 : 140;

  const yOffset1 = isMobile ? -6 : -18;
  const yOffset2 = isMobile ? -3 : -9;
  const yOffset3 = 0;
  const yOffset4 = isMobile ? 3 : 9;
  const yOffset5 = isMobile ? 6 : 18;

  return (
    <div
      className="relative flex h-[340px] sm:h-[540px] md:h-[630px] w-full items-center justify-center overflow-hidden py-2 sm:py-6 px-2 sm:px-6"
      ref={containerRef}
    >
      <div className="flex size-full items-center justify-between gap-2 sm:gap-10 md:gap-20 w-full px-2 sm:px-8 md:px-16">
        {/* LEFT COLUMN */}
        <div className="flex flex-col justify-center gap-2 sm:gap-5 md:gap-6 z-10">
          <NodeBox ref={leftRef1}>
            <Icons.antigravity />
          </NodeBox>
          <NodeBox ref={leftRef2}>
            <Icons.html5 />
          </NodeBox>
          <NodeBox ref={leftRef3}>
            <Icons.laravel />
          </NodeBox>
          <NodeBox ref={leftRef4}>
            <Icons.java />
          </NodeBox>
          <NodeBox ref={leftRef5}>
            <Icons.bootstrap />
          </NodeBox>
        </div>

        {/* CENTER SKILLS BADGE */}
        <div
          ref={centerRef}
          className="z-10 flex px-4 sm:px-10 md:px-14 py-2 sm:py-5 md:py-6 items-center justify-center rounded-xl sm:rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-xl sm:shadow-2xl hover:scale-105 transition-transform duration-300 select-none cursor-pointer"
        >
          <span className="text-sm sm:text-2xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">
            Skills
          </span>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col justify-center gap-2 sm:gap-5 md:gap-6 z-10">
          <NodeBox ref={rightRef1}>
            <Icons.react />
          </NodeBox>
          <NodeBox ref={rightRef2}>
            <Icons.css3 />
          </NodeBox>
          <NodeBox ref={rightRef3}>
            <Icons.python />
          </NodeBox>
          <NodeBox ref={rightRef4}>
            <Icons.mysql />
          </NodeBox>
          <NodeBox ref={rightRef5}>
            <Icons.androidStudio />
          </NodeBox>
        </div>
      </div>

      {/* Left beams → center */}
      <AnimatedBeam containerRef={containerRef} fromRef={leftRef1} toRef={centerRef} curvature={c1} endYOffset={yOffset1} />
      <AnimatedBeam containerRef={containerRef} fromRef={leftRef2} toRef={centerRef} curvature={c2} endYOffset={yOffset2} />
      <AnimatedBeam containerRef={containerRef} fromRef={leftRef3} toRef={centerRef} curvature={c3} endYOffset={yOffset3} />
      <AnimatedBeam containerRef={containerRef} fromRef={leftRef4} toRef={centerRef} curvature={c4} endYOffset={yOffset4} />
      <AnimatedBeam containerRef={containerRef} fromRef={leftRef5} toRef={centerRef} curvature={c5} endYOffset={yOffset5} />

      {/* Right beams ← center (reverse) */}
      <AnimatedBeam containerRef={containerRef} fromRef={rightRef1} toRef={centerRef} curvature={c1} endYOffset={yOffset1} reverse />
      <AnimatedBeam containerRef={containerRef} fromRef={rightRef2} toRef={centerRef} curvature={c2} endYOffset={yOffset2} reverse />
      <AnimatedBeam containerRef={containerRef} fromRef={rightRef3} toRef={centerRef} curvature={c3} endYOffset={yOffset3} reverse />
      <AnimatedBeam containerRef={containerRef} fromRef={rightRef4} toRef={centerRef} curvature={c4} endYOffset={yOffset4} reverse />
      <AnimatedBeam containerRef={containerRef} fromRef={rightRef5} toRef={centerRef} curvature={c5} endYOffset={yOffset5} reverse />
    </div>
  );
}

const Icons = {
  antigravity: () => (
    <svg className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 select-none" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="beamAgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path d="M144.248 149.062c7.5 5.626 18.75 1.876 8.437-8.437-30.937-30-24.375-112.5-62.812-112.5-38.438 0-31.875 82.5-62.813 112.5-11.25 11.25.938 14.063 8.438 8.437 29.062-19.687 27.187-54.375 54.375-54.375 27.187 0 25.312 34.688 54.375 54.375Z" fill="url(#beamAgGrad)" />
    </svg>
  ),
  html5: () => (
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" draggable="false" />
  ),
  css3: () => (
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" draggable="false" />
  ),
  bootstrap: () => (
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" alt="Bootstrap" className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" draggable="false" />
  ),
  react: () => (
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" draggable="false" />
  ),
  laravel: () => (
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" alt="Laravel" className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" draggable="false" />
  ),
  python: () => (
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" draggable="false" />
  ),
  java: () => (
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" draggable="false" />
  ),
  mysql: () => (
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" draggable="false" />
  ),
  androidStudio: () => (
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg" alt="Android Studio" className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" draggable="false" />
  ),
};
