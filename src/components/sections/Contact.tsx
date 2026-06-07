import { motion } from 'framer-motion';
import { MapPin, Phone, Facebook } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-32 px-4 sm:px-6 bg-[--color-cream]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 text-yellow-600 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
            <span className="w-8 h-px bg-yellow-600" />
            Get In Touch
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[--color-ocean-deep] mb-8 md:mb-10">
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
          className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-slate-100/50"
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
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Message</label>
              <textarea className="w-full bg-slate-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-yellow-400/40 transition font-medium h-32 resize-none" placeholder="Questions, concerns, or feedback..." />
            </div>
            <button className="w-full text-white py-5 rounded-2xl font-bold hover:opacity-90 hover:scale-[0.99] active:scale-[0.97] transition-all shadow-xl" style={{ backgroundColor: '#0A2540' }}>
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
