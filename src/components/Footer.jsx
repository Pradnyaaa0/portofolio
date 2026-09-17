import { PROFILE_INFO } from '../data/profile';

export default function Footer({ onScrollTo }) {
  return (
    <footer className="border-t border-neutral-200/50 dark:border-neutral-900 py-12 px-6 md:px-12 lg:px-20 text-center relative z-10 max-w-7xl mx-auto lg:pl-32 xl:pl-36">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-6 md:space-y-0">
        <div className="flex items-center justify-center space-x-2 md:justify-start">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
            P
          </div>
          <span className="font-bold text-neutral-900 dark:text-white">{PROFILE_INFO.name}</span>
        </div>

        <p className="text-xs text-neutral-500 font-mono">
          &copy; {new Date().getFullYear()} {PROFILE_INFO.name}. All Rights Reserved. Built with React & Tailwind CSS.
        </p>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-mono text-neutral-500">
          <span className="hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => onScrollTo?.('home')}>Home</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => onScrollTo?.('about')}>About</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => onScrollTo?.('skills')}>Technology</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => onScrollTo?.('featured-projects')}>Projects</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => onScrollTo?.('contact')}>Contact</span>
        </div>
      </div>
    </footer>
  );
}
