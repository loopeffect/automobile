import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

const FAQ = () => {
  const [openId, setOpenId] = useState(1);
  const { t } = useLang();

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="relative bg-white dark:bg-black px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-12 md:py-16 overflow-hidden transition-colors duration-300">

      {/* Decorative arc */}
      <svg
        className="absolute top-0 right-0 w-[340px] sm:w-[480px] pointer-events-none opacity-10 dark:opacity-100"
        viewBox="0 0 480 200"
        fill="none"
      >
        <path d="M480 0 Q300 240 0 140" stroke="url(#arcGradient)" strokeWidth="1.5" fill="none" />
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Heading */}
      <div className="relative text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t.faq.heading}
        </h2>
        <p className="text-gray-400 dark:text-gray-500 text-sm sm:text-base">
          {t.faq.subtitle}
        </p>
      </div>

      {/* Accordion */}
      <div className="relative flex flex-col gap-3 max-w-2xl mx-auto">
        {t.faq.items.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-xl overflow-hidden transition-all duration-300 ${
                isOpen ? 'bg-gradient-to-r from-blue-600 via-blue-800 to-[#0b1630]' : 'bg-[#0f1d40]'
              }`}
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isOpen ? 'bg-white' : 'bg-blue-500'}`} />
                  <span className="text-white font-semibold text-sm sm:text-base">{faq.question}</span>
                </div>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-colors duration-200 ${
                  isOpen ? 'bg-white/20 text-white' : 'border border-blue-500/50 text-blue-400'
                }`}>
                  {isOpen ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed px-5 pb-5 pl-[3.25rem]">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Still have questions */}
      <div className="text-center mt-14">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.faq.stillHeading}
        </h3>
        <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">{t.faq.stillSub}</p>
        <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold px-7 py-3 rounded-full transition-colors duration-200 shadow-md shadow-blue-500/30">
          {t.faq.contactBtn}
        </button>
      </div>

    </section>
  );
};

export default FAQ;
