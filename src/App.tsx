import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { 
  MapPin, Phone, Facebook, ChevronDown, Waves, 
  TreePine, UtensilsCrossed, Star, ArrowRight,
  Users, Bed, Menu, X, Wind, ParkingCircle
} from 'lucide-react';
import { CircularGallery, type GalleryItem } from './components/ui/circular-gallery';

// ── DATA ──────────────────────────────────────────────────────────────────────


const amenities = [
  {
    id: 1,
    title: 'Beachfront Teepee Cottages',
    subtitle: 'SIGNATURE STAY',
    desc: 'Rustic A-frame teepee cottages built from native bamboo, positioned directly on the white sand shore. Wake to the sound of waves, steps from the ocean.',
    tag: 'Sleeps 2–3 guests',
    img: '/assets/137b10b5-e357-4d34-99e5-f41b1e482a3c.jpg',
  },
  {
    id: 2,
    title: 'Family Villa',
    subtitle: 'FAMILY RETREAT',
    desc: 'Spacious air-conditioned family villas with private balcony sea views, a dedicated dining area, shared cooking facilities, and complimentary parking.',
    tag: 'Sleeps up to 12 guests',
    img: '/assets/a4c91579-d589-489d-9968-1606a80913c1.jpg',
  },
  {
    id: 3,
    title: 'Floating Cottage Experience',
    subtitle: 'ON-WATER DINING',
    desc: 'Dine suspended over the crystal-clear bay in our iconic floating cottages. An unforgettable setting for family feasts, celebrations, and quiet afternoon retreats.',
    tag: 'Exclusive add-on',
    img: '/assets/7b5aae7c-53c3-423a-a8a9-2cc915d074ba.jpg',
  },
  {
    id: 4,
    title: 'Island Boat Rides',
    subtitle: 'ADVENTURE',
    desc: 'Explore the pristine coastline of Casiguran Bay. Our traditional bancas take you through hidden coves, coral gardens, and untouched beaches inaccessible by road.',
    tag: 'Available daily',
    img: '/assets/dacf8509-3080-43eb-b543-ed979a7c0391.jpg',
  },
  {
    id: 5,
    title: 'Event & Celebration Catering',
    subtitle: 'GROUP EVENTS',
    desc: 'From beachside reunions to intimate celebrations, our team handles full event catering with fresh local seafood, native dishes, and customized spreads.',
    tag: 'Advance booking required',
    img: '/assets/84ab8a76-91b1-4992-954f-d99047bb6a8f.jpg',
  },
  {
    id: 6,
    title: 'Bring Your Own Tent / Camp',
    subtitle: 'CAMPSITE EXPERIENCE',
    desc: 'Pitch your tent under the stars and wake up to the sound of waves. Our open beachfront grounds welcome campers — just bring your gear and we take care of the rest.',
    tag: 'Open grounds available',
    img: '/assets/dacf8509-3080-43eb-b543-ed979a7c0391.jpg',
  },
  {
    id: 7,
    title: 'Jet Ski & Kayak Rentals',
    subtitle: 'WATER ACTIVITIES',
    desc: 'Race across the bay on a jet ski or glide through calm waters on a kayak. Casiguran Bay is your playground — our equipment rentals are available daily on request.',
    tag: 'Available on request',
    img: '/assets/a4c91579-d589-489d-9968-1606a80913c1.jpg',
  },
];

