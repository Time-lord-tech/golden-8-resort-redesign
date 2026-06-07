import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';

export default function AccommodationsView() {
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
