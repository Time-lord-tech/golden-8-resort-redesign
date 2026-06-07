import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/sections/Navbar';
import Hero from './components/sections/Hero';
import Stats from './components/sections/Stats';
import About from './components/sections/About';
import StickyScroll from './components/sections/StickyScroll';
import Marquee from './components/sections/Marquee';
import Rooms from './components/sections/Rooms';
import Reviews from './components/sections/Reviews';
import GuestGallery from './components/sections/GuestGallery';
import Contact from './components/sections/Contact';
import { BookingSection } from './components/BookingManager';
import Footer from './components/sections/Footer';

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen selection:bg-yellow-400 selection:text-white">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <StickyScroll />
      <Marquee />
      <Rooms />
      <Reviews />
      <GuestGallery />
      <Contact />
      <BookingSection />
      <Footer />
    </div>
  );
}
