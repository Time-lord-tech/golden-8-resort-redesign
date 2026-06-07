import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle, XCircle, Home, Smartphone, Image as ImageIcon } from 'lucide-react';

interface OrdersTableProps {
  filterStatus: string;
}

function OrdersTable({ filterStatus }: OrdersTableProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'reserved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'checked_in': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

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
                      <div className={`inline-block border text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 ${getStatusColor(first.status)}`}>
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

export default function VerificationsView() {
  const [activeTab, setActiveTab] = useState<'pending' | 'reserved' | 'checked_in'>('pending');

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
