"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { LogOut, Mail, ChevronLeft, Calendar, Key, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isHandlingCancel, setIsHandlingCancel] = useState(false);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      
      const { data: userBookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("email", session.user.email)
        .order("created_at", { ascending: false });
        
      if (userBookings) {
        setBookings(userBookings);
      }
      
      setIsLoading(false);
    };

    fetchUserAndBookings();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCancelBooking = async (bookingId: number, roomId: number) => {
    if (!confirm("Are you sure you want to cancel and permanently delete this reservation?")) return;
    
    setIsHandlingCancel(true);
    try {
      const { error: deleteError } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);

      if (deleteError) {
         alert("Could not delete the booking.");
      } else {
         if (roomId) {
            await supabase.from("rooms").update({ is_available: true }).eq("id", roomId);
         }
         // update local state to completely remove the cancelled booking from UI visually
         setBookings(prev => prev.filter(b => b.id !== bookingId));
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsHandlingCancel(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-8 h-8 border-4 border-[#003B95]/30 border-t-[#003B95] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] bg-zinc-50 py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => router.push('/Home')} 
            className="flex items-center gap-2 text-zinc-500 hover:text-[#003B95] font-bold mb-6 transition-colors active:scale-95 w-fit"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Home
          </button>

          {/* Header section */}
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-zinc-200 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10"
            >
              <div className="w-24 h-24 bg-[#003B95] rounded-full flex items-center justify-center text-white text-3xl font-serif">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "L"}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-serif text-[#002C6A] mb-2">
                  {user?.user_metadata?.full_name || "Lumina Member"}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-500 mb-4">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded text-sm font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          </div>

          {/* Real Bookings Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-[#002C6A] mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-amber-500" />
                Your Active Reservations
            </h2>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-zinc-200">
                    <p className="text-zinc-500 mb-4">You have no active or upcoming bookings.</p>
                    <button onClick={() => router.push('/Home')} className="text-[#003B95] font-bold hover:underline">Explore properties &rarr;</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                        <motion.div key={booking.id || booking.created_at} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-green-100/50 text-green-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg border-b border-l border-green-200">
                                {booking.booking_status || "Confirmed"}
                            </div>
                            <h3 className="text-lg font-bold text-[#001D4A] mb-1">{booking.room_number || "Reserved Room"}</h3>
                            <p className="text-sm text-zinc-500 mb-4 flex items-center gap-1"><Key className="w-3 h-3"/> Checked Under: {booking.first_name} {booking.last_name}</p>
                            
                            <div className="bg-zinc-50 p-3 rounded border border-zinc-100 mb-4 flex justify-between">
                                <div>
                                    <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Check-In</p>
                                    <p className="text-sm font-medium">{booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Total</p>
                                    <p className="text-sm font-bold text-[#003B95]">${booking.total_price}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleCancelBooking(booking.id, booking.room_id)}
                                disabled={isHandlingCancel}
                                className="w-full text-xs font-bold uppercase tracking-widest py-2.5 border border-red-200 text-red-600 rounded flex justify-center items-center gap-2 hover:bg-red-50 disabled:opacity-50 transition-all active:scale-[0.98]"
                            >
                                {isHandlingCancel ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel & Delete Reservation"}
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
