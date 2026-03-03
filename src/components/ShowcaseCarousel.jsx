import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const PRESET_SLIDES = {
  listing: [
    {
      src: '/1.png',
      title: 'Find The Right Car',
      subtitle: 'Fresh verified listings with smooth browsing experience.',
    },
    {
      src: '/2.png',
      title: 'Compare Premium Options',
      subtitle: 'Explore specs, condition, and pricing in one place.',
    },
    {
      src: '/3.png',
      title: 'Move From Interest To Purchase',
      subtitle: 'Contact dealers and request purchase in seconds.',
    },
  ],
  dealer: [
    {
      src: '/hero-bg.png',
      title: 'Grow Your Dealer Presence',
      subtitle: 'Showcase inventory and connect directly with buyers.',
    },
    {
      src: '/2.png',
      title: 'Close Deals Faster',
      subtitle: 'Manage inquiries, orders, and updates from your dashboard.',
    },
    {
      src: '/1.png',
      title: 'Build Buyer Trust',
      subtitle: 'Keep listings polished with clear details and media.',
    },
  ],
  ads:[

    {
      src: '/add1.png',
      title: 'Grow Your Dealer Presence',
      subtitle: 'Showcase inventory and connect directly with buyers.',
    },
    {
      src: '/2.png',
      title: 'Close Deals Faster',
      subtitle: 'Manage inquiries, orders, and updates from your dashboard.',
    },
    {
      src: '/1.png',
      title: 'Build Buyer Trust',
      subtitle: 'Keep listings polished with clear details and media.',
    },

  ]
};

const FALLBACK_SLIDE = {
  src: '/hero-bg.png',
  title: 'Automobile Marketplace',
  subtitle: 'Discover and connect with confidence.',
};

const ShowcaseCarousel = ({ name = 'listing', slides, intervalMs = 5500 }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const resolvedSlides = useMemo(() => {
    const incoming = Array.isArray(slides) ? slides.filter((item) => item?.src) : [];
    if (incoming.length > 0) return incoming;
    return PRESET_SLIDES[name] || [FALLBACK_SLIDE];
  }, [name, slides]);

  useEffect(() => {
    setActiveIndex(0);
  }, [resolvedSlides]);

  useEffect(() => {
    if (resolvedSlides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % resolvedSlides.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [resolvedSlides.length, intervalMs]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + resolvedSlides.length) % resolvedSlides.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % resolvedSlides.length);
  };

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden bg-slate-950">
      <div className="relative h-[42vh] min-h-[300px] sm:h-[50vh] lg:h-[58vh] max-h-[760px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${resolvedSlides[activeIndex]?.src}-${activeIndex}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          >
            <img
              src={resolvedSlides[activeIndex]?.src || FALLBACK_SLIDE.src}
              alt={resolvedSlides[activeIndex]?.title || 'carousel slide'}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

            <div className="absolute bottom-8 left-4 right-4 sm:left-8 sm:right-8 lg:left-14 lg:right-14">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="max-w-2xl"
              >
                <h2 className="text-white text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
                  {resolvedSlides[activeIndex]?.title}
                </h2>
                <p className="text-white/85 text-sm sm:text-base lg:text-lg mt-3 sm:mt-4">
                  {resolvedSlides[activeIndex]?.subtitle}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {resolvedSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors flex items-center justify-center"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors flex items-center justify-center"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {resolvedSlides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {resolvedSlides.map((slide, index) => (
              <button
                key={`${slide.src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'w-8 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowcaseCarousel;