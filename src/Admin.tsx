import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { LogOut, ClipboardCheck, CalendarDays, BarChart2, BedDouble, Plus, Bell } from 'lucide-react';
import WalkInBookingModal from './components/WalkInBookingModal';
import AdminLogin from './components/admin/AdminLogin';
import VerificationsView from './components/admin/VerificationsView';
import TapeChartView from './components/admin/TapeChartView';
import AnalyticsView from './components/admin/AnalyticsView';
import AccommodationsView from './components/admin/AccommodationsView';

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('verifications');
  const [showWalkInModal, setShowWalkInModal] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05101A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FBBF24] border-t-transparent flex-shrink-0 rounded-full animate-spin"></div>
      </div>
    );
  }

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
        
        <div className="px-4 pt-4">
          <button 
            onClick={() => setShowWalkInModal(true)} 
            className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold bg-[#FBBF24] hover:bg-[#f59e0b] text-[#0A2540] transition-all gap-2 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
          >
            <Plus className="w-4 h-4" /> Book Walk-In
          </button>
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

      <WalkInBookingModal 
        isOpen={showWalkInModal} 
        onClose={() => setShowWalkInModal(false)} 
      />
    </div>
  );
}
