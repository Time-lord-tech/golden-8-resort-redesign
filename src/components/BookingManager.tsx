import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, ArrowRight, CheckCircle2, Minus, Plus, MessageSquare, ArrowLeft, UploadCloud } from 'lucide-react';
import { supabase } from '../lib/supabase';

export type Room = {
  id: string;
  title: string;
  pax: string;
  price: number;
  image_url: string;
  features: string[];
  total_rooms: number;
  available_rooms: number;
};

type RoomSelection = {
  room: Room;
  quantity: number;
};

export function BookingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Step 1: Dates & Room Selection
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<RoomSelection[]>([]);

  // Step 2: Guest Details
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Step 3: Proof of Payment
  const [gcashRef, setGcashRef] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Derived calculations
  const totalGuests = selectedRooms.reduce((sum, sr) => {
    const maxPax = parseInt(sr.room.pax.match(/\d+/)?.[0] || '2');
    return sum + (maxPax * sr.quantity);
  }, 0);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return selectedRooms.reduce((sum, sr) => sum + (sr.room.price * sr.quantity * nights), 0);
  };

  const totalRoomCount = selectedRooms.reduce((s, sr) => s + sr.quantity, 0);

  useEffect(() => {
    fetchRooms();

    const handleRoomSelect = (e: any) => {
      if (e.detail?.id) {
        const room = e.detail as Room;
        setSelectedRooms(prev => {
          const existing = prev.find(sr => sr.room.id === room.id);
          if (existing) return prev;
          return [...prev, { room, quantity: 1 }];
        });
        setStep(1);
      }
    };
    window.addEventListener('select-room', handleRoomSelect);
    return () => window.removeEventListener('select-room', handleRoomSelect);
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('rooms').select('*').order('price', { ascending: true });
    if (!error && data) setRooms(data);
    setLoading(false);
  };

  const updateRoomQty = (roomId: string, delta: number) => {
    setSelectedRooms(prev => {
      return prev.map(sr => {
        if (sr.room.id !== roomId) return sr;
        const newQty = Math.max(0, Math.min(sr.room.available_rooms, sr.quantity + delta));
        return { ...sr, quantity: newQty };
      }).filter(sr => sr.quantity > 0);
    });
  };

  const toggleRoom = (room: Room) => {
    setSelectedRooms(prev => {
      const existing = prev.find(sr => sr.room.id === room.id);
      if (existing) return prev.filter(sr => sr.room.id !== room.id);
      return [...prev, { room, quantity: 1 }];
    });
  };

  const handlePhoneChange = (val: string) => {
    // Only allow digits, +, -, spaces, and parentheses
    const sanitized = val.replace(/[^0-9+\-() ]/g, '');
    setPhone(sanitized);
  };

  const handleNameChange = (val: string) => {
    // Only allow letters, spaces, hyphens, periods, and apostrophes
    const sanitized = val.replace(/[^a-zA-ZÀ-ÿ\s\-'.]/g, '');
    setGuestName(sanitized);
  };

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const scrollToTop = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToStep = (s: number) => {
    setStep(s);
    setTimeout(scrollToTop, 100);
  };

  return (
    <section id="booking" ref={sectionRef} className="relative bg-[#0A2540] overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      {/* Top gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
        {/* Section Header - only on Step 1 */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-3 text-yellow-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-6">
                <span className="w-8 h-px bg-yellow-400" />
                Reserve Your Paradise
                <span className="w-8 h-px bg-yellow-400" />
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                Book your <em className="italic text-yellow-400">stay</em>.
              </h2>
              <p className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed">
                Select your dates, choose your rooms, and secure your reservation in just a few steps. No hidden fees.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-0 mb-12">
            {[
              { num: 1, label: 'Dates & Rooms' },
              { num: 2, label: 'Guest Info' },
              { num: 3, label: 'Payment' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
                  step === s.num ? 'bg-yellow-500 text-[#0A2540]' :
                  step > s.num ? 'bg-white/10 text-yellow-400' : 'bg-white/5 text-white/30'
                }`}>
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    step === s.num ? 'bg-[#0A2540] text-yellow-400' :
                    step > s.num ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/10 text-white/40'
                  }`}>{step > s.num ? '✓' : s.num}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline">{s.label}</span>
                </div>
                {i < 2 && <div className={`w-8 md:w-16 h-px mx-1 ${step > s.num ? 'bg-yellow-400/40' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ═══════════════════ STEP 1: DATES & ROOMS ═══════════════════ */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Date & Guest Picker */}
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Check-in Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                      <input
                        type="date"
                        value={checkIn}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          setCheckIn(e.target.value);
                          if (checkOut && e.target.value >= checkOut) setCheckOut('');
                        }}
                        className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.06] border border-white/10 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all font-medium text-white text-sm [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Check-out Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        disabled={!checkIn}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.06] border border-white/10 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all font-medium text-white disabled:opacity-30 text-sm [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>

                {checkIn && checkOut && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
                    <span className="text-white/40">Duration</span>
                    <span className="text-yellow-400 font-bold">{calculateNights()} Night{calculateNights() > 1 ? 's' : ''}</span>
                  </motion.div>
                )}
              </div>

              {/* Room Selection Grid */}
              <h3 className="text-white font-serif text-2xl font-bold mb-6 flex items-center gap-3">
                Choose your rooms
                {totalRoomCount > 0 && (
                  <span className="bg-yellow-500 text-[#0A2540] text-xs font-bold px-3 py-1 rounded-full">{totalRoomCount} selected</span>
                )}
              </h3>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {rooms.map(room => {
                    const selection = selectedRooms.find(sr => sr.room.id === room.id);
                    const isSelected = !!selection;
                    const isFull = room.available_rooms <= 0;

                    return (
                      <motion.div
                        key={room.id}
                        layout
                        className={`rounded-3xl overflow-hidden transition-all duration-300 ${
                          isFull ? 'opacity-40 pointer-events-none' :
                          isSelected ? 'ring-2 ring-yellow-400 shadow-[0_0_60px_rgba(245,158,11,0.15)]' : 'ring-1 ring-white/10 hover:ring-white/20'
                        }`}
                      >
                        {/* Room Image */}
                        <div className="h-48 relative overflow-hidden cursor-pointer group" onClick={() => !isFull && toggleRoom(room)}>
                          <img src={room.image_url} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-transparent to-transparent opacity-70" />
                          {isSelected && (
                            <div className="absolute top-4 right-4 bg-yellow-400 text-[#0A2540] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
                              <CheckCircle2 size={12} /> Selected
                            </div>
                          )}
                          {isFull && (
                            <div className="absolute inset-0 bg-[#0A2540]/60 flex items-center justify-center">
                              <span className="text-white/80 font-bold text-sm uppercase tracking-widest">Fully Booked</span>
                            </div>
                          )}
                          {!isFull && room.available_rooms <= 3 && (
                            <div className="absolute top-4 left-4 bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                              Only {room.available_rooms} left
                            </div>
                          )}
                          <div className="absolute bottom-4 left-4 right-4">
                            <h4 className="font-serif font-bold text-xl text-white drop-shadow-md">{room.title}</h4>
                            <p className="text-white/60 text-xs mt-1 flex items-center gap-1.5"><Users size={12} /> {room.pax}</p>
                          </div>
                        </div>

                        {/* Room Details */}
                        <div className="bg-white/[0.04] p-5">
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {room.features.map((f, i) => (
                              <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-white/50 bg-white/[0.06] px-2.5 py-1 rounded-full border border-white/5">{f}</span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-white">₱{room.price.toLocaleString()}</span>
                              <span className="text-white/40 text-xs ml-1">/night</span>
                            </div>

                            {isSelected ? (
                              <div className="flex items-center gap-3 bg-white/[0.06] rounded-xl px-3 py-2 border border-white/10">
                                <button
                                  onClick={() => updateRoomQty(room.id, -1)}
                                  className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-white font-bold text-sm w-5 text-center">{selection!.quantity}</span>
                                <button
                                  onClick={() => updateRoomQty(room.id, 1)}
                                  disabled={selection!.quantity >= room.available_rooms}
                                  className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors disabled:opacity-30"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => toggleRoom(room)}
                                className="bg-yellow-500 hover:bg-yellow-400 text-[#0A2540] px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                              >
                                Select
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Bar */}
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-8 text-center md:text-left">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1">Rooms</p>
                    <p className="text-white font-bold text-lg">{totalRoomCount}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden md:block" />
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1">Max Guests</p>
                    <p className="text-white font-bold text-lg">{totalGuests}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden md:block" />
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1">Total</p>
                    <p className="text-yellow-400 font-bold text-2xl font-serif">₱{calculateTotal().toLocaleString()}</p>
                  </div>
                </div>
                <button
                  disabled={!checkIn || !checkOut || totalRoomCount === 0}
                  onClick={() => goToStep(2)}
                  className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-[#0A2540] px-10 py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-yellow-500/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                  Next: Guest Details <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ STEP 2: GUEST DETAILS ═══════════════════ */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <button onClick={() => goToStep(1)} className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium mb-8 transition-colors">
                <ArrowLeft size={16} /> Back to Room Selection
              </button>

              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">Guest <em className="italic text-yellow-400">details</em></h2>
              <p className="text-white/40 text-sm mb-10">Tell us about who's checking in. All fields are required.</p>

              {/* Booking summary mini-bar */}
              <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-4 mb-10 flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block">Stay</span>
                    <span className="text-white font-medium">{calculateNights()} nights</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block">Rooms</span>
                    <span className="text-white font-medium">{selectedRooms.map(sr => `${sr.quantity}× ${sr.room.title}`).join(', ')}</span>
                  </div>
                </div>
                <span className="text-yellow-400 font-bold text-lg font-serif">₱{calculateTotal().toLocaleString()}</span>
              </div>

              {/* Contact Fields */}
              <div className="bg-white/[0.04] rounded-3xl border border-white/10 p-6 md:p-8 mb-6">
                <h3 className="text-[11px] uppercase font-bold tracking-widest text-white/30 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/50 mb-2">Full Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      placeholder="Juan Dela Cruz"
                      value={guestName}
                      onChange={e => handleNameChange(e.target.value)}
                      maxLength={60}
                      className="w-full px-5 py-4 rounded-2xl bg-white/[0.06] border border-white/10 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all font-medium text-white text-sm placeholder:text-white/20"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/50 mb-2">Email Address <span className="text-red-400">*</span></label>
                      <input
                        type="email"
                        placeholder="juan@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        maxLength={100}
                        className={`w-full px-5 py-4 rounded-2xl bg-white/[0.06] border outline-none transition-all font-medium text-white text-sm placeholder:text-white/20 ${
                          email && !isValidEmail(email) ? 'border-red-400 focus:ring-red-400/10' : 'border-white/10 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10'
                        }`}
                      />
                      {email && !isValidEmail(email) && (
                        <p className="text-red-400 text-[11px] mt-1.5 font-medium">Please enter a valid email address</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/50 mb-2">Mobile Number <span className="text-red-400">*</span></label>
                      <input
                        type="tel"
                        inputMode="tel"
                        placeholder="09XX-XXX-XXXX"
                        value={phone}
                        onChange={e => handlePhoneChange(e.target.value)}
                        maxLength={16}
                        className="w-full px-5 py-4 rounded-2xl bg-white/[0.06] border border-white/10 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all font-medium text-white text-sm placeholder:text-white/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="bg-white/[0.04] rounded-3xl border border-white/10 p-6 md:p-8 mb-6">
                <h3 className="text-[11px] uppercase font-bold tracking-widest text-white/30 mb-4 flex items-center gap-2">
                  <MessageSquare size={14} /> Special Requests <span className="text-white/20">(Optional)</span>
                </h3>
                <textarea
                  placeholder="E.g., Early check-in, extra mattress, birthday celebration setup..."
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.06] border border-white/10 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all font-medium text-white text-sm placeholder:text-white/20 resize-none"
                />
                <p className="text-white/20 text-[10px] mt-2 text-right">{specialRequests.length}/500</p>
              </div>

              {/* Payment Preference */}
              <div className="bg-white/[0.04] rounded-3xl border border-white/10 p-6 md:p-8 mb-6">
                <h3 className="text-[11px] uppercase font-bold tracking-widest text-white/30 mb-6">Payment Preference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentType('full')}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                      paymentType === 'full' ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white text-sm">Pay in Full</h4>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 px-2 py-1 rounded-md">Recommended</span>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">Pay 100% upfront for a faster, smoother check-in experience.</p>
                    <p className="text-yellow-400 font-bold text-lg mt-3 font-serif">₱{calculateTotal().toLocaleString()}</p>
                  </div>
                  <div
                    onClick={() => setPaymentType('deposit')}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                      paymentType === 'deposit' ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white text-sm">50% Deposit</h4>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">Flexible</span>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">Reserve now, pay the rest when you arrive at the resort.</p>
                    <p className="text-yellow-400 font-bold text-lg mt-3 font-serif">₱{(calculateTotal() / 2).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1">Due Now</p>
                  <p className="text-yellow-400 font-bold text-2xl font-serif">₱{(paymentType === 'deposit' ? calculateTotal() / 2 : calculateTotal()).toLocaleString()}</p>
                </div>
                <button
                  disabled={!guestName || !email || !isValidEmail(email) || phone.length < 7}
                  onClick={() => goToStep(3)}
                  className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-[#0A2540] px-10 py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-yellow-500/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ STEP 3: PAYMENT ═══════════════════ */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <button onClick={() => goToStep(2)} className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium mb-8 transition-colors">
                <ArrowLeft size={16} /> Back to Guest Details
              </button>

              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">Proof of <em className="italic text-yellow-400">Payment</em></h2>
              <p className="text-white/40 text-sm mb-10">Scan our official GCash QR code, send the exact amount, and upload your receipt below to secure your booking.</p>

              {/* Payment Summary */}
              <div className="bg-white/[0.04] rounded-3xl border border-white/10 p-6 md:p-8 mb-6">
                <h3 className="text-[11px] uppercase font-bold tracking-widest text-white/30 mb-6">Order Summary</h3>
                {selectedRooms.map(sr => (
                  <div key={sr.room.id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                    <div>
                      <span className="text-white font-medium text-sm">{sr.quantity}× {sr.room.title}</span>
                      <span className="text-white/30 text-xs ml-2">× {calculateNights()} nights</span>
                    </div>
                    <span className="text-white font-bold">₱{(sr.room.price * sr.quantity * calculateNights()).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-white/10">
                  <span className="text-white/60 font-bold text-sm">{paymentType === 'deposit' ? '50% Deposit Due Now' : 'Total Due'}</span>
                  <span className="text-yellow-400 font-bold text-2xl font-serif">₱{(paymentType === 'deposit' ? calculateTotal() / 2 : calculateTotal()).toLocaleString()}</span>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-white/[0.04] rounded-3xl border border-white/10 p-6 md:p-8 mb-6 flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="w-48 h-48 bg-white p-2 rounded-xl border-4 border-blue-500 overflow-hidden shrink-0 relative">
                  {/* Using a placeholder for now, replace with real GCash QR in /assets/images/client_gcash_qr.png later */}
                  <img src="/assets/images/client_gcash_qr.png" alt="GCash QR Code" className="w-full h-full object-cover" onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1595079676339-1534801ad6cb?auto=format&fit=crop&q=80&w=200';
                  }} />
                  <div className="absolute inset-x-0 bottom-0 bg-blue-500 text-white text-[10px] font-bold tracking-widest uppercase text-center py-1">
                    GCash Scanner
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold text-white mb-2">Pay via GCash</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-sm">
                    Open your GCash app, scan the QR code, and send <strong className="text-white">₱{(paymentType === 'deposit' ? calculateTotal() / 2 : calculateTotal()).toLocaleString()}</strong>. Alternatively, you can send it directly to our official number:
                  </p>
                  <div className="inline-block bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xl font-mono font-bold tracking-widest text-yellow-400">
                    0912 345 6789
                  </div>
                </div>
              </div>

              {/* Receipt Upload Section */}
              <div className="bg-white/[0.04] rounded-3xl border border-white/10 p-6 md:p-8 mb-6 space-y-6">
                <h3 className="text-[11px] uppercase font-bold tracking-widest text-white/30">Upload Proof</h3>
                
                <div>
                  <label className="block text-xs font-bold text-white/50 mb-2">13-Digit GCash Reference No. <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. 1023 4567 8901 2"
                    value={gcashRef}
                    onChange={e => setGcashRef(e.target.value.replace(/\D/g, '').slice(0, 13))}
                    className="w-full px-5 py-4 rounded-2xl bg-white/[0.06] border border-white/10 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all font-mono font-medium text-white text-sm placeholder:text-white/20"
                  />
                  {gcashRef && gcashRef.length < 13 && (
                    <p className="text-yellow-400 text-[10px] mt-1.5 font-bold uppercase tracking-widest">A valid reference number is usually 13 digits.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/50 mb-2">Screenshot of Receipt <span className="text-red-400">*</span></label>
                  <label className={`w-full flex-col flex items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${receiptFile ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/20 hover:border-white/40 hover:bg-white/[0.02]'}`}>
                    <UploadCloud className={`mb-3 ${receiptFile ? 'text-yellow-400' : 'text-white/40'}`} size={32} />
                    <span className="text-sm font-bold text-white mb-1">{receiptFile ? receiptFile.name : 'Click to Upload Screenshot'}</span>
                    <span className="text-xs text-white/40">{receiptFile ? `${(receiptFile.size / 1024 / 1024).toFixed(2)} MB preview attached` : 'PNG, JPG or JPEG (max. 5MB)'}</span>
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setReceiptFile(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 mb-10 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 rounded-md accent-yellow-400 mt-0.5 flex-shrink-0"
                />
                <span className="text-white/40 text-xs leading-relaxed group-hover:text-white/60 transition-colors">
                  I confirm that I have transferred the correct amount and agree to the Golden 8 Beach Resort <span className="text-yellow-400 underline underline-offset-2">Booking Policy</span>. I understand that my booking is pending manual verification by the resort staff.
                </span>
              </label>

              {/* Submit */}
              <button
                disabled={processing || !agreedToTerms || !gcashRef || !receiptFile}
                onClick={async () => {
                  setProcessing(true);

                  try {
                    const ref = `G8-${Date.now().toString(36).toUpperCase().slice(-6)}`;
                    setBookingRef(ref);

                    // 1. Upload receipt to Supabase Storage
                    const fileExt = receiptFile!.name.split('.').pop();
                    const fileName = `${ref}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                    const { data: uploadData, error: uploadError } = await supabase.storage
                      .from('receipts')
                      .upload(fileName, receiptFile!);

                    if (uploadError) throw new Error('Failed to upload receipt. Please try again.');

                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                      .from('receipts')
                      .getPublicUrl(uploadData.path);

                    // 2. Save booking to Supabase with 'pending' status
                    for (const sr of selectedRooms) {
                      const totalPrice = sr.room.price * sr.quantity * calculateNights();
                      await supabase.from('bookings').insert([{
                        room_id: sr.room.id,
                        guest_name: guestName,
                        email,
                        phone,
                        check_in: checkIn,
                        check_out: checkOut,
                        guests_count: totalGuests,
                        total_price: totalPrice,
                        deposit_paid: paymentType === 'deposit' ? totalPrice / 2 : totalPrice,
                        balance_due: paymentType === 'deposit' ? totalPrice / 2 : 0,
                        status: 'pending',
                        reference_number: ref,
                        booking_ref: ref,
                        special_requests: specialRequests,
                        room_quantity: sr.quantity,
                        payment_type: paymentType,
                        gcash_reference: gcashRef,
                        receipt_url: publicUrl
                      }]);
                    }

                    goToStep(4);
                  } catch (err: any) {
                    alert(err.message || 'Something went wrong while submitting your order.');
                  } finally {
                    setProcessing(false);
                  }
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-[#0A2540] py-5 rounded-2xl font-bold text-base transition-all shadow-xl shadow-yellow-500/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {processing ? (
                  <><div className="w-5 h-5 border-2 border-[#0A2540]/30 border-t-[#0A2540] rounded-full animate-spin" /> Submitting Proof...</>
                ) : (
                  <>Submit Order <ArrowRight size={18} /></>
                )}
              </button>
            </motion.div>
          )}

          {/* ═══════════════════ STEP 4: CONFIRMATION ═══════════════════ */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="max-w-lg mx-auto text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-28 h-28 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle2 size={48} />
              </motion.div>

              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Booking <em className="italic text-yellow-400">confirmed</em>!</h2>
              <p className="text-white/50 mb-10 max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="text-white font-medium">{guestName.split(' ')[0]}</span>! Your reservation has been recorded. We'll send a confirmation to <span className="text-yellow-400">{email}</span>.
              </p>

              <div className="bg-white/[0.04] rounded-3xl border border-white/10 p-8 mb-10 text-left">
                <div className="text-center mb-6 pb-6 border-b border-white/10">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block mb-2">Booking Reference</span>
                  <span className="font-mono text-3xl font-bold text-yellow-400 tracking-wider">{bookingRef}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block mb-1">Check-in</span>
                    <span className="text-white font-medium">{new Date(checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block mb-1">Check-out</span>
                    <span className="text-white font-medium">{new Date(checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block mb-1">Guest</span>
                    <span className="text-white font-medium">{guestName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block mb-1">Rooms</span>
                    <span className="text-white font-medium">{selectedRooms.map(sr => `${sr.quantity}× ${sr.room.title}`).join(', ')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
                  <span className="text-white/40 font-bold text-sm">{paymentType === 'deposit' ? 'Paid (50% Deposit)' : 'Total Paid'}</span>
                  <span className="text-yellow-400 font-bold text-xl font-serif">₱{(paymentType === 'deposit' ? calculateTotal() / 2 : calculateTotal()).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="bg-yellow-500 hover:bg-yellow-400 text-[#0A2540] px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-yellow-500/20"
              >
                Return to Homepage
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
