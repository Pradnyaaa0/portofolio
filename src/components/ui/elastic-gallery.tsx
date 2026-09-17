"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export interface ElasticItemProps {
  id: string;
  title: string;
  category: string;
  src: string;
  alt: string;
  codeLink?: string;
  desc?: string;
  tech?: string[];
}

interface ElasticGalleryProps {
  items?: ElasticItemProps[];
  onSelectProject?: (item: any) => void;
}

const defaultItems: ElasticItemProps[] = [
  {
    id: "01",
    title: "Neon Cyber",
    category: "Photography",
    src: "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
    alt: "Neon lights",
  },
  {
    id: "02",
    title: "Urban Brutalism",
    category: "Architecture",
    src: "https://images.pexels.com/photos/2224424/pexels-photo-2224424.jpeg",
    alt: "Brutalist architecture",
  },
  {
    id: "03",
    title: "Abstract Fluid",
    category: "Design",
    src: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
    alt: "Abstract fluid art",
  },
  {
    id: "04",
    title: "Silent Nature",
    category: "Landscape",
    src: "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg",
    alt: "Misty forest",
  },
  {
    id: "05",
    title: "Future Tech",
    category: "Innovation",
    src: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
    alt: "Futuristic technology",
  },
];

function ElasticGallery({ items = defaultItems, onSelectProject }: ElasticGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id || "01");

  return (
    <div className="w-full pt-2 md:pt-3 pb-6 md:pb-12 dark:bg-black/40 rounded-3xl">
      {/* Container: Fixed height on mobile/desktop to ensure animation stability */}
      <div className="mx-auto flex h-[500px] w-full max-w-6xl flex-col gap-2 px-2 md:h-[600px] md:flex-row md:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveId(item.id)}
            onClick={() => {
              setActiveId(item.id);
              if (onSelectProject) onSelectProject(item);
            }}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-neutral-800 dark:bg-neutral-950 shadow-lg",
              // Layout & Flex Transition
              "transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
              // Flex Logic:
              activeId === item.id ? "flex-[4]" : "flex-[1]",
              // Brightness logic for focus (optimized for light & dark mode)
              activeId === item.id
                ? "brightness-100 shadow-2xl shadow-indigo-500/20"
                : "brightness-75 dark:brightness-50 hover:brightness-100"
            )}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 h-full w-full">
              <img
                src={item.src}
                alt={item.alt}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-1000",
                  // Subtle zoom on active
                  activeId === item.id ? "scale-100" : "scale-110"
                )}
              />
              {/* Gradient Overlay for Text Readability */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500",
                  activeId === item.id ? "opacity-100" : "opacity-40"
                )}
              />
            </div>

            {/* --- Content Container --- */}
            <div className="absolute bottom-0 left-0 right-0 flex h-full flex-col justify-end p-4 md:p-8 pointer-events-none">
              {/* Active Content: Title & Button */}
              <div
                className={cn(
                  "flex flex-col gap-2 transition-all duration-500 pointer-events-auto",
                  // Hide/Show based on active state with translation for smooth entry
                  activeId === item.id
                    ? "translate-y-0 opacity-100 delay-200"
                    : "translate-y-12 opacity-0"
                )}
              >
                {/* Category Tag */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/40 bg-black/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md md:px-3 md:text-xs shadow-sm">
                    {item.category}
                  </span>
                  {item.tech && item.tech.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="hidden sm:inline-block rounded-full border border-indigo-400/40 bg-indigo-950/60 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-200 backdrop-blur-md shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black uppercase leading-none !text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] md:text-4xl lg:text-5xl">
                  {item.title}
                </h3>

                {/* Call to Action */}
                {item.codeLink ? (
                  <a
                    href={item.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300 hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors md:mt-4 md:text-sm w-fit"
                  >
                    View Project <ArrowUpRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </a>
                ) : (
                  <div className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:mt-4 md:text-sm">
                    View Project{" "}
                    <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
                  </div>
                )}
              </div>

              {/* Inactive Content: Vertical Text (Desktop) / Short Label (Mobile) */}
              <div
                className={cn(
                  "absolute transition-all duration-500 pointer-events-none",
                  // Position logic
                  "bottom-4 left-1/2 -translate-x-1/2 md:bottom-8",
                  // Hide when active
                  activeId === item.id
                    ? "opacity-0 scale-50"
                    : "opacity-100 delay-500"
                )}
              >
                {/* Desktop: Vertical Text */}
                <span className="hidden whitespace-nowrap text-xl font-black uppercase tracking-widest text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.95)] [writing-mode:vertical-rl] md:block">
                  {item.title}
                </span>

                {/* Mobile: Horizontal ID/Label */}
                <span className="block text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] md:hidden">
                  {item.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ElasticGallery };
