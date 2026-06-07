import { useEffect, useState } from 'react';
import { CircularGallery } from '../ui/circular-gallery';
import { galleryItems } from '../../data/resortData';

function ResponsiveGallery() {
  const [radius, setRadius] = useState(850);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setRadius(650);
      else if (w < 768) setRadius(720);
      else if (w < 1024) setRadius(780);
      else setRadius(850);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return <CircularGallery items={galleryItems} radius={radius} autoRotateSpeed={0.015} />;
}

export default function GuestGallery() {
  return (
    <section className="overflow-hidden" style={{ backgroundColor: '#0A2540' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-32 pb-8 md:pb-12 text-center">
        <span className="inline-flex items-center gap-2 text-yellow-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
          <span className="w-8 h-px bg-yellow-400" />
          Guest Moments
          <span className="w-8 h-px bg-yellow-400" />
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Memories made at Golden 8.
        </h2>
        <p className="text-white/40 text-xs sm:text-sm mt-4">Drag or scroll to explore the gallery</p>
      </div>
      <div className="gallery-container" style={{ width: '100%', height: 'clamp(320px, 50vw, 500px)' }}>
        <ResponsiveGallery />
      </div>
      <div className="pb-10 md:pb-16" />
    </section>
  );
}
