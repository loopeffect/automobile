import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { LanguageProvider, useLang } from '../../context/LanguageContext';

const PageContent = () => {
  const { t } = useLang();
  const categories = t.models?.categories || [];

  return (
    <>
      <section
        className="relative w-full min-h-[40vh] flex flex-col justify-end overflow-hidden"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#080c14',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-[#06080f]/70 to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pb-16 pt-32">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight">
            {t.models?.heading || 'Models'}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xl">
            {t.models?.tagline}
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0a0a0f] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-12 md:py-16 transition-colors duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to="/listings"
              className="group block relative overflow-hidden rounded-2xl border border-white/10 dark:border-gray-800 bg-white/5 dark:bg-white/5 p-6 md:p-8 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <span className="text-xl font-bold text-gray-700 dark:text-gray-300 group-hover:text-white">
                  {cat.label.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cat.label}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">{cat.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-medium">
                Browse {cat.label}
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors duration-200 shadow-md shadow-blue-500/25"
          >
            {t.models?.browseCta || 'Browse all listings'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>
    </>
  );
};

const Models = () => {
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    return () => root.classList.remove('dark');
  }, [darkMode]);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#06080f]">
        <div className="relative">
          <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode((p) => !p)} />
        </div>
        <PageContent />
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Models;
