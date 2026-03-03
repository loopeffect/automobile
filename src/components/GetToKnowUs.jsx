const GetToKnowUs = () => {
  return (
    <section className="bg-white dark:bg-black px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-8 md:py-12 transition-colors duration-300">

      {/* Card — plain rounded in light, glowing blue border in dark */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 rounded-2xl overflow-hidden
        ring-0 dark:ring-2 dark:ring-blue-500
        shadow-none dark:shadow-[0_0_32px_4px_rgba(59,130,246,0.45)]
        transition-all duration-300">

        {/* Base gradient fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b3e] via-[#1a2a5e] to-[#0a0f1e]" />

        {/* Background image — same for both modes */}
        <img
          src="/get-to-know-us-dark.jpg"
          alt="Get to know Alvio"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay — lighter in dark mode to let the image breathe */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/30" />

        {/* Centred headline */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h2 className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-wide text-center drop-shadow-lg">
            Get To Know Us
          </h2>
        </div>

      </div>
    </section>
  );
};

export default GetToKnowUs;
