import { X } from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-2xl dark:bg-[#0c0c10] dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800/80 flex flex-col sm:flex-row transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-30 rounded-full bg-neutral-200 dark:bg-neutral-800/80 text-neutral-700 dark:text-white p-2.5 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:scale-110 active:scale-95 transition-all shadow-lg hover:rotate-90 duration-300"
          aria-label="Close project details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-h-[85vh]">
          {/* Left Panel: Image Preview & Actions */}
          <div className="lg:col-span-6 bg-neutral-100 dark:bg-neutral-950 flex flex-col justify-center items-center relative min-h-[250px] sm:min-h-[350px] lg:min-h-[500px] p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800/40">
            {/* Decorative glowing gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent opacity-50" />

            <div className="relative w-full h-full flex flex-col justify-center items-center z-10">
              <div className="w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-video rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xl bg-neutral-200/40 dark:bg-neutral-900/40">
                <img
                  src={project.image}
                  alt={project.imageAlt || project.title}
                  className="w-full h-full object-cover bg-neutral-100 dark:bg-neutral-950 hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Action button under the image */}
              <div className="mt-8 w-full flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={project.codeLink}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-label="Open Repo"
                  className="hover-target inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/45 transition-all duration-300 w-full sm:w-auto"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Source Code Repository</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Panel: Content Details */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-[50vh] lg:max-h-[85vh] flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div>
                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400">
                  {project.category}
                </span>
                <h3 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
                  {project.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {project.desc}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                  Technologies &amp; Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex rounded-lg border border-indigo-500/10 bg-indigo-500/5 px-2.5 py-1 text-xs font-mono text-indigo-600 dark:text-indigo-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                  Key Features
                </h4>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                  {project.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs mt-0.5 font-bold">✓</span>
                      <span className="leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-900 text-xs text-neutral-400 dark:text-neutral-500 font-mono flex justify-between">
              <span>ID: 0{project.id}</span>
              <span>© {new Date().getFullYear()} Nyoman Artha</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
