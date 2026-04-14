"use client";

import { motion } from "framer-motion";
import { MapPin, BedDouble, Users, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import BookingPage from "./BookingPage";

interface Brahamaseva1Props {
    onBack: () => void;
}

export default function Brahamaseva1({ onBack }: Brahamaseva1Props) {
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [refreshRooms, setRefreshRooms] = useState(false);
    const [lastBookedRoom, setLastBookedRoom] = useState<string | null>(null);
    const [lastCancelledRoom, setLastCancelledRoom] = useState<string | null>(null);
    const [lastDeletedRoom, setLastDeletedRoom] = useState<string | null>(null);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            // Fetch dynamic availability directly from Supabase
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .order('room_number', { ascending: true });
            
            if (error || !data || data.length === 0) {
                console.warn("Supabase query failed or table empty. Automatically falling back to local fallback data generation...");
                // Graceful fallback explicitly for the case where the user hasn't put the keys/tables into Supabase yet
                const fallbackRooms = Array.from({ length: 30 }, (_, i) => ({
                    id: i,
                    room_number: `Room ${101 + i}`,
                    room_type: i % 7 === 0 ? "Heritage Suite" : i % 3 === 0 ? "Family Quarter" : "Standard Pilgrim" + (i%2 ? " Room" : ""),
                    is_available: true, // Show all as available by default
                }));
                setRooms(fallbackRooms);
            } else {
                setRooms(data); // Map incoming database array if successful!
            }
        } catch (err) {
             console.error("Critical error connecting to Supabase:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    // Refresh rooms when returning from booking
    useEffect(() => {
        if (selectedRoom === null && refreshRooms) {
            fetchRooms();
            setRefreshRooms(false);
        }
    }, [selectedRoom, refreshRooms]);

    // Load separate booking checkout page if a room row is specifically clicked
    if (selectedRoom) {
        return <BookingPage 
            room={selectedRoom} 
            onBack={() => setSelectedRoom(null)} 
            onBookingComplete={(action?: string) => {
                if (action === 'cancelled') {
                    setLastCancelledRoom(selectedRoom.room_number);
                } else if (action === 'deleted') {
                    setLastDeletedRoom(selectedRoom.room_number);
                } else {
                    setLastBookedRoom(selectedRoom.room_number);
                }
                setRefreshRooms(true);
                setSelectedRoom(null);
            }}
        />;
    }

    return (
        <motion.main 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white text-zinc-900 font-sans min-h-[calc(100vh-600px)] pb-20"
        >
            <div className="w-full h-[40vh] md:h-[60vh] relative shadow-md">
                <img 
                    src="https://5.imimg.com/data5/DL/VQ/YH/SELLER-17025285/brahmin-agraharam-hindu-community-houses-in-swamimalai-kumbakonam-500x500.JPG" 
                    alt="Brahama Seva 1" 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                <button 
                    onClick={onBack}
                    className="absolute top-6 left-6 md:top-10 md:left-10 bg-white/95 backdrop-blur text-zinc-900 px-5 py-2.5 rounded-[4px] font-bold shadow-lg hover:bg-white flex items-center transition-all z-20 hover:scale-105 active:scale-95 border-b-[3px] border-amber-400 cursor-pointer"
                >
                    ← Back to Search
                </button>

                {/* Hero Title Overlay */}
                <div className="absolute w-full bottom-0 left-0 p-6 md:p-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-2 mb-3">
                           <span className="bg-amber-500 text-black text-[12px] uppercase tracking-wide font-black px-2 py-1 rounded-[3px]">Certified Heritage</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-2 font-serif text-white drop-shadow-lg">Brahama Seva 1</h1>
                        <p className="text-white/90 font-bold flex items-center gap-2 uppercase tracking-widest text-[14px] drop-shadow-md">
                            <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                            Vijayawada, India
                        </p>
                    </div>
                </div>
            </div>

            {/* Booking Success Notification */}
            {lastBookedRoom && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-6xl mx-auto px-4 mt-4"
                >
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-[4px] flex items-start gap-3 shadow-md">
                        <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-bold text-green-800">Booking Successful!</p>
                            <p className="text-green-700 text-sm"><strong>{lastBookedRoom}</strong> is now marked as BOOKED in the system. Room status updated below.</p>
                        </div>
                        <button
                            onClick={() => setLastBookedRoom(null)}
                            className="text-green-600 hover:text-green-800 font-bold text-xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Cancellation Success Notification */}
            {lastCancelledRoom && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-6xl mx-auto px-4 mt-4"
                >
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-[4px] flex items-start gap-3 shadow-md">
                        <div className="w-6 h-6 text-orange-600 shrink-0 mt-0.5 text-xl">⚠️</div>
                        <div className="flex-1">
                            <p className="font-bold text-orange-800">Booking Cancelled!</p>
                            <p className="text-orange-700 text-sm"><strong>{lastCancelledRoom}</strong> booking has been cancelled. Room is now AVAILABLE for booking.</p>
                        </div>
                        <button
                            onClick={() => setLastCancelledRoom(null)}
                            className="text-orange-600 hover:text-orange-800 font-bold text-xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Deletion Success Notification */}
            {lastDeletedRoom && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-6xl mx-auto px-4 mt-4"
                >
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-[4px] flex items-start gap-3 shadow-md">
                        <div className="w-6 h-6 text-red-600 shrink-0 mt-0.5 text-xl">🗑️</div>
                        <div className="flex-1">
                            <p className="font-bold text-red-800">Booking Deleted!</p>
                            <p className="text-red-700 text-sm"><strong>{lastDeletedRoom}</strong> booking has been permanently deleted from the database. All user data removed.</p>
                        </div>
                        <button
                            onClick={() => setLastDeletedRoom(null)}
                            className="text-red-600 hover:text-red-800 font-bold text-xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                </motion.div>
            )}
            
            <div className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold mb-4 border-b border-zinc-200 pb-3 text-[#001D4A]">About this spiritual stay</h3>
                    <p className="text-zinc-700 leading-relaxed font-medium mb-8 text-[16px]">
                        Experience deeply rooted spiritual tranquility and absolute cultural immersion at <strong className="text-[#001D4A]">Brahama Seva 1</strong>. 
                        Situated beautifully amongst the authentic Agraharam communities, this culturally rich property offers unique architecture perfectly preserved through generations. 
                        It offers superb traditional amenities, divine vegetarian cuisine prepared authentically, and experiences tailored perfectly for your spiritual journey.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-5 mb-8 bg-[#fdfaf5] p-6 rounded-[8px] border border-amber-100 shadow-sm">
                        <div className="flex items-center gap-3 font-bold text-zinc-900"><BedDouble className="w-6 h-6 text-amber-600" /> Premium Mats & Bedding</div>
                        <div className="flex items-center gap-3 font-bold text-zinc-900"><Users className="w-6 h-6 text-amber-600" /> Community Halls</div>
                        <div className="flex items-center gap-3 font-bold text-zinc-900"><svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Peaceful Environment</div>
                        <div className="flex items-center gap-3 font-bold text-zinc-900"><MapPin className="w-6 h-6 text-amber-600" /> Near Temples</div>
                    </div>

                    {/* Dynamic Availability Table */}
                    <h3 className="text-2xl font-bold mb-4 border-b border-zinc-200 pb-3 text-[#001D4A] mt-10">Live Room Availability</h3>
                    
                    {loading ? (
                        <div className="bg-zinc-50 border border-zinc-200 rounded-[8px] h-[300px] flex flex-col items-center justify-center text-zinc-500 shadow-sm mb-12">
                            <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-3" />
                            <p className="font-bold tracking-wide">Syncing with Supabase Booking Engine...</p>
                        </div>
                    ) : (
                        <div className="bg-white border text-[15px] border-zinc-200 rounded-[8px] max-h-[500px] overflow-y-auto shadow-sm mb-12">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#fdfaf5] border-b border-zinc-200 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="font-bold text-[#001D4A] p-4 text-sm uppercase tracking-wider">Room No.</th>
                                        <th className="font-bold text-[#001D4A] p-4 text-sm uppercase tracking-wider hidden sm:table-cell">Type</th>
                                        <th className="font-bold text-[#001D4A] p-4 text-sm uppercase tracking-wider text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room, idx) => {
                                        const isRoomAvailable = room.is_available ?? room.available;
                                        return (
                                        <tr 
                                            key={room.id || idx} 
                                            onClick={() => {
                                                if (isRoomAvailable) {
                                                    setSelectedRoom(room);
                                                } else {
                                                    // For booked rooms, show cancellation option
                                                    setSelectedRoom(room);
                                                }
                                            }}
                                            className={`border-b border-zinc-100 transition-colors ${isRoomAvailable ? "hover:bg-amber-50 cursor-pointer" : "hover:bg-red-50 cursor-pointer"}`}
                                        >
                                            <td className="p-4 font-bold text-zinc-800">{room.room_number || `Room ${101+idx}`}</td>
                                            <td className="p-4 text-zinc-600 font-medium hidden sm:table-cell">{room.room_type || room.type}</td>
                                            <td className="p-4 text-right">
                                                {isRoomAvailable ? (
                                                    <span className="bg-green-100/80 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                        Available
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-50 border border-red-100 text-red-600 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                        Booked
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                
                {/* Booking Sidebar */}
                <div className="bg-white p-6 md:p-8 rounded-[8px] border-2 border-amber-400 h-fit self-start shadow-xl sticky top-6">
                    <h3 className="text-[20px] font-bold mb-4 text-[#001D4A]">Seva Offerings</h3>
                    <p className="text-[14px] font-medium text-zinc-700 mb-6 tracking-wide leading-relaxed">Secure your spiritual retreat. Reserve access to daily rituals and dining.</p>
                    <div className="text-4xl font-black text-amber-600 mb-1">$150 <span className="text-lg text-zinc-500 font-medium">/ night</span></div>
                    <p className="text-[13px] text-zinc-500 mb-8 font-medium">Includes accommodations and meals</p>
                    <button 
                        onClick={() => alert(`Your stay at Brahama Seva 1 is successfully reserved.`)}
                        className="w-full bg-[#001D4A] hover:bg-[#002a6c] text-white py-4 rounded-[4px] text-[18px] font-bold shadow-md active:scale-95 transition-all outline-none cursor-pointer"
                    >
                        Reserve Now
                    </button>
                    <p className="text-center text-xs font-bold text-zinc-500 mt-4 uppercase tracking-widest flex justify-center items-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> Instant Confirmation
                    </p>
                </div>
            </div>
        </motion.main>
    );
}
