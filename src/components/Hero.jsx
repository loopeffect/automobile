import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

const Hero = () => {
  const { t, isRTL } = useLang();
  const [query, setQuery] = useState('');

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#080c14',
      }}
    >
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-[#06080f]/60 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[55%] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* ── Main content — vertically centered ── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 sm:px-6 md:px-12 lg:px-20 pt-28 pb-16 text-center">

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white uppercase leading-[1.05] tracking-tight mb-5 max-w-4xl">
          {t.hero.headline1}<br />{t.hero.headline2}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mb-10">
          {t.hero.subtitle}
        </p>

        {/* ── Search bar — main focal point ── */}
        <div className="w-full max-w-2xl mb-6">
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-2 gap-2 shadow-2xl">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mx-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none py-1 min-w-0"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full flex-shrink-0 transition-colors duration-200 shadow-md shadow-blue-500/30">
              {t.hero.searchBtn}
            </button>
          </div>
        </div>

        {/* ── Buyer CTA ── */}
        <div className="flex items-center gap-3 mb-16">
          <a href="/listings" className="bg-white text-gray-900 text-sm font-semibold px-7 py-3 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-lg">
            {t.hero.discoverMore}
          </a>
          <button className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 shadow-lg shadow-blue-500/30">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* ── Seller CTA banner ── */}
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className={`text-${isRTL ? 'right' : 'left'}`}>
            <p className="text-white font-bold text-base sm:text-lg leading-tight">
              {t.hero.sellCta}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
              {t.hero.sellSub}
            </p>
          </div>
          <a
            href="/create-listing"
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-full transition-colors duration-200 shadow-md shadow-blue-500/30 whitespace-nowrap"
          >
            {t.hero.sellCta} →
          </a>
        </div>

      </div>

      {/* ── Product image — bottom right ── */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 hidden sm:block pointer-events-none">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52">
          <div className="absolute inset-0 blur-2xl bg-blue-500/25 rounded-full scale-90" />
          <img
            src="/alvio-product.png"
            alt="ALVIO device"
            className="relative z-10 w-full h-full object-contain drop-shadow-[0_8px_32px_rgba(59,130,246,0.4)]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
