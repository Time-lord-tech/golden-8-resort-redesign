import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Detect when navbar is over a light-background section (Rule 14 compliant MutationObserver setup)
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const setupObserver = () => {
      if (observer) {
        observer.disconnect();
      }

      const lightSections = document.querySelectorAll('#about, #rooms, #contact');
      if (lightSections.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          const anyVisible = entries.some((e) => e.isIntersecting);
          setIsLight(anyVisible);
        },
        { rootMargin: '-64px 0px -60% 0px', threshold: 0 }
      );
      
      lightSections.forEach((el) => observer?.observe(el));
    };

    setupObserver();

    mutationObserver = new MutationObserver(() => {
      setupObserver();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (observer) observer.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, []);

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Amenities', href: '#amenities' },
    { label: 'Rooms', href: '#rooms' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
    { label: 'Admin', href: '/admin' },
  ];

  const darkGlass: React.CSSProperties = {
    background: 'rgba(10,37,64,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.2)',
  };

  const lightGlass: React.CSSProperties = {
    background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(10,37,64,0.1)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px rgba(10,37,64,0.08)',
  };

  const linkColor = scrolled && isLight ? 'rgba(10,37,64,0.75)' : 'rgba(255,255,255,0.85)';
  const glowColor = '#F59E0B';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div
        className="max-w-7xl mx-auto px-6 flex items-center justify-between rounded-2xl transition-all duration-500"
        style={scrolled ? (isLight ? lightGlass : darkGlass) : {}}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <img
            src="/assets/logo.jpg"
            alt="Golden 8 Beach Resort"
            className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/50"
          />
          <div className="hidden sm:block">
            <span
              className="block font-serif font-bold text-base leading-none drop-shadow"
              style={{ color: scrolled && isLight ? '#0A2540' : 'white' }}
            >
              Golden 8
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: scrolled && isLight ? 'rgba(10,37,64,0.5)' : 'rgba(255,255,255,0.6)' }}
            >
              Beach Resort
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <motion.a
              key={l.href}
              href={l.href}
              style={{ color: linkColor }}
              className="text-[11px] uppercase tracking-widest font-semibold"
              whileHover={{
                scale: 1.18,
                color: glowColor,
                textShadow: '0 0 12px rgba(245,158,11,0.9), 0 0 24px rgba(245,158,11,0.5)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {l.label}
            </motion.a>
          ))}
        </nav>

        <a
          href="#booking"
          className="hidden md:inline-flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-yellow-400 hover:scale-[0.98] active:scale-95 transition-all shadow-lg shadow-yellow-500/30"
        >
          Book Now <ArrowRight size={14} />
        </a>

        <button
          className="md:hidden p-2"
          style={{ color: scrolled && isLight ? '#0A2540' : 'white' }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-4 right-4 mt-2 rounded-3xl px-8 py-10 flex flex-col gap-6 z-50"
            style={darkGlass}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-xl font-serif font-bold text-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => { setOpen(false); }}
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold text-center"
            >
              Book Your Stay
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
