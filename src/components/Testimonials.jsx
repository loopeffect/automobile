import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

const CARDS_PER_PAGE = 2;

const StarRating = ({ count }) => (
  <div className="flex items-center gap-0.5 mt-1">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard = ({ review }) => (
  <div className="flex-1 min-w-0 rounded-xl p-5 border border-[#1e3056] bg-transparent dark:bg-white dark:border-white/10 dark:shadow-lg">
    <div className="flex items-center gap-3 mb-4">
      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#3a4a6b] dark:bg-gray-300">
        <svg className="w-7 h-7 text-[#6b7fa3] dark:text-gray-400 absolute" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p className="text-white dark:text-gray-900 font-bold text-sm leading-tight">{review.name}</p>
        <StarRating count={review.rating} />
      </div>
    </div>
    <p className="text-[#8a9bbf] dark:text-gray-500 text-xs sm:text-sm leading-relaxed">{review.text}</p>
  </div>
);

const Testimonials = () => {
  const [page, setPage] = useState(0);
  const { t } = useLang();

  const reviews = t.testimonials.reviews;
  const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);
  const visibleReviews = reviews.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  // Reset page when language changes (different review count)
  const safePage = Math.min(page, totalPages - 1);

  return (
    <section className="bg-[#0c1631] dark:bg-blue-500 overflow-hidden transition-colors duration-300">

      {/* ── Header row ── */}
      <div className="flex items-stretch min-h-[80px]">
        <div
          className="flex-shrink-0 flex items-center pl-5 sm:pl-8 md:pl-12 lg:pl-16 xl:pl-20 pr-12 sm:pr-16 bg-blue-500 dark:bg-[#0f1d40]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0 100%)' }}
        >
          <h2 className="text-white font-extrabold text-base sm:text-lg leading-snug whitespace-nowrap">
            {t.testimonials.heading.split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
        </div>

        <div className="flex items-center pl-6 sm:pl-8 pr-4 sm:pr-6 md:pr-10 lg:pr-16 xl:pr-20">
          <p className="text-[#8a9bbf] dark:text-white text-xs sm:text-sm leading-snug max-w-[200px] sm:max-w-xs">
            {t.testimonials.tagline}
          </p>
        </div>
      </div>

      {/* ── Cards + dots ── */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pt-8 pb-10 md:pb-14">
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          {visibleReviews.map((review) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
          {visibleReviews.length < CARDS_PER_PAGE && <div className="flex-1 min-w-0" />}
        </div>

        <div className="flex items-center justify-start gap-2 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === safePage
                  ? 'w-8 h-2.5 bg-blue-500 dark:bg-[#0f1d40]'
                  : 'w-2.5 h-2.5 bg-[#1e3056] dark:bg-[#1e3a8a]/60 hover:bg-[#2a4070] dark:hover:bg-[#1e3a8a]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
