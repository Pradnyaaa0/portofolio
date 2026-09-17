import { useState, useEffect, useRef, useMemo } from 'react';
import { useLenis } from 'lenis/react';

import profileImage3 from './assets/profile3.jpeg';
import ParticleBackground from './components/ParticleBackground';
import CursorEffect from './components/CursorEffect';
import WhatsAppChat from './components/WhatsAppChat';
import ProjectModal from './components/ProjectModal';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

import { Component as KineticNavigation } from './components/ui/sterling-gate-kinetic-navigation';
import { ElasticGallery } from './components/ui/elastic-gallery';
import { MagicText } from './components/ui/magic-text';
import { SkillBeamDemo } from './components/ui/skill-beam-demo';
import { InfiniteRibbon } from './components/ui/infinite-ribbon';
import { CinematicHero } from './components/ui/cinematic-landing-hero';

import { PROJECTS } from './data/projects';
import { PROFILE_INFO } from './data/profile';

export default function App() {
  const lenis = useLenis();
  const isLightMode = true;
  const [selectedProject, setSelectedProject] = useState(null);

  // Ref list for sections
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const featuredProjectsRef = useRef(null);
  const contactRef = useRef(null);

  const sections = useMemo(() => ({
    home: homeRef,
    about: aboutRef,
    skills: skillsRef,
    'featured-projects': featuredProjectsRef,
    contact: contactRef,
  }), []);

  // Scroll Reveal using IntersectionObserver
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal-element, .reveal-element-left, .reveal-element-right');

    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px',
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  // Smooth Scroll handler
  const handleScrollTo = (sectionKey) => {
    const target = sections[sectionKey]?.current;
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -20, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const featuredProjects = useMemo(() => PROJECTS.filter((p) => p.isFeatured), []);

  return (
    <div className="custom-cursor-area relative min-h-screen overflow-x-hidden light bg-[#fafafa] text-neutral-800">
      {/* Interactive Floating Particle Canvas */}
      <ParticleBackground isLightMode={isLightMode} />

      {/* Interactive Cursor Trail (Only visible on large screens) */}
      <CursorEffect />

      {/* Draggable WhatsApp Chat Floating Button */}
      <WhatsAppChat />

      {/* TOP DECORATIVE GLOWS */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none z-0 animate-pulse-slow" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px] pointer-events-none z-0" />

      {/* MAIN CONTAINER */}
      <main className="w-full flex flex-col items-center justify-center z-10 relative overflow-hidden">
        {/* HERO SECTION — Cinematic Hero */}
        <section id="home" ref={homeRef} className="w-full relative">
          <CinematicHero
            brandName={PROFILE_INFO.name}
            tagline1="Welcome to My Portfolio"
            tagline2=""
            cardHeading={PROFILE_INFO.tagline}
            cardDescription={<>{PROFILE_INFO.bio}</>}
            profilePhoto={profileImage3}
          />
        </section>

        {/* ABOUT SECTION — MagicText + Animated Beam */}
        <section
          id="about"
          ref={aboutRef}
          className="py-14 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full relative"
        >
          <div className="reveal-element text-left mb-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600">
              About Me
            </h2>
          </div>

          <div className="reveal-element relative max-w-6xl mx-auto">
            {/* Ambient Background Blur Glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

            <MagicText text={PROFILE_INFO.aboutMe} className="" />
          </div>

          {/* Skills Beam — seamlessly integrated */}
          <div ref={skillsRef} id="skills" className="reveal-element flex items-center justify-center mt-4">
            <SkillBeamDemo />
          </div>
        </section>

        {/* STERLING GATE KINETIC NAVIGATION */}
        <KineticNavigation
          onScrollTo={handleScrollTo}
          isLightMode={isLightMode}
        />

        {/* INFINITE CROSSING RIBBONS DIVIDER */}
        <div className="w-full relative z-20 py-10 sm:py-14 overflow-hidden select-none flex flex-col justify-center items-center">
          {/* Ribbon 1: Left-to-Right Rotated Positive */}
          <InfiniteRibbon
            duration={28}
            repeat={6}
            rotation={2.5}
            className="w-[140%] -ml-[20%] bg-indigo-600/95 text-white dark:bg-neutral-900/95 dark:text-indigo-300 font-mono font-extrabold text-sm sm:text-base tracking-[0.2em] py-3.5 z-10"
          >
            <span className="inline-flex items-center gap-4">
              <span>FRONT END DEVELOPER</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 dark:bg-indigo-400 inline-block animate-pulse" />
              <span>BACKEND DEVELOPER</span>
              <span className="w-2 h-2 rounded-full bg-purple-400 dark:bg-indigo-400 inline-block animate-pulse" />
              <span>FULLSTACK DEVELOPER</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 dark:bg-indigo-400 inline-block animate-pulse" />
            </span>
          </InfiniteRibbon>

          {/* Ribbon 2: Right-to-Left Rotated Negative (Crossing Ribbon 1) */}
          <InfiniteRibbon
            duration={32}
            repeat={6}
            reverse={true}
            rotation={-2.5}
            className="w-[140%] -ml-[20%] -mt-12 sm:-mt-14 bg-purple-600/95 text-white dark:bg-indigo-950/95 dark:text-purple-300 font-mono font-extrabold text-sm sm:text-base tracking-[0.2em] py-3.5 z-20"
          >
            <span className="inline-flex items-center gap-4">
              <span>FULLSTACK DEVELOPER</span>
              <span className="w-2 h-2 rounded-full bg-pink-400 dark:bg-purple-400 inline-block animate-pulse" />
              <span>BACKEND DEVELOPER</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 dark:bg-purple-400 inline-block animate-pulse" />
              <span>FRONT END DEVELOPER</span>
              <span className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-purple-400 inline-block animate-pulse" />
            </span>
          </InfiniteRibbon>
        </div>

        {/* FEATURED PROJECTS SECTION */}
        <section
          id="featured-projects"
          ref={featuredProjectsRef}
          className="py-14 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full relative"
        >
          <div className="reveal-element">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 md:mb-3 pt-4 md:pt-6">
              My Best Projects
            </h2>
          </div>

          <div className="reveal-element">
            <ElasticGallery
              items={featuredProjects.map((p, idx) => ({
                id: `0${idx + 1}`,
                title: p.title,
                category: p.category,
                src: p.image,
                alt: p.imageAlt || p.title,
                codeLink: p.codeLink,
                desc: p.desc,
                tech: p.tech,
              }))}
              onSelectProject={(item) => {
                const found = featuredProjects.find((p) => p.title === item.title);
                if (found) setSelectedProject(found);
              }}
            />
          </div>
        </section>

        {/* DETAIL PROJECT MODAL POPUP */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        {/* CONTACT SECTION — Unified Single Section (100% Full Width) */}
        <ContactSection ref={contactRef} />

        {/* FOOTER */}
        <Footer onScrollTo={handleScrollTo} />
      </main>
    </div>
  );
}
