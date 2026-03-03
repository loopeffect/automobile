import { useLang } from '../context/LanguageContext';

const CarCard = ({ car }) => {
  const { t } = useLang();
  return (
    <div className="
      bg-white border border-gray-200 rounded-sm hover:shadow-md transition-all duration-200
      dark:bg-transparent dark:border-transparent dark:border-b dark:border-gray-800/40 dark:rounded-none dark:hover:shadow-none
      overflow-hidden flex flex-col sm:flex-row">

      {/* Image block */}
      <div className="relative w-full sm:w-44 md:w-48 lg:w-52 flex-shrink-0 bg-gray-100 dark:bg-[#111118] dark:rounded-lg dark:overflow-hidden min-h-[140px] sm:min-h-0">
        <img
          src={car.image}
          alt={car.title}
          className="w-full h-full object-cover"
          style={{ minHeight: '140px' }}
          onError={(e) => {
            e.target.src = 'https://placehold.co/208x160/1a1a22/444455?text=Car';
          }}
        />

        {/* Top-left badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          {car.featured && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
              Featured
            </span>
          )}
          <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-sm flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586l-1-1H6.586l-1 1H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            {car.imageCount}
          </span>
          <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-sm">
            {car.year}
          </span>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {[...Array(4)].map((_, i) => (
            <span key={i} className={`block w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* Content block */}
      <div className="flex flex-col justify-between flex-1 p-3 md:p-4">
        <div>
          <h3 className="text-gray-900 dark:text-white font-bold text-sm md:text-base uppercase leading-tight">
            {car.title}
          </h3>
          <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm mt-1">
            {car.price.toLocaleString()} QAR
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-[#2a2a35] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-400 dark:text-gray-500 text-xs">Lorem ipsum</span>
          </div>
          <button className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 text-xs font-medium px-3 py-1.5 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-150 whitespace-nowrap">
            {t.listings.viewCar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
