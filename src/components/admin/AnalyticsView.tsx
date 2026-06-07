import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart2, Activity, ClipboardCheck, ArrowRight, LogOut, Database, ArrowUpRight } from 'lucide-react';

export default function AnalyticsView() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const { data } = await supabase.from('bookings').select('*, guests(*), payments(*)').neq('status', 'cancelled');
      if (data) setBookings(data);
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  const handleSeedData = async () => {
    if(!confirm("⚠️ Generates 15 random mock bookings across the next week. Proceed?")) return;
    setLoading(true);
    
    const { data: rm } = await supabase.from('rooms').select('id, price, title');
    if(!rm || rm.length === 0) { alert("No rooms found! Add rooms first."); setLoading(false); return; }

    const statuses = ['pending', 'reserved', 'checked_in', 'completed'];
    const mockGuests = [];
    const mockBookings = [];
    const mockPayments = [];
    const now = new Date();
    
    for(let i=0; i<15; i++) {
      const room = rm[Math.floor(Math.random() * rm.length)];
      const startOffset = Math.floor(Math.random() * 10) - 3; 
      const nights = Math.floor(Math.random() * 4) + 1;
      
      const checkIn = new Date(now);
      checkIn.setDate(now.getDate() + startOffset);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkIn.getDate() + nights);
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const total = room.price * nights;

      const guestId = crypto.randomUUID();
      const bookingId = crypto.randomUUID();
      const paymentId = crypto.randomUUID();

      mockGuests.push({
        id: guestId,
        name: `Test Guest ${Math.floor(Math.random() * 1000)}`,
        email: `test${Date.now()}_${i}@example.com`,
        phone: '09123456789'
      });
      
      mockBookings.push({
        id: bookingId,
        guest_id: guestId,
        room_id: room.id,
        check_in: checkIn.toISOString().split('T')[0],
        check_out: checkOut.toISOString().split('T')[0],
        status,
        room_quantity: Math.floor(Math.random() * 2) + 1,
        reference_number: `MOCK-${Date.now().toString().slice(-4)}-${i}`
      });

      mockPayments.push({
        id: paymentId,
        booking_id: bookingId,
        total_amount: total,
        deposit_paid: ['reserved', 'checked_in', 'completed'].includes(status) ? total * 0.5 : 0,
        balance_due: ['reserved', 'checked_in'].includes(status) ? total * 0.5 : 0,
        payment_proof_url: null
      });
    }
    
    await supabase.from('guests').insert(mockGuests);
    await supabase.from('bookings').insert(mockBookings);
    await supabase.from('payments').insert(mockPayments);

    alert("Test data seeded successfully!");
    
    const { data } = await supabase.from('bookings').select('*, guests(*), payments(*)').neq('status', 'cancelled');
    if (data) setBookings(data);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-20 text-slate-500 animate-pulse">Loading Analytics Data...</div>;

  // Calculate Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const totalCollected = bookings.reduce((sum, b) => sum + (Number(b.payments?.[0]?.deposit_paid) || 0), 0);
  const totalPendingAtDesk = bookings.reduce((sum, b) => {
    if (b.status === 'reserved' || b.status === 'checked_in') {
      return sum + (Number(b.payments?.[0]?.balance_due) || 0);
    }
    return sum;
  }, 0);

  const pendingGcashCount = bookings.filter(b => b.status === 'pending').length;
  
  const arrivalsToday = bookings.filter(b => {
    if (!b.check_in) return false;
    try {
      const ci = new Date(b.check_in).toISOString().split('T')[0];
      return ci === todayStr && (b.status === 'reserved' || b.status === 'checked_in');
    } catch { return false; }
  }).length;

  const departuresToday = bookings.filter(b => {
    if (!b.check_out) return false;
    try {
      const co = new Date(b.check_out).toISOString().split('T')[0];
      return co === todayStr && (b.status === 'checked_in' || b.status === 'completed');
    } catch { return false; }
  }).length;

  return (
    <div className="animate-[fadeIn_0.4s_ease_forwards] max-w-6xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Operations Overview</h2>
          <p className="text-slate-400 text-sm">Real-time resort performance and financial metrics.</p>
        </div>
        <button onClick={handleSeedData} className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors border border-white/10">
          <Database size={16} className="mr-2 text-[#FBBF24]" /> Seed Test Bookings
        </button>
      </div>

      {/* Top Financials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0A2540] border border-[#1a365d] rounded-3xl p-8 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <BarChart2 size={64} />
          </div>
          <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-2">Total Revenue Collected</p>
          <p className="text-4xl font-serif font-bold text-white mb-4">₱{totalCollected.toLocaleString()}</p>
          <div className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
            <ArrowUpRight size={14} className="mr-1" /> All-Time Net
          </div>
        </div>

        <div className="bg-[#0A2540] border border-[#1a365d] rounded-3xl p-8 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Activity size={64} />
          </div>
          <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-2">Pending Cash at Desk</p>
          <p className="text-4xl font-serif font-bold text-[#FBBF24] mb-4">₱{totalPendingAtDesk.toLocaleString()}</p>
          <div className="inline-flex items-center text-xs font-bold text-slate-400 bg-white/5 px-2 py-1 rounded-md">
            To be collected on arrival
          </div>
        </div>

        <div className="bg-[#0A2540] border border-[#1a365d] rounded-3xl p-8 relative overflow-hidden shadow-lg">
           <div className="absolute top-0 right-0 p-6 opacity-10">
            <ClipboardCheck size={64} />
          </div>
          <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-2">Pending GCash Verifications</p>
          <p className="text-4xl font-serif font-bold text-white mb-4">{pendingGcashCount}</p>
          <div className="inline-flex items-center text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
            Awaiting Admin Review
          </div>
        </div>
      </div>

      {/* Front Desk Action Center */}
      <h3 className="text-lg font-bold text-white mb-4">Today's Front Desk Action Center</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0A2540] border border-[#1a365d] rounded-3xl p-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-1">Arrivals Today</p>
            <p className="text-3xl font-bold text-white">{arrivalsToday}</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <ArrowRight size={32} />
          </div>
        </div>
        <div className="bg-[#0A2540] border border-[#1a365d] rounded-3xl p-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-1">Departures Today</p>
            <p className="text-3xl font-bold text-white">{departuresToday}</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center">
            <LogOut size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}
