import { useState } from 'react';
import CarCard from './CarCard';
import { useLang } from '../context/LanguageContext';

// Images from components/images folder — used randomly for Handpicked Excellence section
import img0 from './images/image.png';
import img1 from './images/image (1).png';
import img5 from './images/image (5).png';
import img6 from './images/image (6).png';
import img7 from './images/image (7).png';
import img8 from './images/image (8).png';
import img9 from './images/image (9).png';
import img10 from './images/image (10).png';
import img11 from './images/image (11).png';
import img12 from './images/image (12).png';
import img13 from './images/image (13).png';

// Random order across 20 cars (from components/images)
const shuffled = [img7, img1, img12, img9, img0, img11, img5, img13, img6, img10, img8, img1, img0, img12, img9, img7, img11, img5, img13, img6];

const categoryKeys = ['SUV', 'Hatchback', 'Sedan', 'MUV', 'Luxury'];

const allCars = {
  SUV: [
    { id: 1, title: '2014 Jeep Grand Cherokee Overland', price: 19000, year: 2014, featured: true, imageCount: 6, image: shuffled[0] },
    { id: 2, title: '2014 Nissan Pathfinder SV', price: 25000, year: 2014, featured: true, imageCount: 4, image: shuffled[1] },
    { id: 3, title: '2015 Mercedes-Benz S500', price: 75000, year: 2015, featured: true, imageCount: 6, image: shuffled[2] },
    { id: 4, title: '2020 Mini Cooper S', price: 63000, year: 2020, featured: true, imageCount: 8, image: shuffled[3] },
  ],
  Hatchback: [
    { id: 5, title: '2019 Honda Civic Hatchback', price: 32000, year: 2019, featured: true, imageCount: 5, image: shuffled[4] },
    { id: 6, title: '2021 Toyota Yaris', price: 28000, year: 2021, featured: false, imageCount: 4, image: shuffled[5] },
    { id: 7, title: '2020 Volkswagen Golf GTI', price: 47000, year: 2020, featured: true, imageCount: 7, image: shuffled[6] },
    { id: 8, title: '2018 Ford Fiesta ST', price: 22000, year: 2018, featured: false, imageCount: 3, image: shuffled[7] },
  ],
  Sedan: [
    { id: 9, title: '2022 Toyota Camry XSE', price: 55000, year: 2022, featured: true, imageCount: 6, image: shuffled[8] },
    { id: 10, title: '2021 BMW 3 Series 330i', price: 78000, year: 2021, featured: true, imageCount: 9, image: shuffled[9] },
    { id: 11, title: '2020 Honda Accord Sport', price: 42000, year: 2020, featured: false, imageCount: 5, image: shuffled[10] },
    { id: 12, title: '2019 Hyundai Sonata SEL', price: 31000, year: 2019, featured: true, imageCount: 4, image: shuffled[11] },
  ],
  MUV: [
    { id: 13, title: '2021 Toyota Innova Crysta', price: 48000, year: 2021, featured: true, imageCount: 5, image: shuffled[12] },
    { id: 14, title: '2020 Kia Carnival EX', price: 61000, year: 2020, featured: true, imageCount: 7, image: shuffled[13] },
    { id: 15, title: '2019 Honda Odyssey EX-L', price: 53000, year: 2019, featured: false, imageCount: 6, image: shuffled[14] },
    { id: 16, title: '2022 Mitsubishi Xpander', price: 38000, year: 2022, featured: true, imageCount: 4, image: shuffled[15] },
  ],
  Luxury: [
    { id: 17, title: '2022 Mercedes-Benz GLE 450', price: 145000, year: 2022, featured: true, imageCount: 10, image: shuffled[16] },
    { id: 18, title: '2021 BMW X7 xDrive40i', price: 162000, year: 2021, featured: true, imageCount: 8, image: shuffled[17] },
    { id: 19, title: '2023 Porsche Cayenne S', price: 198000, year: 2023, featured: true, imageCount: 12, image: shuffled[18] },
    { id: 20, title: '2022 Range Rover Sport HSE', price: 175000, year: 2022, featured: true, imageCount: 9, image: shuffled[19] },
  ],
};

const CarListings = () => {
  const [activeCategory, setActiveCategory] = useState('SUV');
  const { t } = useLang();

  const cars = allCars[activeCategory] || [];

  return (
    <section className="bg-white dark:bg-[#0a0a0f] py-8 md:py-12 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 transition-colors duration-300">

      {/* Section header */}
      <div className="flex items-center justify-between mb-5 md:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white uppercase leading-tight">
          {t.listings.heading}
        </h2>
        <a
          href="#"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150 whitespace-nowrap ml-4"
        >
          {t.listings.viewAll}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-0 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto scrollbar-hide">
        {categoryKeys.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm font-medium px-4 py-2.5 whitespace-nowrap transition-colors duration-150 border-b-2 -mb-px ${
              activeCategory === cat
                ? 'text-gray-900 dark:text-white border-gray-900 dark:border-white'
                : 'text-gray-500 dark:text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {t.listings.categories[cat]}
          </button>
        ))}
      </div>

      {/* Car grid — 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 dark:gap-y-7 dark:divide-y-0">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
};

export default CarListings;