const rooms = [
  {
    title: 'Teepee Room',
    pax: '2–3 pax',
    price: '₱1,500',
    img: '/assets/8e38018f-0406-4a4d-8141-8a54f51e1bda.jpg',
    features: ['Porch Front', 'Shared Comfort Room', 'Shared Cooking Area', 'Electric Fan', 'Free Parking'],
  },
  {
    title: 'Family Villa (Small)',
    pax: '6–7 pax',
    price: '₱5,000',
    img: '/assets/2a91de7d-7842-4ce3-aee9-d24abddb9681.jpg',
    features: ['Own Comfort Room', 'Balcony View', 'Dining Area', 'Air-conditioned', 'Free Parking'],
  },
  {
    title: 'Family Villa (Medium)',
    pax: '8–9 pax',
    price: '₱6,000',
    img: '/assets/4b42ed90-bcd8-421a-95c7-4dff5f0fc807.jpg',
    features: ['Own Comfort Room', 'Balcony View', 'Shared Cooking Area', 'Air-conditioned', 'Free Parking'],
  },
  {
    title: 'Family Villa (Large)',
    pax: '10–12 pax',
    price: '₱7,000',
    img: '/assets/5bb331bc-8d34-4ad3-80be-5591b43ff4f4.jpg',
    features: ['Own Comfort Room', 'Balcony View', 'Dining Area', 'Air-conditioned', 'Free Parking'],
  },
];

