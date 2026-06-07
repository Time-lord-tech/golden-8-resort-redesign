import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-end overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Parallax Video Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/dacf8509-3080-43eb-b543-ed979a7c0391.jpg"
          className="w-full h-full object-cover scale-110"
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/70 to-[#0A2540]/20" />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10,37,64,0.45)' }} />
      </motion.div>

      {/* Background noise texture */}
      <div className="absolute inset-0 z-[1] bg-noise pointer-events-none opacity-50" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-32"
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
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6 md:mb-8">
            Where the{' '}
            <em className="not-italic text-shimmer">Shore</em>
            <br />Becomes Home.
          </h1>
          <p className="font-sans text-white/70 text-base sm:text-lg leading-relaxed max-w-lg mb-8 md:mb-10">
            Tucked away on the scenic coast of Aurora, Golden 8 Beach Resort invites you to slow down, breathe in the salt air, and rediscover the rhythm of island life.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="#booking"
              className="inline-flex items-center gap-3 bg-yellow-500 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base hover:bg-yellow-400 hover:-translate-y-1 active:translate-y-0 transition-all shadow-2xl shadow-yellow-500/20"
            >
              Book Your Stay <ArrowRight size={18} />
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
