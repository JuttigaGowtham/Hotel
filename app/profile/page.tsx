"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { LogOut, Mail, Calendar, CreditCard } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingCancelled, setIsBookingCancelled] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      setIsLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCancelBooking = async () => {
    if (confirm("Are you sure you want to cancel your booking?")) {
      try {
        // Step 1: Find the booking to get the room_id
        const { data: userBookings, error: fetchError } = await supabase
          .from("bookings")
          .select("room_id")
          .eq("email", user?.email);

        if (fetchError) {
          console.warn("Error fetching booking details:", fetchError.message || fetchError);
        }

        if (userBookings && userBookings.length > 0) {
          const roomId = userBookings[0].room_id;
          
          // Step 2: Permanently delete the booking
          const { error: deleteError } = await supabase
            .from("bookings")
            .delete()
            .eq("email", user?.email);

          if (deleteError) {
             console.warn("Delete warning:", deleteError.message || deleteError);
             alert("Could not fully delete the booking. Marking cancelled locally.");
          }

          // Step 3: Make the room available (true) in the rooms table
          if (roomId) {
            const { error: roomError } = await supabase
              .from("rooms")
              .update({ is_available: true })
              .eq("id", roomId);
              
            if (roomError) {
              console.warn("Room availability update warning:", roomError.message || roomError);
            }
          }
        } else {
          // If no booking found, it was just a mocked booking anyway
          console.warn("No active booking found in Supabase for this user email.");
        }
        
        setIsBookingCancelled(true);
      } catch (e: any) {
        console.warn("Exception during cancellation:", e?.message || e);
        setIsBookingCancelled(true);
      }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-zinc-200"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                Recent Booking
              </h2>
              <div className="p-4 border border-zinc-100 rounded bg-zinc-50/50">
                {isBookingCancelled ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <p className="text-red-600 font-bold mb-1">Booking Cancelled</p>
                    <p className="text-sm text-zinc-500">Your reservation for Brahama Seva 1 has been cancelled successfully.</p>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-zinc-500 mb-1">Upcoming Stay</p>
                      <p className="font-bold text-[#003B95]">Brahama Seva 1</p>
                      <p className="text-sm text-zinc-600 mt-2">Check-in: Nov 25 • 2 Guests</p>
                    </div>
                    <button 
                      onClick={handleCancelBooking}
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50 active:scale-95 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-zinc-200"
            >
              
              
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
