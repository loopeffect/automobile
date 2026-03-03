import { useLang } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLang();

  return (
    <footer className="bg-[#0e1d45] dark:bg-blue-500 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-12 md:py-16 transition-colors duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">

        {/* ── Col 1: Brand ── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center">
            <img src="/alvio-logo.png" alt="ALVIO" className="h-8 w-auto" />
          </div>

          <p className="text-blue-200/60 dark:text-white/80 text-sm leading-relaxed">
            {t.footer.description}
          </p>

          <div className="flex items-center gap-3 mt-1">
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full border border-blue-400/30 dark:border-white/40 flex items-center justify-center text-blue-300 dark:text-white hover:border-blue-400 dark:hover:border-white hover:text-white transition-colors duration-200">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full border border-blue-400/30 dark:border-white/40 flex items-center justify-center text-blue-300 dark:text-white hover:border-blue-400 dark:hover:border-white hover:text-white transition-colors duration-200">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="#" aria-label="X" className="w-8 h-8 rounded-full border border-blue-400/30 dark:border-white/40 flex items-center justify-center text-blue-300 dark:text-white hover:border-blue-400 dark:hover:border-white hover:text-white transition-colors duration-200">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full border border-blue-400/30 dark:border-white/40 flex items-center justify-center text-blue-300 dark:text-white hover:border-blue-400 dark:hover:border-white hover:text-white transition-colors duration-200">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Col 2: Quick Links ── */}
        <div>
          <h4 className="text-white font-bold text-base mb-5">{t.footer.quickLink}</h4>
          <ul className="flex flex-col gap-3">
            {t.footer.links.map((link) => (
              <li key={link}>
                <a href="#" className="text-blue-200/60 dark:text-white/80 text-sm hover:text-white transition-colors duration-150">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3: Contact Details ── */}
        <div>
          <h4 className="text-white font-bold text-base mb-5">{t.footer.contactDetails}</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-300 dark:text-white">
                <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-blue-200/60 dark:text-white/80 text-sm">(123) 456-7890</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-300 dark:text-white">
                <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-blue-200/60 dark:text-white/80 text-sm">info@00.com</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-300 dark:text-white">
                <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-blue-200/60 dark:text-white/80 text-sm">Lorem ipsum</span>
            </li>
          </ul>
        </div>

        {/* ── Col 4: Legal ── */}
        <div>
          <h4 className="text-white font-bold text-base mb-5">{t.footer.quickLink}</h4>
          <ul className="flex flex-col gap-3">
            {t.footer.legal.map((link) => (
              <li key={link}>
                <a href="#" className="text-blue-200/60 dark:text-white/80 text-sm hover:text-white transition-colors duration-150">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
