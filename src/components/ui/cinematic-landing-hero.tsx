"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { GraduationCap, Code2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground, #888) 8%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground, #888) 8%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* -------------------------------------------------------------------
     PHYSICAL SKEUOMORPHIC MATERIALS
  ---------------------------------------------------------------------- */
  
  .text-3d-matte {
      color: var(--color-foreground, currentColor);
      text-shadow: 
          0 10px 30px color-mix(in srgb, var(--color-foreground, #888) 20%, transparent), 
          0 2px 4px color-mix(in srgb, var(--color-foreground, #888) 10%, transparent);
  }

  .text-silver-matte {
      background: linear-gradient(90deg, #7C3AED 0%, #6366F1 45%, #06B6D4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent !important;
      background-clip: text;
      transform: translateZ(0);
      filter: drop-shadow(0px 8px 24px rgba(124, 58, 237, 0.3));
  }

  .text-card-silver-matte {
      background: linear-gradient(90deg, #7C3AED 0%, #6366F1 45%, #06B6D4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent !important;
      background-clip: text;
      transform: translateZ(0);
      filter: drop-shadow(0px 8px 24px rgba(124, 58, 237, 0.25));
  }

  .premium-depth-card {
      background: #ffffff !important;
      box-shadow: 
          0 40px 100px -20px rgba(15, 23, 42, 0.12),
          0 20px 40px -20px rgba(15, 23, 42, 0.08),
          inset 0 1px 2px rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(226, 232, 240, 0.9);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99,102,241,0.06) 0%, transparent 40%);
      mix-blend-mode: multiply; transition: opacity 0.3s ease;
  }

  .floating-ui-badge {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(24px); 
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 
          0 0 0 1px rgba(226, 232, 240, 0.9),
          0 20px 40px -10px rgba(15, 23, 42, 0.08);
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  profilePhoto?: string;
}

export function CinematicHero({
  brandName = "Pradnya Putra",
  tagline1 = "Welcome to My Portfolio",
  tagline2 = "Pradnya Putra",
  cardHeading = "Fullstack Web & Mobile Developer",
  cardDescription = <>Informatics undergraduate student at INSTIKI Denpasar with a strong passion for designing and building modern digital solutions for web and mobile.</>,
  metricValue = 100,
  metricLabel = "% Passion",
  profilePhoto,
  className,
  ...props
}: CinematicHeroProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  // 1. Mouse Interaction Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;

      cancelAnimationFrame(requestRef.current);

      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Complex Cinematic Scroll Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const hasTextDays = Boolean(containerRef.current?.querySelector(".text-days"));
      if (hasTextDays) {
        gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      }
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge"], { autoAlpha: 0 });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" });
      if (hasTextDays) {
        introTl.to(".text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");
      }

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3500",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .fromTo(".mockup-scroll-wrapper",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
        )
        .fromTo(".floating-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=1.5")
        .fromTo(".card-left-text", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
        .fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
        .to({}, { duration: 2.5 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .to([".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05,
        })
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

    }, containerRef);

    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-transparent text-foreground font-sans antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true" />

      {/* BACKGROUND LAYER: Hero Texts */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform transform-style-3d">
        <h1 className="text-track gsap-reveal text-3d-matte text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-2">
          {tagline1}
        </h1>
        {tagline2 ? (
          <h1 className="text-days gsap-reveal text-silver-matte text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-extrabold tracking-tighter">
            {tagline2}
          </h1>
        ) : null}
      </div>



      {/* FOREGROUND LAYER: The Physical Deep Card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          {/* DYNAMIC RESPONSIVE GRID */}
          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">

            {/* 1. BRAND / TITLE */}
            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <h2 className="text-4xl md:text-[5rem] lg:text-[6.5rem] font-black uppercase tracking-tighter text-card-silver-matte lg:mt-0 text-center lg:text-right leading-none">
                {brandName}
              </h2>
            </div>

            {/* 2. CENTER: PROFILE PHOTO */}
            <div className="mockup-scroll-wrapper order-2 lg:order-2 relative w-full h-[380px] lg:h-[600px] flex items-center justify-center z-10" style={{ perspective: "1000px" }}>

              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.7] md:scale-90 lg:scale-100">

                {/* Profile Photo Frame */}
                <div
                  ref={mockupRef}
                  className="relative w-[300px] h-[420px] lg:w-[340px] lg:h-[480px] rounded-[2.5rem] overflow-hidden will-change-transform transform-style-3d shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_60px_rgba(99,102,241,0.15)] border-2 border-white/10 group"
                >
                  {/* Photo */}
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Pradnya Putra"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center text-indigo-300 font-bold text-2xl">
                      Pradnya Putra
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Name Badge */}
                  <div className="absolute bottom-5 left-5 right-5 text-left">
                    <p className="font-extrabold text-base lg:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      Nyoman Artha Pradnya Putra
                    </p>
                    <p className="text-indigo-200 text-xs lg:text-sm font-medium drop-shadow-md">Fullstack Developer</p>
                  </div>
                </div>

                {/* Floating Glass Badges */}
                <div className="floating-badge absolute flex top-6 lg:top-12 left-[-15px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-200/80 shadow-sm">
                    <GraduationCap className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="!text-slate-900 text-xs lg:text-sm font-bold tracking-tight">Informatics</p>
                    <p className="!text-slate-500 text-[10px] lg:text-xs font-medium">INSTIKI Denpasar</p>
                  </div>
                </div>

                <div className="floating-badge absolute flex bottom-2 lg:bottom-4 right-[-20px] lg:right-[-95px] floating-ui-badge rounded-xl lg:rounded-2xl p-2.5 lg:p-3.5 items-center gap-2.5 lg:gap-3.5 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-cyan-50 flex items-center justify-center border border-cyan-200/80 shadow-sm flex-shrink-0">
                    <Code2 className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-600" />
                  </div>
                  <div className="text-left">
                    <p className="!text-slate-900 text-xs lg:text-sm font-bold tracking-tight">Web & Mobile</p>
                    <p className="!text-slate-500 text-[10px] lg:text-xs font-medium">React, Laravel, Java</p>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. CARD LEFT TEXT */}
            <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-none px-4 lg:px-0">
              <h3 className="!text-slate-900 text-2xl md:text-3xl lg:text-4xl font-extrabold mb-0 lg:mb-5 tracking-tight">
                {cardHeading}
              </h3>
              <p className="hidden md:block !text-slate-600 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                {cardDescription}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CinematicHero;
