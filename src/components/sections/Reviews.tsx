import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { reviews } from '../../data/resortData';

export default function Reviews() {
  return (
    <section id="reviews" className="py-16 md:py-32 px-4 sm:px-6" style={{ backgroundColor: '#0A2540' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-20 text-center">
          <span className="inline-flex items-center gap-2 text-yellow-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
            <span className="w-8 h-px bg-yellow-400" />
            Guest Reviews
            <span className="w-8 h-px bg-yellow-400" />
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">
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
