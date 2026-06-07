import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';
import { rooms } from '../../data/resortData';

export default function Rooms() {
  return (
    <section id="rooms" className="py-16 md:py-32 px-4 sm:px-6 bg-[--color-cream]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-20">
          <span className="inline-flex items-center gap-2 text-yellow-600 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
            <span className="w-8 h-px bg-yellow-600" />
            Accommodations & Rates
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[--color-ocean-deep] max-w-xl">
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
              <div className="h-48 sm:h-64 overflow-hidden relative">
                <img
                  src={room.img}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-yellow-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-base sm:text-lg shadow-xl">
                  {room.price}
                  <span className="text-[10px] sm:text-xs font-normal text-white/80">/night</span>
                </div>
              </div>
              <div className="p-5 sm:p-8">
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
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('select-room', { detail: { id: i.toString(), title: room.title, pax: room.pax, price: Number(room.price.replace(/[^0-9.-]+/g,"")), image_url: room.img, features: room.features, total_rooms: 1, available_rooms: 1 } }))}
                  className="w-full inline-flex items-center justify-center gap-2 bg-yellow-500 text-[--color-ocean-deep] py-4 rounded-2xl font-bold hover:bg-yellow-400 active:scale-[0.98] transition-all"
                >
                  Book Now <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
