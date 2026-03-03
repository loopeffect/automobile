import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { LanguageProvider, useLang } from '../../context/LanguageContext';

const PageContent = () => {
  const { t } = useLang();
  const items = t.technology?.items || [];

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
            {t.technology?.heading || 'Technology'}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xl">
            {t.technology?.tagline}
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0a0a0f] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-12 md:py-16 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="group relative bg-gradient-to-br from-white/10 to-white/5 dark:from-white/10 dark:to-white/5 border border-white/10 dark:border-gray-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center opacity-80 group-hover:opacity-100">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 pr-10">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/brand" className="inline-flex items-center gap-2 border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-sm font-semibold px-6 py-3 rounded-full transition-colors duration-200">
            Brand and guidelines
          </Link>
        </div>
      </section>
    </>
  );
};

const Technology = () => {
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

export default Technology;
