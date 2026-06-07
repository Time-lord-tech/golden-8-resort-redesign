import React, { useState, useEffect, Fragment } from 'react';
import { supabase } from './lib/supabase';
import { CheckCircle, XCircle, LogOut, ClipboardCheck, CalendarDays, BarChart2, BedDouble, Home, Smartphone, Image as ImageIcon, Bell, Users, Activity, ArrowUpRight, ArrowRight, Trash2, Edit2, Plus, Database } from 'lucide-react';

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('verifications');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#05101A] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#FBBF24] border-t-transparent flex-shrink-0 rounded-full animate-spin"></div></div>;

  if (!session) {
    return <AdminLogin />;
  }

  return (
    <div className="flex h-screen antialiased bg-[#05101A] text-slate-200 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A2540]/80 backdrop-blur-xl border-r border-[#1a365d] flex flex-col hidden md:flex z-30 relative">
        <div className="h-20 flex items-center px-8 border-b border-[#1a365d]">
          <div className="w-8 h-8 bg-[#FBBF24] rounded-lg flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <span className="font-bold text-[#0A2540] text-lg font-serif">G8</span>
          </div>
          <h1 className="text-xl font-bold tracking-wide text-white">Admin</h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button onClick={() => setActiveView('verifications')} className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeView === 'verifications' ? 'bg-gradient-to-r from-[#FBBF24]/10 to-transparent border-l-4 border-[#FBBF24] text-[#FBBF24]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <ClipboardCheck className={`w-5 h-5 mr-3 ${activeView === 'verifications' ? 'text-[#FBBF24]' : 'text-slate-400'}`} /> Verifications
          </button>
          <button onClick={() => setActiveView('calendar')} className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeView === 'calendar' ? 'bg-gradient-to-r from-[#FBBF24]/10 to-transparent border-l-4 border-[#FBBF24] text-[#FBBF24]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <CalendarDays className={`w-5 h-5 mr-3 ${activeView === 'calendar' ? 'text-[#FBBF24]' : 'text-slate-400'}`} /> Tape Chart
          </button>
          <button onClick={() => setActiveView('dashboard')} className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeView === 'dashboard' ? 'bg-gradient-to-r from-[#FBBF24]/10 to-transparent border-l-4 border-[#FBBF24] text-[#FBBF24]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <BarChart2 className={`w-5 h-5 mr-3 ${activeView === 'dashboard' ? 'text-[#FBBF24]' : 'text-slate-400'}`} /> Analytics
          </button>
          <button onClick={() => setActiveView('accommodations')} className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeView === 'accommodations' ? 'bg-gradient-to-r from-[#FBBF24]/10 to-transparent border-l-4 border-[#FBBF24] text-[#FBBF24]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <BedDouble className={`w-5 h-5 mr-3 ${activeView === 'accommodations' ? 'text-[#FBBF24]' : 'text-slate-400'}`} /> Accommodations
          </button>
        </nav>

        <div className="p-4 border-t border-[#1a365d]">
          <button onClick={() => supabase.auth.signOut()} className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#f59e0b]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-20 bg-[#0A2540]/90 backdrop-blur-md border-b border-[#1a365d] flex items-center justify-between px-8 z-20">
          <h2 className="text-xl font-bold text-white flex items-center">
            Front Desk System
          </h2>
          
          <div className="flex items-center space-x-6">
             <button className="text-slate-400 hover:text-[#FBBF24] relative">
               <Bell className="w-5 h-5" />
             </button>
             <div className="flex items-center pl-6 border-l border-[#1a365d]">
               <div className="w-9 h-9 rounded-full bg-[#05101A] border border-[#1a365d] flex items-center justify-center text-[#FBBF24] font-bold text-sm">AD</div>
               <div className="ml-3 hidden sm:block">
                 <p className="text-sm font-medium text-slate-200">Admin Portal</p>
               </div>
             </div>
          </div>
        </header>

        {/* Dynamic Views Area */}
        <div className="flex-1 overflow-y-auto p-8 z-10 relative">
          {activeView === 'verifications' && <VerificationsView />}
          {activeView === 'calendar' && <TapeChartView />}
          {activeView === 'dashboard' && <AnalyticsView />}
          {activeView === 'accommodations' && <AccommodationsView />}
        </div>
      </main>
    </div>
  );
}

// 🔐 LOGIN SCREEN
function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#05101A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#f59e0b]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="bg-[#0A2540] border border-[#1a365d] p-8 rounded-3xl w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-10 relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FBBF24] shadow-[0_0_20px_rgba(251,191,36,0.3)] rounded-2xl mx-auto flex items-center justify-center mb-4">
            <span className="font-serif font-bold text-2xl text-[#0A2540]">G8</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-white">Staff Login</h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to manage resort bookings</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-2">
            <XCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-3 font-medium text-white focus:border-[#FBBF24]/50 focus:ring-1 focus:ring-[#FBBF24]/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-3 font-medium text-white focus:border-[#FBBF24]/50 focus:ring-1 focus:ring-[#FBBF24]/50 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#FBBF24] hover:bg-[#f59e0b] text-[#0A2540] font-bold py-4 rounded-xl mt-4 transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          >
            {loading ? <div className="w-5 h-5 border-2 border-[#0A2540]/30 border-t-[#0A2540] flex-shrink-0 rounded-full animate-spin"></div> : 'Access Dashboard'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-[#1a365d]">
          <a href="/" className="text-sm font-bold text-slate-500 hover:text-white transition-colors inline-block">
            &larr; Return to Guest Website
          </a>
        </div>
      </div>
    </div>
  );
}

// 📑 DASHBOARD TABS
function VerificationsView() {
  const [activeTab, setActiveTab] = useState<'pending' | 'reserved' | 'checked_in' | 'completed' | 'cancelled'>('pending');

  const tabs = [
    { id: 'pending', label: 'Pending Verifications' },
    { id: 'reserved', label: 'Upcoming Arrivals' },
    { id: 'checked_in', label: 'Currently Checked-In' },
  ];

  return (
    <div className="animate-[fadeIn_0.4s_ease_forwards]">
      <div className="flex items-center gap-6 mb-8 border-b border-[#1a365d]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 ${
              activeTab === tab.id ? 'border-[#FBBF24] text-[#FBBF24]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <OrdersTable filterStatus={activeTab} />
    </div>
  );
}

// 📊 ORDERS TABLE (GCash Verifications)
function OrdersTable({ filterStatus }: { filterStatus: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, rooms:room_id(title), guests(*), payments(*)')
      .eq('status', filterStatus)
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching orders:', error);
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('public:bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchOrders)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterStatus]);

  const handleAction = async (id: string, newStatus: string) => {
    const actionName = newStatus.replace('_', ' ').toUpperCase();
    if (!confirm(`Are you sure you want to mark this booking as ${actionName}?`)) return;

    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) alert(error.message);
    else fetchOrders();
  };

  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    const guestName = order.guests?.name?.toLowerCase() || '';
    const guestEmail = order.guests?.email?.toLowerCase() || '';
    const guestPhone = order.guests?.phone?.toLowerCase() || '';
    const refNum = (order.booking_ref || order.reference_number || '').toLowerCase();
    const gcashRef = (order.payments?.[0]?.gcash_reference || '').toLowerCase();
    const roomTitle = (order.rooms?.title || '').toLowerCase();
    
    return guestName.includes(query) || 
           guestEmail.includes(query) || 
           guestPhone.includes(query) || 
           refNum.includes(query) || 
           gcashRef.includes(query) ||
           roomTitle.includes(query);
  });

  const getGroupedOrders = () => {
    const groups: Record<string, any[]> = {};
    filteredOrders.forEach(order => {
      const ref = order.booking_ref || order.reference_number || 'UNKNOWN';
      if (!groups[ref]) groups[ref] = [];
      groups[ref].push(order);
    });
    return Object.entries(groups);
  };

  if (loading) return <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Loading orders...</div>;
  if (orders.length === 0) return (
    <div className="text-center py-20 bg-[#0A2540]/50 rounded-3xl border border-[#1a365d]">
      <CheckCircle size={48} className="text-[#1a365d] mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white">No Bookings Found</h3>
      <p className="text-slate-500">There are no orders with status "{filterStatus}".</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-slate-400 text-sm">🔍</span>
        </div>
        <input
          type="text"
          placeholder="Search by Guest Name, Email, Phone, REF or GCash Ref..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0A2540]/60 backdrop-blur-xl border border-[#1a365d] rounded-2xl pl-12 pr-4 py-4 text-slate-200 font-medium placeholder-slate-500 focus:border-[#FBBF24]/50 focus:ring-1 focus:ring-[#FBBF24]/50 outline-none transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-[#0A2540]/30 rounded-3xl border border-[#1a365d] border-dashed">
          <p className="text-slate-400 text-lg font-medium">No matching search results</p>
          <p className="text-slate-600 text-sm mt-1">Try adjusting your keywords or clearing the search query.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {getGroupedOrders().map(([ref, group]) => {
            const first = group[0];
            const totalPrice = group.reduce((sum, o) => sum + Number(o.payments?.[0]?.total_amount || 0), 0);
            const totalDeposit = group.reduce((sum, o) => sum + Number(o.payments?.[0]?.deposit_paid || 0), 0);
            const totalBalance = group.reduce((sum, o) => sum + Number(o.payments?.[0]?.balance_due || 0), 0);
            
            return (
              <div key={ref} className="bg-[#0A2540] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-[#1a365d] overflow-hidden flex flex-col md:flex-row">
                
                {/* Left side: Order Info */}
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-[#1a365d]">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="inline-block bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                        {first.status.replace('_', ' ')}
                      </div>
                      <h3 className="font-bold text-2xl text-white">{first.guests?.name || 'Unknown Guest'}</h3>
                      <p className="text-slate-400 text-sm flex gap-3 mt-1">
                        <span>{first.guests?.email}</span>
                        <span>•</span>
                        <span>{first.guests?.phone}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-500 block mb-1">REF: {ref}</span>
                      <span className="font-serif text-3xl font-bold text-white">₱{totalPrice.toLocaleString()}</span>
                      <div className="text-xs font-bold mt-3 space-y-1">
                        <span className="text-emerald-400 block bg-emerald-500/10 px-2 py-1 rounded inline-block">Paid Deposit: ₱{totalDeposit.toLocaleString()}</span>
                        {totalBalance > 0 && <span className="text-red-400 block bg-red-500/10 px-2 py-1 rounded inline-block mt-1">Collect at desk: ₱{totalBalance.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#05101A] p-5 rounded-2xl border border-[#1a365d]">
                      <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Dates</h4>
                      <p className="font-medium text-slate-200">{new Date(first.check_in).toLocaleDateString()} <span className="text-slate-500 mx-1">to</span> {new Date(first.check_out).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-[#05101A] p-5 rounded-2xl border border-[#1a365d]">
                      <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Rooms ({group.length})</h4>
                      <p className="font-medium text-[#FBBF24] flex items-center"><Home className="w-4 h-4 mr-2"/> {group.map(g => g.rooms?.title || 'Unknown').join(', ')}</p>
                    </div>
                  </div>

                  {/* Action Buttons based on status */}
                  <div className="flex flex-wrap gap-3">
                    {first.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(first.id, 'reserved')}
                          className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={16} /> Approve Payment & Reserve
                        </button>
                        <button
                          onClick={() => handleAction(first.id, 'cancelled')}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
                        >
                          <XCircle size={16} /> Reject / Cancel
                        </button>
                      </>
                    )}

                    {first.status === 'reserved' && (
                      <>
                        <button
                          onClick={() => handleAction(first.id, 'checked_in')}
                          className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={16} /> Check In Guest
                        </button>
                        <button
                          onClick={() => handleAction(first.id, 'cancelled')}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
                        >
                          <XCircle size={16} /> Cancel Booking
                        </button>
                      </>
                    )}

                    {first.status === 'checked_in' && (
                      <button
                        onClick={() => handleAction(first.id, 'completed')}
                        className="bg-yellow-500 hover:bg-yellow-400 text-[#0A2540] font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
                      >
                        <CheckCircle size={16} /> Complete Stay (Check Out)
                      </button>
                    )}
                  </div>
                </div>

                {/* Right side: GCash Proof */}
                <div className="w-full md:w-[400px] bg-[#05101A]/80 p-8 flex flex-col border-l border-[#1a365d]/50">
                  <h4 className="font-bold text-white mb-5 flex items-center gap-2">
                    <Smartphone className="text-blue-400 w-5 h-5" /> User GCash Proof
                  </h4>
                  
                  <div className="mb-5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-2">Typed Ref No.</label>
                    <div className="bg-[#0A2540] border border-[#FBBF24]/30 px-4 py-3 rounded-xl font-mono text-xl font-bold text-[#FBBF24] tracking-wider text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                      {first.payments?.[0]?.gcash_reference || 'NOT PROVIDED'}
                    </div>
                  </div>

                  <div className="flex-1 min-h-[250px] bg-[#0A2540] rounded-xl overflow-hidden relative border border-[#1a365d] group cursor-pointer">
                    {first.payments?.[0]?.receipt_url || first.payments?.[0]?.payment_proof_url ? (
                      <a href={first.payments[0].receipt_url || first.payments[0].payment_proof_url} target="_blank" rel="noreferrer" className="block w-full h-full relative">
                        <img src={first.payments[0].receipt_url || first.payments[0].payment_proof_url} alt="GCash Receipt" className="absolute inset-0 w-full h-full object-contain bg-black" />
                        <div className="absolute inset-0 bg-[#FBBF24]/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                          <span className="text-white font-bold text-sm bg-black/60 px-4 py-2 rounded-full border border-white/20">Click to Enlarge</span>
                        </div>
                      </a>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-6 text-center border-2 border-dashed border-[#1a365d] m-2 rounded-lg">
                        <ImageIcon className="w-10 h-10 mb-3 opacity-50" />
                        <span className="text-sm font-medium">No Receipt Uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 🗓️ TAPE CHART (PMS Split-Day Logic)
function TapeChartView() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate the next 14 days for the tape chart
  const startDate = new Date();
  startDate.setHours(0,0,0,0);
  const days = Array.from({length: 14}).map((_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    const fetchTapeChartData = async () => {
      setLoading(true);
      // Fetch rooms
      const { data: roomData } = await supabase.from('rooms').select('*').order('price', { ascending: true });
      if (roomData) setRooms(roomData);

      // Fetch active bookings (ignore cancelled or pending deposit, just reserved and checked_in for now)
      // Actually, let's fetch all non-cancelled to see everything
      const { data: bookingData } = await supabase
        .from('bookings')
        .select('*, guests(*)')
        .neq('status', 'cancelled');
      
      if (bookingData) setBookings(bookingData);
      setLoading(false);
    };

    fetchTapeChartData();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-500 animate-pulse">Loading Tape Chart Data...</div>;

  // 1. Explode Room Types into Physical Rows
  const physicalRows: any[] = [];
  rooms.forEach(room => {
    const count = room.total_rooms || 1;
    for (let i = 1; i <= count; i++) {
      physicalRows.push({ ...room, rowId: `${room.id}-${i}`, index: i });
    }
  });

  // 2. Map bookings to physical rows
  const rowAssignments: Record<string, any[]> = {};
  physicalRows.forEach(pr => rowAssignments[pr.rowId] = []);

  bookings.forEach(booking => {
    const qty = booking.room_quantity || 1;
    let assigned = 0;
    
    // Convert to simple time value for intersection testing
    const bStart = new Date(booking.check_in).getTime();
    const bEnd = new Date(booking.check_out).getTime();

    // Find physical rows of matching type
    const matchingRows = physicalRows.filter(pr => pr.id === booking.room_id);
    
    matchingRows.forEach(pr => {
      if (assigned >= qty) return;
      
      // Check if this row has an overlapping booking
      // Overlap: existing Start < new End AND existing End > new Start
      // Since check-out and check-in can happen same day (split day), we use <= and >= loosely, 
      // but strictly for the exact same night they conflict.
      const hasConflict = rowAssignments[pr.rowId].some(existing => {
        const eStart = new Date(existing.check_in).getTime();
        const eEnd = new Date(existing.check_out).getTime();
        // Conflict if they overlap nights. A check-out on the 15th and check-in on the 15th do NOT overlap nights.
        return (eStart < bEnd && eEnd > bStart);
      });

      if (!hasConflict) {
        rowAssignments[pr.rowId].push(booking);
        assigned++;
      }
    });
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-gradient-to-br from-[#f59e0b] to-[#d97706] border-[#b45309]';
      case 'reserved': return 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-900';
      case 'checked_in': return 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-900';
      case 'completed': return 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-900';
      default: return 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-900';
    }
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease_forwards]">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Tape Chart (Live PMS)</h2>
          <p className="text-slate-400 text-sm">Visual grid representing physical room occupancy and date overlaps.</p>
        </div>
        <div className="flex gap-4 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#f59e0b]"></div> Pending</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div> Reserved</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500"></div> Checked-In</div>
        </div>
      </div>
      <div className="bg-[#0A2540]/50 border border-[#1a365d] rounded-xl overflow-auto h-[600px] backdrop-blur-md relative">
        <table className="w-full text-sm border-collapse text-left min-w-max">
          <thead>
            <tr>
              <th className="p-4 w-56 bg-[#0A2540] sticky top-0 left-0 z-30 border-b border-r border-[#1a365d] font-bold text-white shadow-md">Physical Room</th>
              {days.map((day, i) => (
                <th key={i} className="p-3 w-32 text-center bg-[#0A2540] sticky top-0 z-20 border-b border-[#1a365d]">
                  <div className={`text-xs uppercase font-bold tracking-widest ${day.getDay() === 0 || day.getDay() === 6 ? 'text-[#FBBF24]' : 'text-slate-500'}`}>
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`font-bold text-lg ${day.getDay() === 0 || day.getDay() === 6 ? 'text-[#FBBF24]' : 'text-slate-200'}`}>
                    {day.getDate()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {rooms.map(room => {
              // Get rows just for this room type
              const typeRows = physicalRows.filter(pr => pr.id === room.id);
              
              return (
                <Fragment key={room.id}>
                  {/* Category Header */}
                  <tr className="bg-[#05101A]">
                    <td colSpan={days.length + 1} className="px-4 py-2 text-xs font-bold text-[#FBBF24] uppercase tracking-wider sticky left-0 z-10 border-t border-b border-[#1a365d] shadow-sm">
                      {room.title}
                    </td>
                  </tr>
                  {/* Physical Rows */}
                  {typeRows.map(pr => (
                    <tr key={pr.rowId} className="group">
                      <td className="px-4 py-4 font-medium text-slate-200 bg-[#0A2540] sticky left-0 z-10 border-r border-b border-[#1a365d] group-hover:bg-[#112d4e] transition-colors">
                        {room.title} - {String(pr.index).padStart(2, '0')}
                      </td>
                      {days.map((day, i) => {
                        const cellTime = day.getTime();
                        
                        // Check if any booking on this row spans this cell
                        const bookingInCell = rowAssignments[pr.rowId].find(b => {
                          const bStart = new Date(b.check_in);
                          bStart.setHours(0,0,0,0);
                          const bEnd = new Date(b.check_out);
                          bEnd.setHours(0,0,0,0);
                          
                          // A booking covers this cell if cellTime >= bStart AND cellTime < bEnd
                          // Note: We don't cover the check_out day cell itself fully because they leave at 11am,
                          // leaving it open for someone else's check-in.
                          return cellTime >= bStart.getTime() && cellTime < bEnd.getTime();
                        });

                        return (
                          <td key={i} className="border-b border-r border-[#1a365d] relative h-16 group-hover:bg-white/[0.02]">
                            {bookingInCell && cellTime === new Date(bookingInCell.check_in).setHours(0,0,0,0) && (
                                <div 
                                className={`absolute top-2 bottom-2 left-1 rounded-md px-3 py-1.5 flex flex-col justify-center text-white border-l-4 shadow-lg cursor-pointer transform transition-transform hover:scale-[1.02] hover:z-20 z-10 ${getStatusColor(bookingInCell.status)}`}
                                style={{ 
                                  width: `calc(${Math.max(1, Math.ceil((new Date(bookingInCell.check_out).getTime() - new Date(bookingInCell.check_in).getTime()) / (1000 * 60 * 60 * 24)))}00% - 8px)`,
                                  minWidth: 'calc(100% - 8px)'
                                }}
                                title={`Ref: ${bookingInCell.reference_number}\nStatus: ${bookingInCell.status}`}
                               >
                                 <span className="font-bold truncate text-xs">{bookingInCell.guests?.name}</span>
                                 <span className="text-[10px] opacity-80 uppercase tracking-widest">{bookingInCell.status}</span>
                               </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 📈 ANALYTICS DASHBOARD
function AnalyticsView() {
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

      // 3NF Normalization Implementation
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

    alert("Test data seeded successfully (3NF schema)!");
    
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

// 🛏️ ACCOMMODATIONS (Inventory)
function AccommodationsView() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    pax: '',
    total_rooms: 1,
    image_url: '',
    features: ''
  });

  const fetchRooms = async () => {
    setLoading(true);
    const { data } = await supabase.from('rooms').select('*').order('price', { ascending: true });
    if (data) setRooms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openCreateModal = () => {
    setEditingRoom(null);
    setFormData({ title: '', price: 0, pax: '2-4 pax', total_rooms: 1, image_url: '', features: 'AC, WiFi' });
    setIsModalOpen(true);
  };

  const openEditModal = (room: any) => {
    setEditingRoom(room);
    setFormData({
      title: room.title,
      price: room.price,
      pax: room.pax,
      total_rooms: room.total_rooms,
      image_url: room.image_url,
      features: room.features.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete the ${title}?`)) return;
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchRooms();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      title: formData.title,
      price: Number(formData.price),
      pax: formData.pax,
      total_rooms: Number(formData.total_rooms),
      available_rooms: Number(formData.total_rooms),
      image_url: formData.image_url,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
    };

    if (editingRoom) {
      const { error } = await supabase.from('rooms').update(payload).eq('id', editingRoom.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('rooms').insert([payload]);
      if (error) alert(error.message);
    }

    setIsModalOpen(false);
    fetchRooms();
  };

  if (loading && rooms.length === 0) return <div className="text-center py-20 text-slate-500 animate-pulse">Loading Inventory...</div>;

  return (
    <div className="animate-[fadeIn_0.4s_ease_forwards]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Room Inventory</h2>
          <p className="text-slate-400 text-sm">Manage physical room types and pricing.</p>
        </div>
        <button onClick={openCreateModal} className="bg-[#FBBF24] hover:bg-[#f59e0b] text-[#0A2540] px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          <Plus size={18} className="mr-2" /> Add New Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-[#0A2540] border border-[#1a365d] rounded-3xl overflow-hidden group shadow-lg relative">
            
            {/* Quick Actions overlay */}
            <div className="absolute top-4 left-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(room)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110">
                <Edit2 size={14} />
              </button>
              <button onClick={() => handleDelete(room.id, room.title)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="h-48 relative overflow-hidden">
              <img src={room.image_url} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] to-transparent opacity-80" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10">
                {room.total_rooms} Physical Rooms
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-serif text-2xl font-bold text-white mb-1">{room.title}</h3>
                <p className="text-[#FBBF24] font-bold text-lg">₱{room.price.toLocaleString()} <span className="text-slate-400 text-xs font-normal">/ night</span></p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#05101A] rounded-xl p-3 border border-[#1a365d]">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Max Capacity</p>
                  <p className="text-white font-medium text-sm flex items-center"><Users size={14} className="mr-2 text-slate-400"/> {room.pax}</p>
                </div>
                <div className="bg-[#05101A] rounded-xl p-3 border border-[#1a365d]">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Status</p>
                  <p className="text-emerald-400 font-medium text-sm flex items-center"><CheckCircle size={14} className="mr-2"/> Active</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {room.features?.map((f: string, i: number) => (
                  <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#05101A]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A2540] border border-[#1a365d] rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-[fadeIn_0.2s_ease_forwards]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><XCircle size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Room Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-[#FBBF24]/50 outline-none" placeholder="e.g. Deluxe Suite" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price / Night (₱)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-[#FBBF24]/50 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Physical Rooms</label>
                  <input type="number" required min="1" value={formData.total_rooms} onChange={e => setFormData({...formData, total_rooms: Number(e.target.value)})} className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-[#FBBF24]/50 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capacity (Pax)</label>
                  <input type="text" required value={formData.pax} onChange={e => setFormData({...formData, pax: e.target.value})} className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-[#FBBF24]/50 outline-none" placeholder="e.g. 2-4 pax" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Image URL</label>
                  <input type="url" required value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-[#FBBF24]/50 outline-none" placeholder="https://example.com/image.jpg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Features (Comma Separated)</label>
                  <input type="text" required value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-[#FBBF24]/50 outline-none" placeholder="AC, Free WiFi, Kitchen" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#FBBF24] hover:bg-[#f59e0b] text-[#0A2540] font-bold py-3.5 rounded-xl mt-6 transition-colors shadow-lg">
                {editingRoom ? 'Update Room' : 'Create Room'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
