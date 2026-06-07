import { motion } from 'framer-motion';

export default function Stats() {
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
