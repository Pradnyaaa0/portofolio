import { useState, useEffect, useRef } from 'react';
import {
  Home as HomeIcon,
  User,
  Cpu,
  Briefcase,
  Layers,
  Mail,
  ExternalLink,
  Code2,
  Database,
  Terminal,
  Settings,
  Menu,
  X,
  CheckCircle2,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  Download,
  Calendar,
  Layers3,
  Clock,
  ThumbsUp,
  ArrowRight,
  Send,
  Loader2
} from 'lucide-react';
import ajikzImage from './assets/ajikzcomputer.jpeg';
import resepImage from './assets/resepajik.png';
import ijukImage from './assets/ijuksecondbali.png';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

import ParticleBackground from './components/ParticleBackground';
import CursorEffect from './components/CursorEffect';
import LoadingScreen from './components/LoadingScreen';
import WhatsAppChat from './components/WhatsAppChat';

function CountUp({ end, duration = 1500, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const endValue = parseInt(end, 10);
    if (isNaN(endValue)) {
      setCount(end);
      return;
    }

    const totalSteps = 40;
    const stepTime = Math.max(duration / totalSteps, 16);
    const increment = endValue / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        clearInterval(timer);
        setCount(endValue);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, end, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

const parseStatValue = (valStr) => {
  const num = parseInt(valStr, 10);
  const suffix = valStr.replace(/[0-9]/g, '');
  return { num, suffix };
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLightMode, setIsLightMode] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Typing Effect State
  const [typedText, setTypedText] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);


  // Contact Form State
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [timelineTab, setTimelineTab] = useState('pengalaman');
  const [selectedProject, setSelectedProject] = useState(null);

  const titles = [
    'Mahasiswa Informatika',
    'Fullstack Web Developer',
    'Mobile Developer',
    'Software Engineer'
  ];

  // Ref list for sections
  const sections = {
    beranda: useRef(null),
    tentang: useRef(null),
    keahlian: useRef(null),
    'featured-projects': useRef(null),
    pengalaman: useRef(null),
    layanan: useRef(null),
    kontak: useRef(null),
  };

  // Typing animation effect
  useEffect(() => {
    if (isLoading) return;

    const currentTitle = titles[titleIndex];
    let typingSpeed = isDeleting ? 30 : 75;

    if (!isDeleting && charIndex === currentTitle.length) {
      typingSpeed = 2000; // Pause at the end
      setIsDeleting(true);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % titles.length);
      typingSpeed = 500; // Pause before typing next
    }

    const timer = setTimeout(() => {
      setTypedText(
        isDeleting
          ? currentTitle.substring(0, charIndex - 1)
          : currentTitle.substring(0, charIndex + 1)
      );
      setCharIndex((prev) => (isDeleting ? prev - 1 : prev + 1));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, titleIndex, isLoading]);

  // Scroll Reveal and Active Section highlight using IntersectionObserver
  useEffect(() => {
    if (isLoading) return;

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

    // Section highlight observer
    const sectionObserverOptions = {
      root: null,
      threshold: 0.2,
      rootMargin: '0px 0px -30% 0px',
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, sectionObserverOptions);

    Object.values(sections).forEach((ref) => {
      if (ref.current) sectionObserver.observe(ref.current);
    });

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [isLoading]);

  // Smooth Scroll handler
  const handleScrollTo = (sectionKey) => {
    setMobileMenuOpen(false);
    sections[sectionKey].current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formState.name.trim()) errors.name = 'Nama wajib diisi';
    if (!formState.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = 'Format email tidak valid';
    }
    if (!formState.subject.trim()) errors.subject = 'Subjek wajib diisi';
    if (!formState.message.trim()) {
      errors.message = 'Pesan wajib diisi';
    } else if (formState.message.trim().length < 10) {
      errors.message = 'Pesan minimal terdiri dari 10 karakter';
    }
    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Construct email parameters
    const emailTo = "arthapradnya05@gmail.com";
    const emailSubject = encodeURIComponent(formState.subject);
    const emailBody = encodeURIComponent(
      `Nama Pengirim: ${formState.name}\n` +
      `Email Pengirim: ${formState.email}\n\n` +
      `Pesan:\n${formState.message}`
    );

    // Redirect to mailto
    window.location.href = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;

    // Simulate premium submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormState({ name: '', email: '', subject: '', message: '' });

      // Auto close success popup after 5s
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  // Skills Data categorized
  const skillCategories = [
    {
      title: 'Frontend Development',
      skills: [
        { name: 'HTML & CSS', level: 95 },
        { name: 'Bootstrap', level: 90 },
        { name: 'Tailwind CSS', level: 45 },
        { name: 'React JS', level: 60 }
      ]
    },
    {
      title: 'Backend & Database',
      skills: [
        { name: 'PHP & Laravel', level: 85 },
        { name: 'Java', level: 80 },
        { name: 'Python', level: 78 },
        { name: 'MySQL & SQLite', level: 85 }
      ]
    },
    {
      title: 'Tools & Platform',
      skills: [
        { name: 'Android Studio', level: 82 },
        { name: 'Git & GitHub', level: 85 },
        { name: 'VS Code', level: 92 },
        { name: 'Antigravity', level: 88 }
      ]
    }
  ];

  // Project data list
  const projects = [
    {
      id: 1,
      title: 'Ajikz_Computer',
      category: 'Repository GitHub',
      tech: ['Java', 'Desktop App', 'Inventory'],
      desc: 'Aplikasi desktop berbasis Java untuk manajemen inventaris toko komputer Ajikz Computer. Sistem ini dirancang untuk memudahkan pengelolaan stok barang, pencatatan transaksi penjualan harian, dan pembuatan laporan bisnis secara terstruktur. Dibangun dengan antarmuka yang intuitif sehingga mudah dioperasikan oleh staf toko.',
      features: [
        'Sistem login aman dengan validasi pengguna',
        'Manajemen produk: tambah, edit, dan hapus data barang',
        'Pencatatan transaksi penjualan secara real-time',
        'Laporan stok & penjualan yang terorganisir',
        'Antarmuka GUI yang bersih dan mudah digunakan',
        'Penyimpanan data lokal menggunakan database relasional',
        'Notifikasi stok barang yang hampir habis'
      ],
      isFeatured: true,
      image: ajikzImage,
      imageAlt: 'Preview Ajikz Computer',
      imageHint: '',
      codeLink: 'https://github.com/Pradnyaaa0/Ajikz_Computer'
    },
    {
      id: 2,
      title: 'resep-ajik',
      category: 'Repository GitHub',
      tech: ['Blade', 'Laravel', 'Web App'],
      desc: 'Website resep masakan berbasis Laravel dengan sistem multi-peran (role-based) yang membedakan akses antara Admin dan Pengguna. Platform ini memudahkan pengelolaan konten resep secara terpusat, dengan tampilan yang responsif dan pengalaman pengguna yang nyaman di berbagai perangkat.',
      features: [
        'Sistem autentikasi dengan dua role: Admin dan User',
        'Admin: tambah, edit, hapus, dan kelola semua resep',
        'Admin: manajemen kategori masakan',
        'User: jelajahi dan cari resep berdasarkan kategori',
        'Halaman detail resep dengan bahan & langkah pembuatan lengkap',
        'Filter dan pencarian resep yang responsif',
        'Desain antarmuka mobile-friendly dengan Blade & Bootstrap',
        'Sistem notifikasi dan validasi formulir dinamis'
      ],
      isFeatured: true,
      image: resepImage,
      imageAlt: 'Preview resep ajik',
      imageHint: '',
      codeLink: 'https://github.com/Pradnyaaa0/resep-ajik'
    },
    {
      id: 3,
      title: 'IjukSecond_Bali',
      category: 'Repository GitHub',
      tech: ['HTML', 'Landing Page', 'Web'],
      desc: 'Landing page promosi produk IjukSecond Bali — platform jual-beli barang bekas berkualitas yang berbasis di Bali. Halaman ini dirancang untuk memperkenalkan brand secara profesional kepada calon pembeli, menampilkan produk unggulan, serta mendorong interaksi langsung melalui tombol ajakan bertindak (CTA) yang strategis.',
      features: [
        'Hero section promosi yang menarik dan impresif',
        'Galeri produk unggulan dengan tampilan visual yang bersih',
        'Tombol CTA pemesanan cepat terintegrasi WhatsApp',
        'Informasi brand & keunggulan produk IjukSecond',
        'Layout responsif yang optimal di mobile & desktop',
        'Desain warna & tipografi yang konsisten dengan identitas brand',
        'Performa loading halaman yang ringan dan cepat'
      ],
      isFeatured: true,
      image: ijukImage,
      imageAlt: 'Preview IjukSecond Bali',
      imageHint: '',
      codeLink: 'https://github.com/Pradnyaaa0/IjukSecond_Bali'
    }
  ];

  // Services Data
  const services = [
    {
      title: 'Pengembangan Website',
      desc: 'Membangun website modern, responsif, dan ramah SEO dengan performa tinggi untuk bisnis, profil instansi, maupun portofolio kustom.',
      icon: <Code2 className="w-8 h-8 text-indigo-400" />
    },
    {
      title: 'Sistem Informasi Kustom',
      desc: 'Membangun dashboard internal, sistem pelaporan keuangan, dan aplikasi berbasis manajemen alur kerja yang terstruktur dengan aman.',
      icon: <Layers3 className="w-8 h-8 text-purple-400" />
    },
    {
      title: 'Desain UI / UX',
      desc: 'Membuat mockup interaktif, wireframe, dan arsitektur visual antarmuka pengguna yang bersih, ergonomis, berpusat pada kenyamanan pengguna.',
      icon: <Settings className="w-8 h-8 text-indigo-400" />
    },
    {
      title: 'Pengembangan Perangkat Lunak',
      desc: 'Membangun aplikasi desktop GUI dengan pengolahan data lokal terstruktur, integrasi API eksternal, dan automasi tugas harian.',
      icon: <Terminal className="w-8 h-8 text-purple-400" />
    }
  ];

  // Education & Experience Data
  const educationData = [
    {
      period: '2024 - Sekarang',
      institution: 'S1 Informatika - Institut Bisnis dan Teknologi Indonesia (INSTIKI)',
      desc: 'Fokus pada pemrograman perangkat lunak, sistem basis data, algoritma, dan teknologi informasi. Aktif dalam berbagai proyek pengembangan aplikasi.',
      tags: ['Informatika', 'INSTIKI', 'Denpasar']
    },
    {
      period: '2021 - 2024',
      institution: 'SMA Negeri 1 Tegallalang',
      desc: 'Pendidikan Menengah Atas.',
      tags: ['MIPA', 'Tegallalang']
    },
    {
      period: '2018 - 2021',
      institution: 'SMP Negeri Tegallalang',
      desc: 'Pendidikan Menengah Pertama.',
      tags: ['SMP', 'Tegallalang']
    },
    {
      period: '2012 - 2018',
      institution: 'SD Negeri 2 Sebatu',
      desc: 'Pendidikan Dasar.',
      tags: ['SD', 'Sebatu']
    }
  ];

  const experienceData = [
    {
      period: '2025',
      type: 'Akademik (Proyek Kelompok)',
      title: 'Perancangan & Pengembangan Aplikasi Web/Mobile',
      desc: 'Bekerja sama dalam tim untuk merancang dan mengembangkan aplikasi berbasis web dan mobile, mulai dari analisis kebutuhan hingga implementasi fitur. Berkontribusi dalam pengembangan fitur autentikasi pengguna, dashboard administrasi, manajemen data, serta proses debugging dan penyelesaian masalah teknis selama pengerjaan proyek.',
      tags: ['Web & Mobile', 'Autentikasi', 'Database', 'Debugging']
    },
    {
      period: '2025',
      type: 'Akademik (Proyek Mandiri)',
      title: 'Website Portofolio Pribadi (React.js)',
      desc: 'Membangun website portofolio pribadi menggunakan React.js dengan fokus pada desain responsif, antarmuka interaktif, dan pengalaman pengguna yang baik.',
      tags: ['React JS', 'Responsive Design', 'UX']
    },
    {
      period: '2025',
      type: 'Akademik (Proyek Mandiri)',
      title: 'Sistem Penyewaan Barang Elektronik (Android)',
      desc: 'Mengembangkan sistem penyewaan barang elektronik secara mandiri menggunakan Java dan Android Studio, mulai dari perancangan database relasional SQLite hingga implementasi fitur aplikasi.',
      tags: ['Java', 'Android Studio', 'SQLite']
    },
    {
      period: '2025',
      type: 'Non-Akademik (Organisasi)',
      title: 'Panitia KEBUS Event - UKM Tabuh',
      desc: 'Berkontribusi aktif sebagai panitia dalam menyelenggarakan KEBUS Event yang diselenggarakan oleh Unit Kegiatan Mahasiswa (UKM) Tabuh.',
      tags: ['Kepanitiaan', 'UKM Tabuh', 'Kerjasama Tim']
    },
    {
      period: '2024',
      type: 'Non-Akademik (Organisasi)',
      title: 'Panitia Konser STT',
      desc: 'Berkontribusi sebagai panitia dalam perencanaan dan pelaksanaan Konser STT (Sekaa Teruna Teruni) di lingkungan masyarakat.',
      tags: ['Kepanitiaan', 'Event Organizer', 'Komunikasi']
    }
  ];

  // Statistics Data
  const stats = [
    { value: '5+', label: 'Proyek Selesai', desc: 'Sistem Informasi, Web, Mobile, & Desktop' },
    { value: '9+', label: 'Teknologi Dikuasai', desc: 'PHP, Java, Python, React, Laravel, MySQL, SQLite' },
    { value: '100+', label: 'Jam Coding Proyek', desc: 'Menulis & menyempurnakan skrip' },
    { value: '100%', label: 'Semangat Belajar', desc: 'Mengikuti tren teknologi terbaru' }
  ];

  const featuredProjects = projects.filter(p => p.isFeatured);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className={`custom-cursor-area relative min-h-screen transition-colors duration-500 overflow-x-hidden ${isLightMode ? 'light bg-[#fafafa] text-neutral-800' : 'dark bg-[#07070a] text-neutral-200'
      }`}>
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

      {/* HEADER / MOBILE NAVIGATION */}
      <header className="fixed top-0 inset-x-0 h-16 z-40 lg:hidden glass-nav flex items-center justify-between px-6 transition-all duration-300">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
            P
          </div>
          <span className="font-bold tracking-tight text-neutral-900 dark:text-white">Pradnya Putra</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Light/Dark Toggle Mobile */}
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            aria-label="Toggle Theme"
          >
            {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAV MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-neutral-950/90 backdrop-blur-xl lg:hidden flex flex-col justify-center px-8 space-y-6">
          <div className="absolute top-5 right-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {[
            { key: 'beranda', label: 'Beranda', icon: <HomeIcon className="w-5 h-5" /> },
            { key: 'tentang', label: 'Tentang Saya', icon: <User className="w-5 h-5" /> },
            { key: 'keahlian', label: 'Keahlian', icon: <Cpu className="w-5 h-5" /> },
            { key: 'featured-projects', label: 'Proyek Terbaik', icon: <Code2 className="w-5 h-5" /> },
            { key: 'pengalaman', label: 'Pengalaman', icon: <Briefcase className="w-5 h-5" /> },
            { key: 'layanan', label: 'Layanan', icon: <Layers className="w-5 h-5" /> },
            { key: 'kontak', label: 'Hubungi Saya', icon: <Mail className="w-5 h-5" /> },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleScrollTo(item.key)}
              className="flex items-center space-x-4 text-xl font-medium text-neutral-400 hover:text-white transition-colors py-2 text-left"
            >
              <span className="text-indigo-400">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* DESKTOP SIDEBAR NAVIGATION (STYLISH DOCK) */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center space-y-6 z-40 py-8 px-4 rounded-3xl glass-nav shadow-2xl">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 mb-4 select-none hover-target">
          PP
        </div>

        <nav className="flex flex-col space-y-3">
          {[
            { key: 'beranda', tooltip: 'Beranda', icon: <HomeIcon className="w-5 h-5" /> },
            { key: 'tentang', tooltip: 'Tentang Saya', icon: <User className="w-5 h-5" /> },
            { key: 'keahlian', tooltip: 'Keahlian', icon: <Cpu className="w-5 h-5" /> },
            { key: 'featured-projects', tooltip: 'Proyek Terbaik', icon: <Code2 className="w-5 h-5" /> },
            { key: 'pengalaman', tooltip: 'Pengalaman', icon: <Briefcase className="w-5 h-5" /> },
            { key: 'layanan', tooltip: 'Layanan', icon: <Layers className="w-5 h-5" /> },
            { key: 'kontak', tooltip: 'Kontak', icon: <Mail className="w-5 h-5" /> },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleScrollTo(item.key)}
              className={`hover-target w-11 h-11 rounded-xl flex items-center justify-center relative group transition-all duration-300 ${activeSection === item.key
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/40 dark:hover:bg-neutral-800/50'
                }`}
            >
              {item.icon}
              {/* Tooltip */}
              <span className="absolute left-16 bg-neutral-900 border border-neutral-800 text-white text-xs font-medium py-1 px-3 rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                {item.tooltip}
              </span>
            </button>
          ))}
        </nav>

        <div className="w-8 h-[1px] bg-neutral-800 my-2" />

        {/* Light/Dark Toggle Desktop */}
        <button
          onClick={() => setIsLightMode(!isLightMode)}
          className="hover-target w-11 h-11 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/40 dark:hover:bg-neutral-800/50 transition-colors"
          aria-label="Toggle Theme"
        >
          {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="lg:pl-32 xl:pl-36 z-10 relative">

        {/* HERO SECTION */}
        <section
          id="beranda"
          ref={sections.beranda}
          className="min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 md:px-12 lg:px-20 max-w-7xl relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center w-full">

            {/* LEFT: Text Content */}
            <div className="relative z-10 text-left">
              <div className="inline-flex items-center space-x-2 bg-indigo-500/10 dark:bg-indigo-500/5 border border-indigo-500/20 rounded-full py-1.5 px-4 mb-6 hover-target hover:border-indigo-500/40 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300">Tersedia untuk Magang &amp; Proyek</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                Halo, Saya <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 drop-shadow-sm font-sans select-none">
                  Pradnya Putra
                </span>
              </h1>

              {/* Dynamic Typing Title */}
              <div className="h-10 sm:h-12 flex items-center mb-6">
                <span className="text-lg sm:text-xl font-medium font-mono text-neutral-600 dark:text-neutral-400">
                  {typedText}
                </span>
                <span className="w-[3px] h-6 sm:h-7 bg-indigo-500 ml-1.5 animate-pulse select-none" />
              </div>

              <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 mb-8 max-w-xl leading-relaxed">
                "Mentransformasikan Ide menjadi Solusi Digital Melalui Baris Kode."
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <button
                  onClick={() => handleScrollTo('featured-projects')}
                  data-cursor-label="Proyek"
                  className="hover-target px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/45 transition-all duration-300 flex items-center justify-center space-x-2 border border-indigo-500/20 group"
                >
                  <span>Lihat Proyek</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="/CV_Nyoman_Artha_Pradnya_Putra.pdf"
                  download="CV_Nyoman_Artha_Pradnya_Putra.pdf"
                  data-cursor-label="CV Nyoman"
                  className="hover-target px-8 py-4 rounded-xl font-semibold bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Unduh CV</span>
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* RIGHT: Profile Photo with Orbiting Tech Icons */}
            <div className="relative flex items-center justify-center lg:justify-end z-10 select-none py-16">
              {/* Outer pulsing glow rings */}
              <div className="absolute w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-indigo-500/25 via-purple-500/15 to-cyan-500/10 blur-3xl pointer-events-none animate-pulse-slow" />
              <div className="absolute w-[320px] h-[320px] rounded-full border border-indigo-500/10 pointer-events-none" />
              <div className="absolute w-[360px] h-[360px] rounded-full border border-purple-500/5 pointer-events-none animate-pulse-slow" />

              {/* Profile photo container — LARGER */}
              <div className="relative w-80 h-80 sm:w-[340px] sm:h-[340px]">
                {/* Main circular photo */}
                <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-indigo-500/40 shadow-2xl shadow-indigo-500/30 relative">
                  <img
                    src="/src/assets/profile.jpg"
                    alt="Foto Profil Pradnya Putra"
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback monogram */}
                  <div
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 items-center justify-center text-white text-7xl font-black select-none"
                    style={{ display: 'none' }}
                  >
                    PP
                  </div>
                  {/* Depth overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 via-transparent to-transparent rounded-full pointer-events-none" />
                </div>

                {/* ═══ ORBITING TECH ICON BADGES — CDN IMAGE LOGOS ═══ */}

                {/* HTML5 — kiri atas */}
                <div className="group absolute -top-5 -left-5 w-14 h-14 rounded-full bg-white dark:bg-neutral-950 border-2 border-orange-500/50 shadow-xl shadow-orange-500/20 flex items-center justify-center animate-float-slow cursor-pointer hover:scale-125 hover:border-orange-400 hover:shadow-orange-500/50 hover:z-20 transition-all duration-300">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                    alt="HTML5"
                    className="w-8 h-8 object-contain"
                    draggable="false"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-orange-500/40 text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">HTML5</span>
                </div>

                {/* CSS3 — kanan atas */}
                <div className="group absolute -top-3 -right-7 w-14 h-14 rounded-full bg-white dark:bg-neutral-950 border-2 border-blue-500/50 shadow-xl shadow-blue-500/20 flex items-center justify-center animate-float-medium cursor-pointer hover:scale-125 hover:border-blue-400 hover:shadow-blue-500/50 hover:z-20 transition-all duration-300">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                    alt="CSS3"
                    className="w-8 h-8 object-contain"
                    draggable="false"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-blue-500/40 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">CSS3</span>
                </div>

                {/* Tailwind CSS — kanan tengah */}
                <div className="group absolute top-1/2 -translate-y-1/2 -right-9 w-14 h-14 rounded-full bg-white dark:bg-neutral-950 border-2 border-cyan-400/60 shadow-xl shadow-cyan-400/25 flex items-center justify-center animate-float-fast cursor-pointer hover:scale-125 hover:border-cyan-300 hover:shadow-cyan-400/50 hover:z-20 transition-all duration-300">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
                    alt="Tailwind CSS"
                    className="w-8 h-8 object-contain"
                    draggable="false"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Tailwind</span>
                </div>

                {/* PHP/Laravel — bawah kanan */}
                <div className="group absolute -bottom-3 -right-5 w-14 h-14 rounded-full bg-white dark:bg-neutral-950 border-2 border-violet-500/50 shadow-xl shadow-violet-500/20 flex items-center justify-center animate-float-slow cursor-pointer hover:scale-125 hover:border-violet-400 hover:shadow-violet-500/50 hover:z-20 transition-all duration-300">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg"
                    alt="Laravel"
                    className="w-9 h-9 object-contain"
                    draggable="false"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-violet-500/40 text-violet-300 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Laravel</span>
                </div>

                {/* Python — bawah kiri */}
                <div className="group absolute -bottom-5 -left-3 w-14 h-14 rounded-full bg-white dark:bg-neutral-950 border-2 border-yellow-400/50 shadow-xl shadow-yellow-400/20 flex items-center justify-center animate-float-medium cursor-pointer hover:scale-125 hover:border-yellow-300 hover:shadow-yellow-400/50 hover:z-20 transition-all duration-300">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                    alt="Python"
                    className="w-8 h-8 object-contain"
                    draggable="false"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-yellow-400/40 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Python</span>
                </div>

                {/* MySQL — kiri tengah */}
                <div className="group absolute top-1/2 -translate-y-1/2 -left-11 w-14 h-14 rounded-full bg-white dark:bg-neutral-950 border-2 border-teal-400/50 shadow-xl shadow-teal-400/20 flex items-center justify-center animate-float-fast cursor-pointer hover:scale-125 hover:border-teal-300 hover:shadow-teal-400/50 hover:z-20 transition-all duration-300">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
                    alt="MySQL"
                    className="w-8 h-8 object-contain"
                    draggable="false"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-teal-400/40 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">MySQL</span>
                </div>

                {/* Java — atas tengah */}
                <div className="group absolute -top-10 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white dark:bg-neutral-950 border-2 border-red-500/50 shadow-xl shadow-red-500/20 flex items-center justify-center animate-float-medium cursor-pointer hover:scale-125 hover:border-red-400 hover:shadow-red-500/50 hover:z-20 transition-all duration-300">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
                    alt="Java"
                    className="w-8 h-8 object-contain"
                    draggable="false"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-red-500/40 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Java</span>
                </div>

                {/* Git — bawah tengah */}
                <div className="group absolute -bottom-10 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white dark:bg-neutral-950 border-2 border-red-400/50 shadow-xl shadow-red-400/20 flex items-center justify-center animate-float-slow cursor-pointer hover:scale-125 hover:border-red-300 hover:shadow-red-400/50 hover:z-20 transition-all duration-300">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
                    alt="Git"
                    className="w-8 h-8 object-contain"
                    draggable="false"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-red-400/40 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Git</span>
                </div>

                {/* Android Studio — kiri bawah */}
                <div className="group absolute bottom-8 -left-10 w-12 h-12 rounded-full bg-white dark:bg-neutral-950 border-2 border-green-500/50 shadow-xl shadow-green-500/20 flex items-center justify-center animate-float-medium cursor-pointer hover:scale-125 hover:border-green-400 hover:shadow-green-500/50 hover:z-20 transition-all duration-300">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg"
                    alt="Android Studio"
                    className="w-7 h-7 object-contain"
                    draggable="false"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-green-500/40 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Android</span>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ABOUT SECTION */}
        <section
          id="tentang"
          ref={sections.tentang}
          className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl relative"
        >
          <div className="reveal-element">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-500 dark:text-indigo-400 font-mono block mb-2">Tentang Saya</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-12">Siapa Saya?</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Profile Graphics card */}
            <div className="lg:col-span-5 reveal-element-left">
              <div className="glass-card border-beam-glow p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Visual System Panel Mockup */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span className="text-xs text-neutral-500 font-mono ml-2">bio.json</span>
                </div>

                <div className="font-mono text-sm space-y-4 text-neutral-400 leading-relaxed">
                  <p>
                    <span className="text-indigo-400">const</span> developer = &#123;
                  </p>
                  <p className="pl-4">
                    name: <span className="text-cyan-400">"Pradnya Putra"</span>,
                  </p>
                  <p className="pl-4">
                    role: <span className="text-cyan-400">"Informatics Student & Developer"</span>,
                  </p>
                  <p className="pl-4">
                    interests: [
                    <span className="text-purple-400">"Web & Mobile"</span>,
                    <span className="text-purple-400">"Database Systems"</span>,
                    <span className="text-purple-400">"Software Engineering"</span>
                    ],
                  </p>
                  <p className="pl-4">
                    focus: <span className="text-cyan-400">"Scalable & Efficient Apps"</span>,
                  </p>
                  <p className="pl-4">
                    passionate: <span className="text-indigo-400">true</span>
                  </p>
                  <p>&#125;;</p>
                </div>

                {/* Decorative Tech Icon Grid */}
                <div className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50 flex justify-between text-neutral-500 text-xs font-mono">
                  <span>LOC: BALI, ID</span>
                  <span>STATUS: MAHASISWA AKTIF</span>
                </div>
              </div>
            </div>

            {/* Compelling Description */}
            <div className="lg:col-span-7 space-y-6 text-left reveal-element-right">
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                Mahasiswa Informatika yang Berdedikasi dan Pengembang Perangkat Lunak.
              </h3>

              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Saya adalah mahasiswa S1 Informatika di Institut Bisnis dan Teknologi Indonesia (INSTIKI) yang memiliki minat mendalam pada pengembangan perangkat lunak, pengelolaan data, dan teknologi informasi. Saya mampu bekerja secara individu maupun tim serta memiliki semangat untuk terus belajar dan berkembang.
              </p>

              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Saya terbiasa merancang arsitektur database, menyusun alur logika backend, serta membangun antarmuka web dan mobile yang responsif. Keterlibatan aktif dalam proyek kelompok akademis maupun proyek mandiri melatih saya untuk memecahkan masalah kompleks dan mengimplementasikan fitur fungsional secara efisien.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-200/55 dark:border-neutral-800/40">
                  <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-lg mb-1">Web &amp; Mobile Dev</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">Membangun aplikasi responsif dengan React JS, Java (Android Studio), PHP Laravel, dan Bootstrap.</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-200/55 dark:border-neutral-800/40">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400 text-lg mb-1">Arsitektur Data</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">Pemodelan ERD, normalisasi data, dan manajemen database MySQL serta SQLite.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section
          id="keahlian"
          ref={sections.keahlian}
          className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl relative"
        >
          <div className="reveal-element">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-500 dark:text-indigo-400 font-mono block mb-2">Keahlian Teknis</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-12">Teknologi yang Saya Kuasai</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skillCategories.map((category, idx) => (
              <div
                key={idx}
                className="glass-card border-beam-glow p-8 rounded-3xl reveal-element"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <h3 className="text-xl font-bold mb-6 flex items-center space-x-2 text-indigo-400">
                  <Settings className="w-5 h-5 text-indigo-500" />
                  <span>{category.title}</span>
                </h3>

                <div className="space-y-6">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{skill.name}</span>
                        <span className="text-neutral-500 dark:text-neutral-400 font-mono">{skill.level}%</span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PROJECTS SECTION */}
        <section
          id="featured-projects"
          ref={sections['featured-projects']}
          className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl relative"
        >
          <div className="reveal-element">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-500 dark:text-indigo-400 font-mono block mb-2">Unggulan</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-12">Proyek Terbaik Saya</h2>
          </div>

          <div className="space-y-12">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="glass-card border-beam-glow rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative reveal-element"
              >
                {/* Project Image Panel */}
                <div className="lg:col-span-5 p-8 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-neutral-200/50 dark:border-neutral-800/50 min-h-[300px]">
                  <div
                    className="relative w-full overflow-hidden rounded-[32px] border border-neutral-800 shadow-2xl bg-neutral-950 cursor-pointer group"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="w-full aspect-video overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute left-6 bottom-6 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {project.category}
                    </div>
                  </div>
                </div>

                {/* Project Specs */}
                <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                      {project.title}
                    </h3>

                    <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
                      {project.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedProject(project)}
                      data-cursor-label="Detail"
                      className="hover-target inline-flex items-center justify-center space-x-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
                    >
                      <span>Lihat Detail</span>
                    </button>
                    <a
                      href={project.codeLink}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor-label="Open Repo"
                      className="hover-target inline-flex items-center justify-center space-x-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-5 py-3 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-colors"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span>Source Code</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 transition-all duration-300"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="relative w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-2xl dark:bg-[#0c0c10] dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800/80 flex flex-col sm:flex-row transition-transform duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-4 top-4 z-30 rounded-full bg-neutral-900/80 dark:bg-neutral-800/80 text-white p-2.5 hover:bg-neutral-800 dark:hover:bg-neutral-700 hover:scale-110 active:scale-95 transition-all shadow-lg hover:rotate-90 duration-300"
                aria-label="Tutup detail proyek"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-h-[85vh]">
                {/* Left Panel: Image Preview & Actions */}
                <div className="lg:col-span-6 bg-neutral-950 flex flex-col justify-center items-center relative min-h-[250px] sm:min-h-[350px] lg:min-h-[500px] p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-neutral-200/20 dark:border-neutral-800/40">
                  {/* Decorative glowing gradient backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent opacity-50" />

                  <div className="relative w-full h-full flex flex-col justify-center items-center z-10">
                    <div className="w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-video rounded-2xl overflow-hidden border border-neutral-800/80 shadow-2xl bg-neutral-900/40">
                      <img
                        src={selectedProject.image}
                        alt={selectedProject.imageAlt}
                        className="w-full h-full object-cover bg-neutral-950 hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Action buttons under the image */}
                    <div className="mt-8 w-full flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href={selectedProject.codeLink}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor-label="Open Repo"
                        className="hover-target inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/45 transition-all duration-300 w-full sm:w-auto"
                      >
                        <GithubIcon className="w-4 h-4" />
                        <span>Source Code Repositori</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Content Details */}
                <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-[50vh] lg:max-h-[85vh] flex flex-col justify-between text-left">
                  <div className="space-y-6">
                    <div>
                      <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400">
                        {selectedProject.category}
                      </span>
                      <h3 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
                        {selectedProject.title}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {selectedProject.desc}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                        Teknologi &amp; Tools
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech.map((tech, idx) => (
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
                        Fitur Utama
                      </h4>
                      <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                        {selectedProject.features?.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs mt-0.5 font-bold">✓</span>
                            <span className="leading-normal">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>


                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-900 text-xs text-neutral-400 dark:text-neutral-500 font-mono flex justify-between">
                    <span>ID: 0{selectedProject.id}</span>
                    <span>© {new Date().getFullYear()} Nyoman Artha</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPERIENCE & EDUCATION TIMELINE */}
        <section
          id="pengalaman"
          ref={sections.pengalaman}
          className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl relative"
        >
          <div className="reveal-element">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-500 dark:text-indigo-400 font-mono block mb-2">Rekam Jejak</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">Pengalaman &amp; Pendidikan</h2>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center reveal-element">
            <button
              onClick={() => setTimelineTab('pengalaman')}
              className={`hover-target px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border ${timelineTab === 'pengalaman'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
            >
              Pengalaman (Akademik &amp; Organisasi)
            </button>
            <button
              onClick={() => setTimelineTab('pendidikan')}
              className={`hover-target px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border ${timelineTab === 'pendidikan'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
            >
              Riwayat Pendidikan
            </button>
          </div>

          <div className="relative border-l border-neutral-200 dark:border-neutral-800 max-w-3xl mx-auto pl-6 sm:pl-8 text-left">
            {(timelineTab === 'pengalaman' ? experienceData : educationData).map((item, index) => (
              <div key={index} className="mb-12 relative last:mb-0 reveal-element">
                {/* Glowing Bullet Node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-neutral-50 dark:border-[#07070a] shadow-[0_0_10px_rgba(99,102,241,0.8)]" />

                <div className="bg-neutral-100/50 dark:bg-neutral-900/20 border border-neutral-200/50 dark:border-neutral-800/40 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold font-mono tracking-wide text-indigo-400 block mb-1">
                        {item.period}
                      </span>
                      {item.type && (
                        <span className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono mb-2 sm:mb-0">
                          {item.type}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2 sm:mt-0">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    {item.title || item.institution}
                  </h3>

                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section
          id="layanan"
          ref={sections.layanan}
          className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl relative"
        >
          <div className="reveal-element">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-500 dark:text-indigo-400 font-mono block mb-2">Layanan Profesional</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-12">Apa yang Bisa Saya Lakukan?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="glass-card border-beam-glow p-8 rounded-2xl text-left flex flex-col justify-between relative overflow-hidden reveal-element"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-center mb-6">
                    {service.icon}
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    {service.title}
                  </h3>

                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section
          id="statistik"
          className="py-20 px-6 md:px-12 lg:px-20 max-w-7xl relative"
        >
          <div className="glass-card p-10 md:p-14 rounded-3xl relative overflow-hidden reveal-element">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, idx) => {
                const { num, suffix } = parseStatValue(stat.value);
                return (
                  <div key={idx} className="text-center space-y-2">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 font-sans select-none">
                      <CountUp end={num} suffix={suffix} />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                      {stat.label}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      {stat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section
          id="kontak"
          ref={sections.kontak}
          className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl relative mb-16"
        >
          <div className="reveal-element">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-500 dark:text-indigo-400 font-mono block mb-2">Kontak Hubung</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-12">Mari Berkolaborasi</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Details Panel */}
            <div className="lg:col-span-5 text-left space-y-8 reveal-element-left">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  Tertarik untuk bekerja sama?
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Jika Anda mencari mahasiswa IT yang berdedikasi untuk magang, pengembang lepas (freelancer) untuk sistem informasi, atau sekadar ingin berdiskusi teknologi, silakan tinggalkan pesan!
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/80 dark:bg-neutral-900/60 border border-neutral-300/80 dark:border-neutral-800 shadow-sm text-neutral-700 dark:text-neutral-200">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold">
                    @
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Kirim Email ke:</span>
                    <a href="mailto:arthapradnya05@gmail.com" className="hover-target text-sm font-semibold text-neutral-800 dark:text-neutral-100 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                      arthapradnya05@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/80 dark:bg-neutral-900/60 border border-neutral-300/80 dark:border-neutral-800 shadow-sm text-neutral-700 dark:text-neutral-200">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold">
                    📍
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Domisili:</span>
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">Denpasar, Bali, Indonesia</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/80 dark:bg-neutral-900/60 border border-neutral-300/80 dark:border-neutral-800 shadow-sm text-neutral-700 dark:text-neutral-200">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                    📞
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Hubungi Telepon / WA:</span>
                    <a href="tel:+6285737036100" className="hover-target text-sm font-semibold text-neutral-800 dark:text-neutral-100 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                      +62 857-3703-6100
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media Link Icons */}
              <div className="flex space-x-3 pt-2">
                {[
                  { icon: <GithubIcon className="w-5 h-5" />, url: 'https://github.com/Pradnyaaa0', label: 'Github' },
                  { icon: <LinkedinIcon className="w-5 h-5" />, url: 'https://www.linkedin.com/in/pradnya-putra-9b6543377?utm_source=share_via&utm_content=profile&utm_medium=member_ios', label: 'LinkedIn' },
                  { icon: <InstagramIcon className="w-5 h-5" />, url: 'https://www.instagram.com/pradnyaptraa?igsh=MWEwOGJuYW4xOXRkMw%3D%3D&utm_source=qr', label: 'Instagram' }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-label={social.label}
                    className="hover-target w-11 h-11 rounded-xl glass-card flex items-center justify-center text-neutral-400 hover:text-white hover:bg-indigo-600 transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 reveal-element-right">
              <form onSubmit={handleFormSubmit} className="glass-card border-beam-glow p-8 md:p-10 rounded-3xl space-y-6 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`hover-target w-full bg-white dark:bg-neutral-900/60 border ${formErrors.name ? 'border-red-500' : 'border-neutral-300/80 dark:border-neutral-800/85'
                        } text-neutral-900 dark:text-white rounded-xl px-4 py-3.5 pt-6 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors peer`}
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 top-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-neutral-400 dark:peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400 peer-focus:font-bold pointer-events-none"
                    >
                      Nama Lengkap
                    </label>
                    {formErrors.name && (
                      <p className="text-[10px] text-red-500 mt-1 pl-1 font-mono">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`hover-target w-full bg-white dark:bg-neutral-900/60 border ${formErrors.email ? 'border-red-500' : 'border-neutral-300/80 dark:border-neutral-800/85'
                        } text-neutral-900 dark:text-white rounded-xl px-4 py-3.5 pt-6 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors peer`}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 top-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-neutral-400 dark:peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400 peer-focus:font-bold pointer-events-none"
                    >
                      Alamat Email
                    </label>
                    {formErrors.email && (
                      <p className="text-[10px] text-red-500 mt-1 pl-1 font-mono">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject field */}
                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    placeholder=" "
                    className={`hover-target w-full bg-white dark:bg-neutral-900/60 border ${formErrors.subject ? 'border-red-500' : 'border-neutral-300/80 dark:border-neutral-800/85'
                      } text-neutral-900 dark:text-white rounded-xl px-4 py-3.5 pt-6 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors peer`}
                  />
                  <label
                    htmlFor="subject"
                    className="absolute left-4 top-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-neutral-400 dark:peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400 peer-focus:font-bold pointer-events-none"
                  >
                    Subjek Pesan
                  </label>
                  {formErrors.subject && (
                    <p className="text-[10px] text-red-500 mt-1 pl-1 font-mono">{formErrors.subject}</p>
                  )}
                </div>

                {/* Message field */}
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder=" "
                    className={`hover-target w-full bg-white dark:bg-neutral-900/60 border ${formErrors.message ? 'border-red-500' : 'border-neutral-300/80 dark:border-neutral-800/85'
                      } text-neutral-900 dark:text-white rounded-xl px-4 py-3.5 pt-6 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors peer min-h-[120px] resize-y`}
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-4 top-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-neutral-400 dark:peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400 peer-focus:font-bold pointer-events-none"
                  >
                    Isi Pesan Anda
                  </label>
                  {formErrors.message && (
                    <p className="text-[10px] text-red-500 mt-1 pl-1 font-mono">{formErrors.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="hover-target w-full py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300 flex items-center justify-center space-x-2 group cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sedikit lagi...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Pesan</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* POPUP SUCCESS DIALOG */}
        {submitSuccess && (
          <div className="fixed bottom-6 right-6 z-[999] bg-neutral-900 border border-indigo-500/35 p-5 rounded-2xl shadow-2xl flex items-start space-x-4 max-w-sm animate-bounce">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">Pesan Berhasil Terkirim!</h4>
              <p className="text-xs text-neutral-400 mt-1">Terima kasih atas pesan Anda, Pradnya Putra akan segera menghubungi Anda kembali.</p>
            </div>
            <button onClick={() => setSubmitSuccess(false)} className="text-neutral-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* FOOTER */}
        <footer className="border-t border-neutral-200/50 dark:border-neutral-900 py-12 px-6 md:px-12 lg:px-20 text-center relative z-10 max-w-7xl mx-auto lg:pl-32 xl:pl-36">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-6 md:space-y-0">
            <div className="flex items-center justify-center space-x-2 md:justify-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                P
              </div>
              <span className="font-bold text-neutral-900 dark:text-white">Pradnya Putra</span>
            </div>

            <p className="text-xs text-neutral-500 font-mono">
              &copy; {new Date().getFullYear()} Pradnya Putra. Hak Cipta Dilindungi. Built with React & Tailwind CSS.
            </p>

            <div className="flex justify-center space-x-4 text-xs font-mono text-neutral-500">
              <span className="hover:text-indigo-400 cursor-pointer" onClick={() => handleScrollTo('beranda')}>Beranda</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
