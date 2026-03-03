import { useLang } from '../context/LanguageContext';

const FutureReady = () => {
  const { t } = useLang();

  return (
    <section className="bg-white dark:bg-[#0a0a0f] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-10 md:py-14 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-stretch gap-8 md:gap-12 lg:gap-16">

        {/* ── Left column ── */}
        <div className="flex flex-col justify-between flex-1 max-w-md">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white uppercase leading-tight tracking-tight mb-5">
              {t.futureReady.heading1}<br />{t.futureReady.heading2}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              {t.futureReady.body}
            </p>
          </div>

          <div className="mt-8">
            <button className="inline-flex items-center gap-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors duration-200 shadow-md shadow-blue-500/25">
              {t.futureReady.btn}
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col flex-1">
          {/* Product image */}
          <div className="rounded-xl overflow-hidden flex-1 min-h-[200px] sm:min-h-[240px] bg-gray-900 dark:bg-[#111118]">
            <img
              src="/alvio-notebook.jpg"
              alt="Alvio product"
              className="w-full h-full object-cover"
              style={{ minHeight: '200px' }}
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x260/111118/444455?text=ALVIO+Product';
              }}
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 mt-5">
            {t.futureReady.stats.map((stat, i) => (
              <div
                key={i}
                className={`flex flex-col px-4 first:pl-0 ${
                  i !== 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''
                }`}
              >
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-none">
                  {stat.value}
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-[11px] sm:text-xs mt-1.5 leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FutureReady;
