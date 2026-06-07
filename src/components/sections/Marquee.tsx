import { Star } from 'lucide-react';

export default function Marquee() {
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
