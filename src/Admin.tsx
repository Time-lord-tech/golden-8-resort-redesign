import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { CheckCircle, XCircle, LogOut } from 'lucide-react';

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="min-h-screen bg-[#0A2540] flex items-center justify-center"><div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent flex-shrink-0 rounded-full animate-spin"></div></div>;

  if (!session) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
            <span className="font-serif font-bold text-[#0A2540]">G8</span>
          </div>
          <div>
            <h1 className="font-bold text-[#0A2540] leading-tight">Admin Portal</h1>
            <p className="text-xs text-gray-500 font-medium">Golden 8 Resort</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="text-sm font-bold text-[#0A2540] hover:text-[#0A2540] transition-all bg-yellow-400 hover:bg-yellow-500 hover:scale-[0.98] active:scale-95 px-5 py-2.5 rounded-xl shadow-sm"
          >
            &larr; Back to Website
          </a>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-[#0A2540] mb-8">Front Desk System</h2>
        <Dashboard />
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-400 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <span className="font-serif font-bold text-2xl text-[#0A2540]">G8</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#0A2540]">Staff Login</h2>
          <p className="text-gray-500 text-sm mt-2">Sign in to manage resort bookings</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-2">
            <XCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-[#0A2540] focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-[#0A2540] focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#0A2540] font-bold py-4 rounded-xl mt-4 transition-colors flex items-center justify-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-[#0A2540]/30 border-t-[#0A2540] flex-shrink-0 rounded-full animate-spin"></div> : 'Access Dashboard'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <a href="/" className="text-sm font-bold text-gray-400 hover:text-[#0A2540] transition-colors inline-block">
            &larr; Return to Guest Website
          </a>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState<'pending' | 'reserved' | 'checked_in' | 'completed' | 'cancelled'>('pending');

  const tabs = [
    { id: 'pending', label: 'Pending Verifications' },
    { id: 'reserved', label: 'Upcoming Arrivals' },
    { id: 'checked_in', label: 'Currently Checked-In' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-8 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 ${
              activeTab === tab.id ? 'border-[#0A2540] text-[#0A2540]' : 'border-transparent text-gray-400 hover:text-gray-700'
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

function OrdersTable({ filterStatus }: { filterStatus: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, rooms:room_id(title)')
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

  const getGroupedOrders = () => {
    const groups: Record<string, any[]> = {};
    orders.forEach(order => {
      const ref = order.booking_ref || order.reference_number || 'UNKNOWN';
      if (!groups[ref]) groups[ref] = [];
      groups[ref].push(order);
    });
    return Object.entries(groups);
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium animate-pulse">Loading orders...</div>;
  if (orders.length === 0) return (
    <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
      <CheckCircle size={48} className="text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-[#0A2540]">No Bookings Found</h3>
      <p className="text-gray-500">There are no orders with status "{filterStatus}".</p>
    </div>
  );

  return (
    <div className="grid gap-6">
      {getGroupedOrders().map(([ref, group]) => {
        const first = group[0];
        const totalPrice = group.reduce((sum, o) => sum + Number(o.total_price), 0);
        const totalDeposit = group.reduce((sum, o) => sum + Number(o.deposit_paid || 0), 0);
        const totalBalance = group.reduce((sum, o) => sum + Number(o.balance_due || 0), 0);
        
        return (
          <div key={ref} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left side: Order Info */}
            <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2">
                    {first.status.replace('_', ' ')}
                  </div>
                  <h3 className="font-bold text-xl text-[#0A2540]">{first.guest_name}</h3>
                  <p className="text-gray-500 text-sm flex gap-3 mt-1">
                    <span>{first.email}</span>
                    <span>•</span>
                    <span>{first.phone}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 block mb-1">REF: {ref}</span>
                  <span className="font-serif text-2xl font-bold text-[#0A2540]">₱{totalPrice.toLocaleString()}</span>
                  <div className="text-xs font-bold mt-2">
                    <span className="text-green-600 block">Paid: ₱{totalDeposit.toLocaleString()}</span>
                    {totalBalance > 0 && <span className="text-red-500 block">Collect at desk: ₱{totalBalance.toLocaleString()}</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Dates</h4>
                  <p className="font-medium text-[#0A2540]">{new Date(first.check_in).toLocaleDateString()} to {new Date(first.check_out).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Rooms ({group.length})</h4>
                  <p className="font-medium text-[#0A2540]">{group.map(g => g.rooms?.title || 'Unknown').join(', ')}</p>
                </div>
              </div>

              {/* Action Buttons based on status */}
              <div className="flex gap-3">
                {filterStatus === 'pending' && (
                  <>
                    <button onClick={() => group.forEach(g => handleAction(g.id, 'reserved'))} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                      <CheckCircle size={18} /> Verify Form & Reserve
                    </button>
                    <button onClick={() => group.forEach(g => handleAction(g.id, 'cancelled'))} className="px-6 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-colors">
                      Reject
                    </button>
                  </>
                )}
                {filterStatus === 'reserved' && (
                  <button onClick={() => group.forEach(g => handleAction(g.id, 'checked_in'))} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <CheckCircle size={18} /> Guest Checked In
                  </button>
                )}
                {filterStatus === 'checked_in' && (
                  <button onClick={() => group.forEach(g => handleAction(g.id, 'completed'))} className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    Finish & Check Out
                  </button>
                )}
              </div>
            </div>

            {/* Right side: GCash Proof */}
            <div className="w-full md:w-96 bg-gray-50 p-6 flex flex-col">
              <h4 className="font-bold text-[#0A2540] mb-4 flex items-center gap-2">
                User GCash Proof
              </h4>
              
              <div className="mb-4">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1">Typed Ref No.</label>
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-mono text-lg font-bold text-[#0A2540] tracking-wider text-center">
                  {first.gcash_reference || 'NOT PROVIDED'}
                </div>
              </div>

              <div className="flex-1 min-h-[200px] bg-gray-200 rounded-xl overflow-hidden relative border border-gray-300">
                {first.receipt_url ? (
                  <a href={first.receipt_url} target="_blank" rel="noreferrer" className="block w-full h-full relative group cursor-zoom-in">
                    <img src={first.receipt_url} alt="GCash Receipt" className="absolute inset-0 w-full h-full object-contain bg-white" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Click to Enlarge</span>
                    </div>
                  </a>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium">
                    No Receipt Uploaded
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