const reviews = [
  { name: 'Cristina Reyes', rating: 5, text: 'Perfect weekend escape! The teepee cottage was such a unique experience, right on the sand. The staff were incredibly warm and welcoming.' },
  { name: 'Marco Bautista', rating: 5, text: 'Brought the whole family for a reunion. The large villa fit all 11 of us, the floating cottage lunch was absolutely unforgettable.' },
  { name: 'Arlene Santos', rating: 5, text: 'Casiguran is hidden gem territory. Golden 8 is that gem. Clean, beautiful, and so authentically Filipino. We will be back.' },
];

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Detect when navbar is over a light-background section
  useEffect(() => {
    const lightSections = document.querySelectorAll('#about, #rooms, #contact');
    const observer = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting);
        setIsLight(anyVisible);
      },
      { rootMargin: '-64px 0px -60% 0px', threshold: 0 }
    );
    lightSections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Amenities', href: '#amenities' },
    { label: 'Rooms', href: '#rooms' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
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
          href="#contact"
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
              href="#contact"
              onClick={() => setOpen(false)}
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

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-end overflow-hidden">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <img
          src="/assets/dacf8509-3080-43eb-b543-ed979a7c0391.jpg"
          alt="Golden 8 Beach panorama"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/70 to-[#0A2540]/20" />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10,37,64,0.45)' }} />
      </motion.div>

      {/* Background noise texture */}
      <div className="absolute inset-0 z-[1] bg-noise pointer-events-none opacity-50" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 text-yellow-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
            <span className="w-8 h-px bg-yellow-400" />
            Ditinagyan, Casiguran, Aurora
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8">
            Where the{' '}
            <em className="not-italic text-shimmer">Shore</em>
            <br />Becomes Home.
          </h1>
          <p className="font-sans text-white/70 text-lg leading-relaxed max-w-lg mb-10">
            Tucked away on the scenic coast of Aurora, Golden 8 Beach Resort invites you to slow down, breathe in the salt air, and rediscover the rhythm of island life.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="#rooms"
              className="inline-flex items-center gap-3 bg-yellow-500 text-white px-10 py-4 rounded-2xl font-bold text-base hover:bg-yellow-400 hover:-translate-y-1 active:translate-y-0 transition-all shadow-2xl shadow-yellow-500/20"
            >
              Explore Stays <ArrowRight size={18} />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-3 text-white/70 hover:text-white font-semibold text-sm transition-colors"
            >
              Our Story <ChevronDown size={16} />
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: '4.9★', label: 'Guest Rating' },
    { value: '3+', label: 'Accommodation Types' },
    { value: '12', label: 'Max Group Size' },
    { value: '24/7', label: 'Beach Access' },
  ];
  return (
    <section className="py-12 px-6" style={{ backgroundColor: '#0A2540' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="text-center"
          >
            <span className="block font-serif text-3xl font-bold text-yellow-400">{s.value}</span>
            <span className="block text-[11px] uppercase tracking-widest text-white/50 mt-1 font-medium">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-32 px-6 bg-[--color-cream] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/assets/a4c91579-d589-489d-9968-1606a80913c1.jpg"
              alt="Family villa"
              className="rounded-3xl object-cover h-64 w-full"
            />
            <img
              src="/assets/137b10b5-e357-4d34-99e5-f41b1e482a3c.jpg"
              alt="Teepee cottage"
              className="rounded-3xl object-cover h-64 w-full mt-12"
            />
            <img
              src="/assets/ade0ac1b-116d-4a14-93e6-ad14d5662c12.jpg"
              alt="Beach scene"
              className="rounded-3xl object-cover h-48 w-full"
            />
            <img
              src="/assets/dc211f6b-69a3-4fca-9fb7-703fb73faa53.jpg"
              alt="Resort grounds"
              className="rounded-3xl object-cover h-48 w-full mt-6"
            />
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-6 -right-6 bg-yellow-500 text-white px-8 py-6 rounded-3xl shadow-2xl shadow-yellow-500/30">
            <span className="block font-serif font-bold text-3xl">Golden 8</span>
            <span className="block text-xs uppercase tracking-widest text-white/80 mt-1">Aurora, Philippines</span>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
        >
          <span className="inline-flex items-center gap-2 text-yellow-600 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
            <span className="w-8 h-px bg-yellow-600" />
            Our Story
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-8 text-[--color-ocean-deep]">
            A family refuge on the coast of Aurora.
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            Golden 8 Beach Resort was built with one purpose: to give families, groups of friends, and adventurous travelers a genuine escape from city life. Nestled in the quiet barangay of Ditinagyan, surrounded by coconut palms and the calm waters of Casiguran Bay, we offer the kind of rest that city hotels simply cannot replicate.
          </p>
          <p className="text-slate-500 leading-relaxed mb-12">
            From humble beginnings as a family-owned beach property, we have grown into a full-service resort offering native teepee cottages, air-conditioned family villas, floating cottages, and authentic Filipino hospitality. Every detail here is intentional — designed to make you feel less like a guest, and more like you are coming home.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            {[
              { icon: <TreePine size={20} />, label: 'Native Architecture' },
              { icon: <Waves size={20} />, label: 'Direct Beach Access' },
              { icon: <UtensilsCrossed size={20} />, label: 'Fresh Local Cuisine' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[--color-ocean-deep]">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
                  {item.icon}
                </div>
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StickyScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.min(
        amenities.length - 1,
        Math.floor(v * amenities.length)
      );
      setActiveIndex(idx);
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <section id="amenities" style={{ backgroundColor: '#0A2540' }}>
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
        <span className="inline-flex items-center gap-2 text-yellow-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
          <span className="w-8 h-px bg-yellow-400" />
          Features & Amenities
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight max-w-xl">
          Every reason to stay a little longer.
        </h2>
      </div>

      {/* Sticky Scroll Layout */}
      <div ref={containerRef} className="relative" style={{ height: `${amenities.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex overflow-hidden">
          {/* Left: Text items */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-16 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="max-w-md"
              >
                <span className="block text-yellow-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
                  {amenities[activeIndex].subtitle}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  {amenities[activeIndex].title}
                </h3>
                <p className="text-white/60 text-lg leading-relaxed mb-8">
                  {amenities[activeIndex].desc}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/30 text-yellow-400 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  {amenities[activeIndex].tag}
                </div>

                {/* Progress dots */}
                <div className="flex gap-2 mt-12">
                  {amenities.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === activeIndex ? 'w-8 bg-yellow-400' : 'w-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Image */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={amenities[activeIndex].img}
                  alt={amenities[activeIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540] via-[#0A2540]/10 to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Rooms() {
  return (
    <section id="rooms" className="py-32 px-6 bg-[--color-cream]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="inline-flex items-center gap-2 text-yellow-600 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
            <span className="w-8 h-px bg-yellow-600" />
            Accommodations & Rates
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-[--color-ocean-deep] max-w-xl">
            Find your perfect stay.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              whileHover={{ y: -6, boxShadow: '0 40px 80px -20px rgba(10,37,64,0.15)' }}
              className="bg-white rounded-[2.5rem] overflow-hidden group cursor-pointer transition-all duration-500"
              style={{ boxShadow: '0 4px 20px -8px rgba(10,37,64,0.08)' }}
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={room.img}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-xl">
                  {room.price}
                  <span className="text-xs font-normal text-white/80">/night</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[--color-ocean-deep]">{room.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                      <Users size={14} />
                      <span>{room.pax}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {room.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <a
                  href="#contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[--color-ocean-deep] text-white py-4 rounded-2xl font-bold hover:bg-[--color-ocean-mid] active:scale-[0.98] transition-all"
                >
                  Inquire Now <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ['Beachfront Living', 'Floating Cottages', 'Boat Rides', 'Fresh Seafood', 'Native Architecture', 'Casiguran Bay', 'Family Reunions', 'Aurora Sunsets'];
  const doubled = [...items, ...items];
  return (
    <div className="bg-yellow-500 py-5 overflow-hidden">
      <div className="flex gap-16 animate-[marquee_30s_linear_infinite] whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-white font-bold text-sm uppercase tracking-widest">
            <Star size={12} fill="white" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── GUEST GALLERY ─────────────────────────────────────────────────────────

const galleryItems: GalleryItem[] = [
  { common: 'Beach Stroll', photo: { url: '/assets/carosel/0ac705f2-eae2-4e3a-8cee-671d4ecd3289.jpg', text: 'A guest enjoying a peaceful morning walk along the golden sands.' } },
  { common: 'Resort Fun', photo: { url: '/assets/carosel/17cc0cfc-89ef-44d0-8ec4-0c0732f25096.jpg', text: 'Kids and families enjoying themed social events at the resort.' } },
  { common: 'Celebration', photo: { url: '/assets/carosel/206b909a-e2fc-4ae6-a7a3-da83df5ea961.jpg', text: 'Celebrating special milestones with balloons and fun entertainment.' } },
  { common: 'Group Photo', photo: { url: '/assets/carosel/364161d6-eea5-4295-a900-228b8a7b88e7.jpg', text: 'Guests coming together for a memorable group photo by the bay.' } },
  { common: 'Birthday Smiles', photo: { url: '/assets/carosel/4bec0757-9b05-4d39-954a-5a443fb74ef4.jpg', text: 'One of our younger guests celebrating her birthday in paradise.' } },
  { common: 'Coastal Views', photo: { url: '/assets/carosel/52a60014-00da-46c9-8a9e-0af4cb3a8e8c.jpg', text: 'The stunning coastline of Casiguran, Aurora, as seen from the resort.' } },
  { common: 'Kids Sandy Fun', photo: { url: '/assets/carosel/5d6ad537-04c8-4074-9a50-d588b1b9c34a.jpg', text: 'Little ones building memories (and sandcastles) at Golden 8.' } },
  { common: 'Banana Boat Thrills', photo: { url: '/assets/carosel/62cb6f6f-ebe3-4bfc-a196-1bfdfa7e6e46.jpg', text: 'A group of kids experiencing the excitement of our banana boat ride.' } },
  { common: 'Kayaking for Two', photo: { url: '/assets/carosel/72a86148-58aa-4b77-a436-18bca7c7e690.jpg', text: 'Exploring the calm waters of the bay in our rental kayaks.' } },
  { common: 'Magic Show Fun', photo: { url: '/assets/carosel/72d8b899-bca0-4b95-96eb-1073489b0f10.jpg', text: 'Interactive magic shows providing endless entertainment for our guests.' } },
  { common: 'Birthday Bubbles', photo: { url: '/assets/carosel/94fd148f-5d4f-4d2b-9359-adf9fdf2f35a.jpg', text: 'Laughter and bubbles during a festive birthday party at the resort.' } },
  { common: 'Memorable Events', photo: { url: '/assets/carosel/9cfcbca1-a910-4227-8452-c9bc4ac18a68.jpg', text: 'Our resort is the perfect venue for birthdays and social gatherings.' } },
  { common: 'Aurora Sunsets', photo: { url: '/assets/carosel/9ef3b794-6848-4f90-95d7-7cf94baa3b54.jpg', text: "Witnessing the breathtaking 'Aurora Glow' as the day comes to an end." } },
  { common: 'Banana Boat Fun', photo: { url: '/assets/carosel/aba07167-6523-4229-90ec-badfd0d37f36.jpg', text: 'High-speed water fun with friends on the Golden 8 banana boat.' } },
  { common: 'Sunset Serenity', photo: { url: '/assets/carosel/aca3c4e6-1e03-45db-93c2-df491068cfbb.jpg', text: 'Watching the sun dip below the mountains from the Golden 8 shore.' } },
  { common: 'Exploring the Bay', photo: { url: '/assets/carosel/b42a1a82-e600-44c5-b57b-18febe2d3323.jpg', text: 'Paddling across the serene waters for a closer look at the mountains.' } },
  { common: 'Group Outing', photo: { url: '/assets/carosel/b73d3cc4-2145-45e0-834b-341f56cd2c5e.jpg', text: 'A family and friends selfie during their water sports adventure.' } },
  { common: 'Glow of Golden 8', photo: { url: '/assets/carosel/c4735116-aec5-4edc-aae4-43150742d332.jpg', text: 'Capturing the magical transition from day to night at the resort.' } },
  { common: 'Resort Entertainment', photo: { url: '/assets/carosel/e0396716-9d48-47b5-8125-465f29a8f475.jpg', text: 'Our dedicated staff and entertainers making every guest feel special.' } },
  { common: 'Birthday Party', photo: { url: '/assets/carosel/e1beada5-baa7-4634-a09e-23ce26a0caac.jpg', text: 'A vibrant and joyful birthday celebration at our dedicated event area.' } },
  { common: 'Golden Aurora Sunset', photo: { url: '/assets/carosel/e917c70b-18ae-44cd-8c02-6d4270674067.jpg', text: 'One of the many reasons why guests keep coming back to Golden 8.' } },
  { common: 'Crystal Clear Waters', photo: { url: '/assets/carosel/ed03735a-450f-4cf9-a9ee-5cb87adfff68.jpg', text: 'Guests enjoying a refreshing dip in the clean and safe beach area.' } },
  { common: 'Water Sports', photo: { url: '/assets/carosel/fb197fa9-26fa-4f1e-ad69-69c3712772c6.jpg', text: 'Thrilling jet ski rides for the whole family to enjoy together.' } },
  { common: 'Birthday Celebrations', photo: { url: '/assets/carosel/ff567965-9d68-42c6-89b4-9968c4556cfb.jpg', text: 'Creating personalized and memorable experiences for guest birthdays.' } },
];

function GuestGallery() {
  return (
    <section className="overflow-hidden" style={{ backgroundColor: '#0A2540' }}>
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 text-center">
        <span className="inline-flex items-center gap-2 text-yellow-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
          <span className="w-8 h-px bg-yellow-400" />
          Guest Moments
          <span className="w-8 h-px bg-yellow-400" />
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
          Memories made at Golden 8.
        </h2>
        <p className="text-white/40 text-sm mt-4">Scroll → rotates the gallery</p>
      </div>
      <div style={{ width: '100%', height: '500px' }}>
        <CircularGallery items={galleryItems} radius={850} autoRotateSpeed={0.015} />
      </div>
      <div className="pb-16" />
    </section>
  );
}


function Reviews() {
  return (
    <section id="reviews" className="py-32 px-6" style={{ backgroundColor: '#0A2540' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <span className="inline-flex items-center gap-2 text-yellow-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
            <span className="w-8 h-px bg-yellow-400" />
            Guest Reviews
            <span className="w-8 h-px bg-yellow-400" />
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
            Guests who stayed, tell it best.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl p-8"
            >
              <div className="flex mb-4">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="#F59E0B" className="text-yellow-400" />
                ))}
              </div>
              <p className="text-white/70 leading-relaxed mb-8 font-sans">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold font-serif">
                  {r.name.charAt(0)}
                </div>
                <span className="font-semibold text-white text-sm">{r.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-32 px-6 bg-[--color-cream]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 text-yellow-600 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
            <span className="w-8 h-px bg-yellow-600" />
            Get In Touch
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-[--color-ocean-deep] mb-10">
            Ready to escape to the shore?
          </h2>
          <div className="space-y-8">
            {[
              { icon: <MapPin size={20} />, label: 'Location', value: 'Ditinagyan, Casiguran, Aurora, Philippines' },
              { icon: <Phone size={20} />, label: 'Phone / SMS', value: '0955-291-6249' },
              { icon: <Facebook size={20} />, label: 'Facebook Page', value: 'Golden-8 Beach Resort' },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 group-hover:bg-[--color-ocean-deep] group-hover:text-white transition-all duration-300 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">{item.label}</span>
                  <span className="text-[--color-ocean-deep] font-semibold">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
          <img
            src="/assets/dacf8509-3080-43eb-b543-ed979a7c0391.jpg"
            alt="Golden 8 sign"
            className="w-full rounded-3xl object-cover h-48 mt-12"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-100/50"
        >
          <h3 className="font-serif text-2xl font-bold mb-8" style={{ color: '#0A2540' }}>Send an Inquiry</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Full Name</label>
              <input type="text" className="w-full bg-slate-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-yellow-400/40 transition font-medium" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Email Address</label>
              <input type="email" className="w-full bg-slate-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-yellow-400/40 transition font-medium" placeholder="youremail@gmail.com" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Phone / FB</label>
              <input type="text" className="w-full bg-slate-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-yellow-400/40 transition font-medium" placeholder="Contact info" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Accommodation Type</label>
              <select className="w-full bg-slate-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-yellow-400/40 transition font-medium text-slate-700 cursor-pointer">
                <option>Teepee Room (₱1,500)</option>
                <option>Family Villa 6–7 pax (₱5,000)</option>
                <option>Family Villa 8–9 pax (₱6,000)</option>
                <option>Family Villa 10–12 pax (₱7,000)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Check-in Date</label>
              <input type="date" className="w-full bg-slate-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-yellow-400/40 transition font-medium" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Message</label>
              <textarea className="w-full bg-slate-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-yellow-400/40 transition font-medium h-32 resize-none" placeholder="Additional requests, number of guests, etc." />
            </div>
            <button className="w-full text-white py-5 rounded-2xl font-bold hover:opacity-90 hover:scale-[0.99] active:scale-[0.97] transition-all shadow-xl" style={{ backgroundColor: '#0A2540' }}>
              Send Reservation Request
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="text-white pt-20 pb-10 px-6" style={{ backgroundColor: '#060f1a' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/assets/logo.jpg" alt="Logo" className="w-14 h-14 rounded-full object-cover" />
              <div>
                <span className="block font-serif font-bold text-lg">Golden 8</span>
                <span className="text-xs text-white/40 uppercase tracking-widest">Beach Resort</span>
              </div>
            </div>
            <p className="text-white/50 leading-relaxed text-sm max-w-xs">
              Your authentic beachfront escape in the heart of Casiguran, Aurora.
            </p>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-6">Quick Links</span>
            <div className="flex flex-col gap-3">
              {['About Us', 'Amenities', 'Room Rates', 'Guest Reviews', 'Contact'].map((l) => (
                <a key={l} href="#" className="text-white/60 hover:text-white transition-colors text-sm">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-6">Find Us</span>
            <div className="space-y-4 text-sm text-white/60">
              <p className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 flex-shrink-0" />Ditinagyan, Casiguran, Aurora, Philippines</p>
              <p className="flex items-center gap-3"><Phone size={16} />0955-291-6249</p>
              <a href="https://www.facebook.com/p/Golden-8-Beach-Resort-61559582521213/" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                <Facebook size={16} /> Golden-8 Beach Resort on Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-[11px] uppercase tracking-widest">
          <span>© {new Date().getFullYear()} Golden 8 Beach Resort. All rights reserved.</span>
          <span>Ditinagyan, Casiguran, Aurora</span>
        </div>
      </div>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

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
      <Footer />
    </div>
  );
}
