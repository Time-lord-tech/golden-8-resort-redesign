import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { XCircle } from 'lucide-react';

type Room = {
  id: string;
  title: string;
  price: number;
  available_rooms: number;
  total_rooms: number;
  pax: string;
};

type WalkInBookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function WalkInBookingModal({ isOpen, onClose, onSuccess }: WalkInBookingModalProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [roomNumber, setRoomNumber] = useState<string>('auto');
  const [guestsCount, setGuestsCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Payment Fields
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash' | 'card' | 'bank_transfer'>('cash');
  const [paymentStatus, setPaymentStatus] = useState<'full' | 'deposit'>('full');
  const [customDeposit, setCustomDeposit] = useState('');
  const [gcashRef, setGcashRef] = useState('');
  
  // Card Details Fields
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Bank Transfer Fields
  const [bankName, setBankName] = useState('');
  const [bankRefNo, setBankRefNo] = useState('');

  const [bookingStatus, setBookingStatus] = useState<'checked_in' | 'reserved'>('checked_in');
  const [allBookings, setAllBookings] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchRooms();
    }
  }, [isOpen, checkIn, checkOut]);

  // Reset room number when stays change
  useEffect(() => {
    setRoomNumber('auto');
  }, [selectedRoomId, checkIn, checkOut]);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    // 1. Fetch rooms
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('id, title, price, total_rooms, pax')
      .order('price', { ascending: true });
      
    if (roomError || !roomData) {
      setLoadingRooms(false);
      return;
    }

    // 2. Fetch overlapping active bookings (including special_requests to check room assignment)
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('room_id, check_in, check_out, room_quantity, special_requests')
      .neq('status', 'cancelled');

    if (bookingData) {
      setAllBookings(bookingData);
    }

    let calculatedRooms = roomData.map((room: any) => {
      const totalRooms = room.total_rooms || 10;
      
      if (!checkIn || !checkOut || bookingError || !bookingData) {
        return {
          id: room.id,
          title: room.title,
          price: room.price,
          available_rooms: totalRooms,
          total_rooms: totalRooms,
          pax: room.pax
        };
      }

      // Generate date array for checkout range
      const targetStart = new Date(checkIn);
      const targetEnd = new Date(checkOut);
      const targetNights = Math.max(1, Math.ceil((targetEnd.getTime() - targetStart.getTime()) / (1000 * 60 * 60 * 24)));
      
      let maxBooked = 0;
      for (let i = 0; i < targetNights; i++) {
        const currentDay = new Date(targetStart);
        currentDay.setDate(currentDay.getDate() + i);
        const currentTime = currentDay.getTime();

        // Count rooms booked on this day
        let bookedOnDay = 0;
        bookingData.forEach((b: any) => {
          if (b.room_id !== room.id) return;
          const bStart = new Date(b.check_in).getTime();
          const bEnd = new Date(b.check_out).getTime();
          if (bStart <= currentTime && bEnd > currentTime) {
            bookedOnDay += b.room_quantity || 1;
          }
        });
        if (bookedOnDay > maxBooked) {
          maxBooked = bookedOnDay;
        }
      }

      const available = Math.max(0, totalRooms - maxBooked);
      return {
        id: room.id,
        title: room.title,
        price: room.price,
        available_rooms: available,
        total_rooms: totalRooms,
        pax: room.pax
      };
    });

    setRooms(calculatedRooms);
    if (calculatedRooms.length > 0) {
      const exists = calculatedRooms.find(r => r.id === selectedRoomId);
      if (!exists) setSelectedRoomId(calculatedRooms[0].id);
    }
    setLoadingRooms(false);
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  // Auto-capping and adjustment of Room Quantity and Guests Count based on room limits
  useEffect(() => {
    if (selectedRoom) {
      const maxQty = selectedRoom.available_rooms || 1;
      if (roomQuantity > maxQty) {
        setRoomQuantity(maxQty);
      }
      
      const maxPax = parseInt(selectedRoom.pax.match(/\d+$/)?.[0] || selectedRoom.pax.match(/\d+/)?.[0] || '4');
      const totalCapacity = maxPax * roomQuantity;
      if (guestsCount > totalCapacity) {
        setGuestsCount(totalCapacity);
      }
    }
  }, [selectedRoomId, roomQuantity, selectedRoom]);

  if (!isOpen) return null;

  const roomPrice = selectedRoom?.price || 0;

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const totalPrice = roomPrice * roomQuantity * nights;

  // Calculate default deposit or balance
  const dueNow = paymentStatus === 'full' ? totalPrice : (customDeposit ? Number(customDeposit) : totalPrice / 2);
  const balanceDue = totalPrice - dueNow;

  const getAvailableRoomNumbers = () => {
    if (!selectedRoomId || !selectedRoom) return [];
    const total = selectedRoom.total_rooms || 10;
    const occupied = new Set<number>();
    
    const targetStart = new Date(checkIn).getTime();
    const targetEnd = new Date(checkOut).getTime();
    
    const overlapping = allBookings.filter(b => {
      if (b.room_id !== selectedRoomId) return false;
      const bStart = new Date(b.check_in).getTime();
      const bEnd = new Date(b.check_out).getTime();
      return bStart < targetEnd && bEnd > targetStart;
    });
    
    const autoAssignBookings: any[] = [];
    overlapping.forEach(b => {
      const match = b.special_requests?.match(/\[Room (\d+)\]/);
      if (match) {
        occupied.add(parseInt(match[1]));
      } else {
        autoAssignBookings.push(b);
      }
    });
    
    autoAssignBookings.forEach(() => {
      for (let i = 1; i <= total; i++) {
        if (!occupied.has(i)) {
          occupied.add(i);
          break;
        }
      }
    });
    
    const available = [];
    for (let i = 1; i <= total; i++) {
      if (!occupied.has(i)) {
        available.push(i);
      }
    }
    return available;
  };

  const handleNameChange = (val: string) => {
    const sanitized = val.replace(/[^a-zA-ZÀ-ÿ\s\-'.]/g, '');
    setGuestName(sanitized);
  };

  const handlePhoneChange = (val: string) => {
    const sanitized = val.replace(/[^0-9+\-() ]/g, '');
    setPhone(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) return alert('Please select a room.');
    
    // Validate Payment Fields
    if (paymentMethod === 'gcash' && (!gcashRef || gcashRef.length < 13)) {
      return alert('Please enter a valid 13-digit GCash Reference Number.');
    }
    if (paymentMethod === 'card') {
      if (!cardHolderName.trim()) return alert('Cardholder Name is required.');
      if (cardNumber.replace(/\s/g, '').length < 16) return alert('Please enter a valid 16-digit Card Number.');
      if (cardExpiry.length < 5) return alert('Please enter a valid Expiry Date (MM/YY).');
      if (cardCvv.length < 3) return alert('Please enter a valid CVV.');
    }
    if (paymentMethod === 'bank_transfer' && (!bankName || !bankRefNo.trim())) {
      return alert('Please select a bank and enter the Transaction Reference Number.');
    }

    setSubmitting(true);

    try {
      // 1. Create/Verify Guest
      let guestId = '';
      const guestEmail = email.trim() || `walkin-${Date.now()}@golden8resort.com`;
      
      const { data: existingGuest, error: guestFetchError } = await supabase
        .from('guests')
        .select('id')
        .eq('email', guestEmail)
        .maybeSingle();

      if (guestFetchError) throw guestFetchError;

      if (existingGuest) {
        guestId = existingGuest.id;
      } else {
        const newGuestId = crypto.randomUUID();
        const { error: guestInsertError } = await supabase
          .from('guests')
          .insert([{
            id: newGuestId,
            name: guestName.trim(),
            email: guestEmail,
            phone: phone.trim()
          }]);
        if (guestInsertError) throw guestInsertError;
        guestId = newGuestId;
      }

      // 2. Create Booking
      const bookingId = crypto.randomUUID();
      const ref = `G8-WI-${Date.now().toString(36).toUpperCase().slice(-5)}`;
      const finalSpecialRequests = roomNumber !== 'auto'
        ? `[Room ${roomNumber}] ${specialRequests}`.trim()
        : specialRequests;

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          id: bookingId,
          guest_id: guestId,
          room_id: selectedRoomId,
          check_in: checkIn,
          check_out: checkOut,
          guests_count: guestsCount,
          status: bookingStatus,
          reference_number: ref,
          booking_ref: ref,
          special_requests: finalSpecialRequests,
          room_quantity: roomQuantity
        }]);

      if (bookingError) throw bookingError;

      // 3. Create Payment record
      const paymentRef = paymentMethod === 'gcash' 
        ? gcashRef 
        : (paymentMethod === 'card' 
            ? `Cardholder: ${cardHolderName} | Card: **** **** **** ${cardNumber.slice(-4)}` 
            : (paymentMethod === 'bank_transfer' ? `Bank: ${bankName.toUpperCase()} | Ref: ${bankRefNo}` : 'Direct Cash'));

      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          id: crypto.randomUUID(),
          booking_id: bookingId,
          total_amount: totalPrice,
          deposit_paid: dueNow,
          balance_due: balanceDue,
          payment_type: paymentMethod,
          gcash_reference: paymentRef,
          receipt_url: ''
        }]);

      if (paymentError) throw paymentError;

      alert(`Success! Walk-In booking created. Reference: ${ref}`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to create walk-in booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-[#0A2540] border border-[#1a365d] rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 animate-[fadeIn_0.3s_ease_forwards]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#05101A] border-b border-[#1a365d] flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping"></span>
              New Walk-In Booking
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">Directly register and check-in guests at the front desk</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <XCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Guest Information Section */}
          <div className="bg-[#05101A]/50 p-5 rounded-2xl border border-[#1a365d] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">1. Guest details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={e => handleNameChange(e.target.value)}
                  className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm transition-all"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm transition-all"
                  placeholder="09123456789"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm transition-all"
                  placeholder="juan@example.com (optional)"
                />
              </div>
            </div>
          </div>

          {/* Stay & Room Details Section */}
          <div className="bg-[#05101A]/50 p-5 rounded-2xl border border-[#1a365d] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">2. Booking & Room details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Check-in Date *</label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Check-out Date *</label>
                <input
                  type="date"
                  required
                  value={checkOut}
                  min={checkIn}
                  onChange={e => setCheckOut(e.target.value)}
                  className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Select Room Type *</label>
                {loadingRooms ? (
                  <div className="text-slate-400 text-xs animate-pulse py-2">Loading rooms...</div>
                ) : (
                  <select
                    value={selectedRoomId}
                    onChange={e => setSelectedRoomId(e.target.value)}
                    className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.title} (₱{r.price.toLocaleString()}/night)
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Select Room Assignment *</label>
                <select
                  value={roomNumber}
                  onChange={e => {
                    const val = e.target.value;
                    setRoomNumber(val);
                    if (val !== 'auto') {
                      setRoomQuantity(1);
                    }
                  }}
                  className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm font-medium"
                >
                  <option value="auto">Auto-Assign (System Decides)</option>
                  {getAvailableRoomNumbers().map(num => (
                    <option key={num} value={num.toString()}>
                      Room {num} (Available)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 md:col-span-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Quantity * 
                    {roomNumber === 'auto' ? (
                      <span className="text-[9px] text-[#FBBF24] ml-1">({selectedRoom?.available_rooms || 0} avail)</span>
                    ) : (
                      <span className="text-[9px] text-slate-500 ml-1">(Locked to 1 for specific room)</span>
                    )}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    disabled={roomNumber !== 'auto'}
                    max={selectedRoom?.available_rooms || 1}
                    value={roomNumber !== 'auto' ? 1 : roomQuantity}
                    onChange={e => {
                      const maxVal = selectedRoom?.available_rooms || 1;
                      const val = Math.min(maxVal, Math.max(1, Number(e.target.value)));
                      setRoomQuantity(val);
                    }}
                    className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Guests Count *
                    <span className="text-[9px] text-[#FBBF24] ml-1">
                      (Max: {parseInt(selectedRoom?.pax.match(/\d+$/)?.[0] || selectedRoom?.pax.match(/\d+/)?.[0] || '4') * (roomNumber !== 'auto' ? 1 : roomQuantity)} pax)
                    </span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={parseInt(selectedRoom?.pax.match(/\d+$/)?.[0] || selectedRoom?.pax.match(/\d+/)?.[0] || '4') * (roomNumber !== 'auto' ? 1 : roomQuantity)}
                    value={guestsCount}
                    onChange={e => {
                      const maxPax = parseInt(selectedRoom?.pax.match(/\d+$/)?.[0] || selectedRoom?.pax.match(/\d+/)?.[0] || '4');
                      const maxCapacity = maxPax * (roomNumber !== 'auto' ? 1 : roomQuantity);
                      const val = Math.min(maxCapacity, Math.max(1, Number(e.target.value)));
                      setGuestsCount(val);
                    }}
                    className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Special Requests / Notes</label>
                <textarea
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm resize-none"
                  rows={2}
                  placeholder="E.g., early check-in, extra blanket, pool view request..."
                />
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="bg-[#05101A]/50 p-5 rounded-2xl border border-[#1a365d] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">3. Billing & Payment details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm"
                >
                  <option value="cash">Cash</option>
                  <option value="gcash">GCash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="card">Credit / Debit Card</option>
                </select>
              </div>

              {paymentMethod === 'gcash' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">GCash Reference No.</label>
                  <input
                    type="text"
                    maxLength={13}
                    value={gcashRef}
                    onChange={e => setGcashRef(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm font-mono"
                    placeholder="13-digit transaction ref"
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#05101A] p-4 rounded-xl border border-[#1a365d] mt-2">
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Cardholder Name *</label>
                    <input
                      type="text"
                      required
                      value={cardHolderName}
                      onChange={e => setCardHolderName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                      className="w-full bg-[#0A2540] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm"
                      placeholder="Juan Dela Cruz"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Card Number *</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '';
                        setCardNumber(v);
                      }}
                      className="w-full bg-[#0A2540] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm font-mono"
                      placeholder="1234 5678 1234 5678"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Expiry Date *</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={cardExpiry}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g, '');
                        if (v.length > 2) {
                          v = v.slice(0, 2) + '/' + v.slice(2, 4);
                        }
                        setCardExpiry(v);
                      }}
                      className="w-full bg-[#0A2540] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">CVV *</label>
                    <input
                      type="password"
                      required
                      maxLength={3}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#0A2540] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm font-mono"
                      placeholder="123"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#05101A] p-4 rounded-xl border border-[#1a365d] mt-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Bank Name *</label>
                    <select
                      value={bankName}
                      required
                      onChange={e => setBankName(e.target.value)}
                      className="w-full bg-[#0A2540] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm"
                    >
                      <option value="">Select Bank</option>
                      <option value="bdo">BDO Unibank</option>
                      <option value="bpi">BPI (Bank of the Philippine Islands)</option>
                      <option value="metrobank">Metrobank</option>
                      <option value="landbank">Landbank</option>
                      <option value="security_bank">Security Bank</option>
                      <option value="unionbank">UnionBank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Transaction Ref No. *</label>
                    <input
                      type="text"
                      required
                      value={bankRefNo}
                      onChange={e => setBankRefNo(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                      className="w-full bg-[#0A2540] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm font-mono"
                      placeholder="Bank Ref / Txn ID"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Payment Preference</label>
                <select
                  value={paymentStatus}
                  onChange={e => setPaymentStatus(e.target.value as any)}
                  className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm"
                >
                  <option value="full">Paid In Full</option>
                  <option value="deposit">Deposit / Partial Payment</option>
                </select>
              </div>

              {paymentStatus === 'deposit' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Custom Deposit Amount (₱)</label>
                  <input
                    type="number"
                    value={customDeposit}
                    onChange={e => setCustomDeposit(e.target.value)}
                    className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none text-sm"
                    placeholder={`Default: ₱${(totalPrice / 2).toLocaleString()}`}
                  />
                </div>
              )}
            </div>

            <div className="bg-[#05101A] p-4 rounded-xl border border-[#1a365d] mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Rate per night:</span>
                <span className="text-white font-medium">₱{roomPrice.toLocaleString()} × {roomQuantity} room(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total duration:</span>
                <span className="text-white font-medium">{nights} night(s)</span>
              </div>
              <div className="h-px bg-[#1a365d]/50 my-1"></div>
              <div className="flex justify-between text-base">
                <span className="font-bold text-white">Grand Total:</span>
                <span className="font-bold text-white">₱{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#FBBF24] font-bold">Collected Now:</span>
                <span className="text-[#FBBF24] font-bold">₱{dueNow.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-red-400">
                <span>Collect at Check-Out:</span>
                <span>₱{balanceDue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Booking Status Section */}
          <div className="bg-[#05101A]/50 p-5 rounded-2xl border border-[#1a365d] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#FBBF24] mb-1">4. Reservation action</h4>
              <p className="text-slate-400 text-xs">Choose whether the guest is physically arriving right now or checking in later</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBookingStatus('checked_in')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  bookingStatus === 'checked_in'
                    ? 'bg-blue-500 border-blue-600 text-white'
                    : 'bg-[#05101A] border-[#1a365d] text-slate-400 hover:text-white'
                }`}
              >
                Check In Immediately
              </button>
              <button
                type="button"
                onClick={() => setBookingStatus('reserved')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  bookingStatus === 'reserved'
                    ? 'bg-emerald-500 border-emerald-600 text-white'
                    : 'bg-[#05101A] border-[#1a365d] text-slate-400 hover:text-white'
                }`}
              >
                Save as Reserved
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#FBBF24] hover:bg-[#f59e0b] text-[#0A2540] font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-[#0A2540]/30 border-t-[#0A2540] rounded-full animate-spin"></div>
            ) : (
              'Confirm Front-Desk Booking'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
