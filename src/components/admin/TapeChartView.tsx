import { useState, useEffect, Fragment } from 'react';
import { supabase } from '../../lib/supabase';

export default function TapeChartView() {
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

  const bookingsWithRequests = bookings.filter(b => b.special_requests?.includes('[Room '));
  const bookingsWithoutRequests = bookings.filter(b => !b.special_requests?.includes('[Room '));

  const isOverlapping = (start1: number, end1: number, start2: number, end2: number) => {
    return start1 < end2 && end1 > start2;
  };

  // Pass 1: Assign requested rooms
  bookingsWithRequests.forEach(booking => {
    const match = booking.special_requests.match(/\[Room (\d+)\]/);
    if (!match) return;
    const requestedRoomNum = parseInt(match[1]);
    
    const bStart = new Date(booking.check_in).getTime();
    const bEnd = new Date(booking.check_out).getTime();

    const targetRow = physicalRows.find(
      pr => pr.id === booking.room_id && pr.index === requestedRoomNum
    );

    if (targetRow) {
      const hasConflict = rowAssignments[targetRow.rowId].some(existing => {
        const eStart = new Date(existing.check_in).getTime();
        const eEnd = new Date(existing.check_out).getTime();
        return isOverlapping(eStart, eEnd, bStart, bEnd);
      });

      if (!hasConflict) {
        rowAssignments[targetRow.rowId].push(booking);
        return;
      }
    }
    bookingsWithoutRequests.push(booking);
  });

  // Pass 2: Assign other bookings
  bookingsWithoutRequests.forEach(booking => {
    const qty = booking.room_quantity || 1;
    let assigned = 0;
    
    const bStart = new Date(booking.check_in).getTime();
    const bEnd = new Date(booking.check_out).getTime();

    const matchingRows = physicalRows.filter(pr => pr.id === booking.room_id);
    
    for (const pr of matchingRows) {
      if (assigned >= qty) break;
      
      const hasConflict = rowAssignments[pr.rowId].some(existing => {
        const eStart = new Date(existing.check_in).getTime();
        const eEnd = new Date(existing.check_out).getTime();
        return isOverlapping(eStart, eEnd, bStart, bEnd);
      });

      if (!hasConflict) {
        rowAssignments[pr.rowId].push(booking);
        assigned++;
      }
    }
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
