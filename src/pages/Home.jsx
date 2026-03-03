import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CarListings from '../components/CarListings';
import FutureReady from '../components/FutureReady';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import GetToKnowUs from '../components/GetToKnowUs';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { LanguageProvider } from '../context/LanguageContext';

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);

  // Apply / remove the `dark` class on <html> so every dark: class in the whole page responds
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Clean up when leaving the page so it doesn't bleed into other routes
    return () => root.classList.remove('dark');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <LanguageProvider>
      <div>
        <div className="relative">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Hero />
        </div>
        <CarListings />
        <FutureReady />
        <Testimonials />
        <FAQ />
        <GetToKnowUs />
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Home;
