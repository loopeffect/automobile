import { useEffect, useMemo, useState } from 'react';

const DEFAULT_IMAGES = ['/1.png', '/2.png', '/3.png'];
const FALLBACK_IMAGE = '/hero-bg.png';

const AuthBackgroundSlider = ({ images = DEFAULT_IMAGES, intervalMs = 6000, fadeMs = 1400 }) => {
  const slideImages = useMemo(() => {
    const valid = images.filter(Boolean);
    return valid.length ? valid : [FALLBACK_IMAGE];
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [resolvedImages, setResolvedImages] = useState(slideImages);

  useEffect(() => {
    setResolvedImages(slideImages);
    setActiveIndex(0);
  }, [slideImages]);

  useEffect(() => {
    if (resolvedImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % resolvedImages.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [resolvedImages.length, intervalMs]);

  const handleImageError = (index) => {
    setResolvedImages((prev) => prev.map((img, i) => (i === index ? FALLBACK_IMAGE : img)));
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {resolvedImages.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt=""
          onError={() => handleImageError(index)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDuration: `${fadeMs}ms` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default AuthBackgroundSlider;