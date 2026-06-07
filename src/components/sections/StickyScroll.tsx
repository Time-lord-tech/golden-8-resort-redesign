import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { amenities } from '../../data/resortData';

export default function StickyScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.min(
        amenities.length - 1,
        Math.floor(v * amenities.length)
      );
      setActiveIndex(idx);
    });
    return unsub;
  }, [scrollYProgress, isMobile]);

  // Mobile: Card-based layout
  if (isMobile) {
    return (
      <section id="amenities" style={{ backgroundColor: '#0A2540' }}>
        <div className="px-4 sm:px-6 pt-16 pb-16">
          <span className="inline-flex items-center gap-2 text-yellow-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
            <span className="w-8 h-px bg-yellow-400" />
            Features & Amenities
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight max-w-xl mb-10">
            Every reason to stay a little longer.
          </h2>

          <div className="flex flex-col gap-6">
            {amenities.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.05, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className="rounded-3xl overflow-hidden ring-1 ring-white/10"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="block text-yellow-400 text-[9px] uppercase tracking-[0.3em] font-bold mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div className="bg-white/[0.04] p-5">
                  <p className="text-white/55 text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-400/30 text-yellow-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    {item.tag}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop: Sticky scroll layout
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
          <div className="w-1/2 flex flex-col justify-center px-16 overflow-hidden">
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
          <div className="w-1/2 relative">
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
