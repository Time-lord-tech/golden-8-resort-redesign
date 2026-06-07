import { MapPin, Phone, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-white pt-14 md:pt-20 pb-8 md:pb-10 px-4 sm:px-6" style={{ backgroundColor: '#060f1a' }}>
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
