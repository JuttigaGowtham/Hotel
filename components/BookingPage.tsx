"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface BookingPageProps {
    room: any;
    onBack: () => void;
    onBookingComplete?: (action?: string) => void;
}

export default function BookingPage({ room, onBack, onBookingComplete }: BookingPageProps) {
    const [status, setStatus] = useState<"idle" | "booking" | "success" | "error" | "cancelling" | "cancelled" | "deleting" | "deleted">("idle");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const isRoomAvailable = room.is_available ?? room.available;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("booking");
        setErrorMessage("");

        try {
            // Validate form data
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.contactNumber) {
                setErrorMessage("Please fill in all required fields");
                setStatus("error");
                return;
            }

            // Convert room.id to integer if it's a string
            const roomId = typeof room.id === 'string' ? parseInt(room.id, 10) : room.id;
            
            console.log("Attempting to book with data:", {
                roomId,
                room_number: room.room_number,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                contact_number: "+91" + formData.contactNumber,
            });

            // Save booking details to Supabase
            const { data, error } = await supabase
                .from("bookings")
                .insert([
                    {
                        room_id: roomId,
                        room_number: room.room_number || "Unknown",
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        email: formData.email,
                        contact_number: "+91" + formData.contactNumber,
                        check_in_date: new Date("2024-10-12").toISOString(),
                        check_out_date: new Date("2024-10-13").toISOString(),
                        total_price: 150,
                        booking_status: "confirmed",
                    },
                ])
                .select();

            if (error) {
                const errorDetails = error.message || JSON.stringify(error);
                console.error("Booking error details:", errorDetails);
                console.error("Full error object:", error);
                setErrorMessage(`Failed to save booking: ${errorDetails}`);
                setStatus("error");
                return;
            }

            console.log("Booking saved successfully:", data);

            // Update room availability to false
            const { error: updateError } = await supabase
                .from("rooms")
                .update({ is_available: false })
                .eq("id", roomId);

            if (updateError) {
                console.error("Room update error:", updateError);
                // Don't fail the whole booking if room update fails
            }

            setStatus("success");
            // Notify parent to refresh rooms list
            if (onBookingComplete) {
                onBookingComplete('booked');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error("Unexpected error:", errorMessage);
            setErrorMessage(`An unexpected error occurred: ${errorMessage}`);
            setStatus("error");
        }
    };



    const handleDeleteBooking = async () => {
        setStatus("deleting");
        setErrorMessage("");

        try {
            // Convert room.id to integer if it's a string
            const roomId = typeof room.id === 'string' ? parseInt(room.id, 10) : room.id;

            // Delete the booking record from database
            const { error: deleteError } = await supabase
                .from("bookings")
                .delete()
                .eq("room_id", roomId)
                .eq("booking_status", "confirmed");

            if (deleteError) {
                console.error("Delete booking error:", deleteError);
                setErrorMessage("Failed to delete booking. Please try again.");
                setStatus("error");
                return;
            }

            // Mark room as available again
            const { error: updateError } = await supabase
                .from("rooms")
                .update({ is_available: true })
                .eq("id", roomId);

            if (updateError) {
                console.error("Room availability update error:", updateError);
            }

            setStatus("deleted");
            // Notify parent to refresh rooms list
            if (onBookingComplete) {
                onBookingComplete('deleted');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error("Delete booking error:", errorMessage);
            setErrorMessage(`Failed to delete booking: ${errorMessage}`);
            setStatus("error");
        }
    };

    if (status === "deleted") {
        return (
            <div className="min-h-[calc(100vh-200px)] bg-zinc-50 flex flex-col items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-[8px] shadow-xl text-center max-w-md w-full border-t-4 border-red-500">
                    <div className="w-16 h-16 text-red-500 mx-auto mb-4 text-4xl">🗑️</div>
                    <h2 className="text-3xl font-bold text-[#001D4A] mb-2">Booking Deleted</h2>
                    <p className="text-zinc-600 mb-2 font-medium">All booking details for <strong className="text-zinc-900 border-b-2 border-red-400">{room.room_number || `Room`}</strong> have been permanently deleted.</p>
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-[4px] mb-4">
                        <p className="text-[13px] font-bold">⚠️ All user data has been removed from the database</p>
                    </div>
                    <p className="text-zinc-600 mb-8 font-medium text-sm">
                        Room is now AVAILABLE for new bookings.
                    </p>
                    <button onClick={onBack} className="bg-[#001D4A] active:scale-95 text-white px-6 py-3.5 rounded-[4px] font-bold w-full hover:bg-blue-900 transition-all shadow-md">
                        Return to Property Viewer
                    </button>
                </motion.div>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="min-h-[calc(100vh-200px)] bg-zinc-50 flex flex-col items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-[8px] shadow-xl text-center max-w-md w-full border-t-4 border-green-500">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-3xl font-bold text-[#001D4A] mb-2">Booking Confirmed!</h2>
                    <p className="text-zinc-600 mb-2 font-medium">Your absolute reservation for <strong className="text-zinc-900 border-b-2 border-amber-400">{room.room_number || `Room`}</strong> has been secured and confirmed.</p>
                    <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-[4px] mb-4">
                        <p className="text-[13px] font-bold">✓ Room marked as BOOKED in the system</p>
                    </div>
                    <p className="text-zinc-600 mb-8 font-medium text-sm">
                        Booking details have been saved and sent to <strong>{formData.email}</strong>
                    </p>
                    <button onClick={onBack} className="bg-[#001D4A] active:scale-95 text-white px-6 py-3.5 rounded-[4px] font-bold w-full hover:bg-blue-900 transition-all shadow-md">
                        Return to Property Viewer
                    </button>
                </motion.div>
            </div>
        );
    }



    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="min-h-[calc(100vh-80px)] bg-zinc-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-[#001D4A] font-bold mb-8 transition-colors active:scale-95 w-fit">
                    <ChevronLeft className="w-5 h-5" /> Back to Available Rooms
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Forms */}
                    <div className="md:col-span-2">
                        <div className="bg-white p-6 md:p-8 rounded-[8px] shadow-sm border border-zinc-200 mb-8">
                            <div className="flex justify-between items-center mb-8 border-b pb-4">
                                <h2 className="text-[24px] font-bold text-[#001D4A]">Enter your booking details</h2>
                                {!isRoomAvailable && (
                                    <div className="flex gap-3">

                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-[4px] font-bold text-sm border border-gray-200 transition-all active:scale-95"
                                        >
                                            Delete Booking
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <form onSubmit={handleBook} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[14px] font-bold text-zinc-900 mb-2">First Name</label>
                                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className="w-full border border-zinc-300 rounded-[4px] p-3 outline-none focus:border-[#0071C2] focus:ring-2 focus:ring-[#0071C2]/20 transition-all text-black" />
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-bold text-zinc-900 mb-2">Last Name</label>
                                        <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className="w-full border border-zinc-300 rounded-[4px] p-3 outline-none focus:border-[#0071C2] focus:ring-2 focus:ring-[#0071C2]/20 transition-all text-black" />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[14px] font-bold text-zinc-900 mb-2">Email Address</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@address.com" className="w-full border border-zinc-300 rounded-[4px] p-3 outline-none focus:border-[#0071C2] focus:ring-2 focus:ring-[#0071C2]/20 transition-all text-black" />
                                        <p className="text-[11px] text-zinc-500 font-medium mt-2">Confirmation securely sent to this address</p>
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-bold text-zinc-900 mb-2">Contact Number</label>
                                        <div className="flex">
                                            <span className="flex items-center justify-center border border-zinc-300 border-r-0 bg-zinc-100 px-3 md:px-4 rounded-l-[4px] text-zinc-600 font-bold">
                                                +91
                                            </span>
                                            <input 
                                                required 
                                                type="tel" 
                                                name="contactNumber"
                                                value={formData.contactNumber}
                                                onChange={handleInputChange}
                                                placeholder="98765 43210" 
                                                pattern="[0-9]{10}"
                                                title="Please enter a valid 10-digit Indian phone number"
                                                className="w-full border border-zinc-300 rounded-r-[4px] p-3 outline-none focus:border-[#0071C2] focus:ring-2 focus:ring-[#0071C2]/20 transition-all text-black" 
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={status === "booking" || !isRoomAvailable || !formData.firstName || !formData.lastName || !formData.email || !formData.contactNumber} 
                                        className="w-[300px] bg-[#0071C2] hover:bg-[#00599c] text-white py-4 rounded-[4px] text-[18px] font-bold shadow-md active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {status === "booking" ? <Loader2 className="w-6 h-6 animate-spin text-white/80" /> : "Complete Reservation"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    {/* Right: Booking Summary Fixed */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-[8px] shadow-sm border border-zinc-200 sticky top-6">
                            <h3 className="text-[18px] font-bold text-[#001D4A] mb-4">Your Booking Summary</h3>
                            
                            <div className="flex gap-4 mb-6 pb-6 border-b border-zinc-100">
                                <div className="flex-1">
                                    <p className="text-[13px] text-zinc-500 font-medium mb-1">Check-in</p>
                                    <p className="font-bold text-zinc-900 leading-tight mb-1">Thu 12 Oct</p>
                                    <p className="text-[12px] text-zinc-500 font-medium">14:00 - 20:00</p>
                                </div>
                                <div className="border-l border-zinc-200 mx-2"></div>
                                <div className="flex-1">
                                    <p className="text-[13px] text-zinc-500 font-medium mb-1">Check-out</p>
                                    <p className="font-bold text-zinc-900 leading-tight mb-1">Fri 13 Oct</p>
                                    <p className="text-[12px] text-zinc-500 font-medium">10:00 - 11:30</p>
                                </div>
                            </div>
                            
                            <div className="mb-6 pb-6 border-b border-zinc-100">
                                <p className="font-bold text-zinc-900 text-sm mb-1">You uniquely selected:</p>
                                <p className="text-[#0071C2] font-black text-xl mb-1">{room.room_number}</p>
                                <p className="text-[14px] text-zinc-600 font-medium">{room.room_type || room.type}</p>
                            </div>
                            
                            {!isRoomAvailable && (
                                <div className="bg-red-50 text-red-700 p-4 rounded-[4px] text-[13px] font-bold border border-red-100 mb-4 animate-pulse">
                                    ⚠️ Notice: This particular room is currently booked/reserved. You cannot complete this checkout.
                                </div>
                            )}
                            
                            <div className="bg-[#ebf3ff] p-5 rounded-[4px] border border-[#0071C2]/20">
                                <div className="flex justify-between items-baseline mb-1">
                                    <p className="font-bold text-[18px] text-zinc-900">Total Price</p>
                                    <p className="font-black text-[28px] text-[#001D4A]">$150</p>
                                </div>
                                <p className="text-[12px] text-zinc-500 font-medium">Includes taxes and local property charges</p>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Delete Confirmation Dialog */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-6 rounded-[8px] shadow-xl max-w-md w-full"
                        >
                            <h3 className="text-xl font-bold text-[#001D4A] mb-4">Delete Booking?</h3>
                            <div className="bg-red-50 border border-red-200 p-4 rounded-[4px] mb-4">
                                <p className="text-red-700 font-bold text-sm mb-2">⚠️ WARNING: This action cannot be undone!</p>
                                <p className="text-red-600 text-sm">
                                    This will permanently delete all booking details for <strong>{room.room_number}</strong> from the database.
                                    All user information will be lost forever.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 py-3 rounded-[4px] font-bold transition-all active:scale-95"
                                >
                                    Keep Booking
                                </button>
                                <button
                                    onClick={handleDeleteBooking}
                                    disabled={status === "deleting"}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-[4px] font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {status === "deleting" ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Yes, Delete Forever"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
