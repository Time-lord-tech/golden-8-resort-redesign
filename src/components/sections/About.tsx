import { motion } from 'framer-motion';
import { TreePine, Waves, UtensilsCrossed } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-32 px-4 sm:px-6 bg-[--color-cream] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
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
          <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 bg-yellow-500 text-white px-5 py-4 sm:px-8 sm:py-6 rounded-2xl sm:rounded-3xl shadow-2xl shadow-yellow-500/30 z-10">
            <span className="block font-serif font-bold text-xl sm:text-3xl">Golden 8</span>
            <span className="block text-[10px] sm:text-xs uppercase tracking-widest text-white/80 mt-1">Aurora, Philippines</span>
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
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6 md:mb-8 text-[--color-ocean-deep]">
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
