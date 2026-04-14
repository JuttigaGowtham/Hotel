"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (error) {
        alert(error.message);
      } else {
        alert("Signup successful! Please log in.");
        router.push("/login");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred during sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-zinc-50 relative">
      {/* Absolute Back Button */}
      <div className="absolute top-6 left-6 md:right-6 md:left-auto z-50">
        <Link href="/">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-black/5 backdrop-blur-md border border-black/10 md:bg-white/10 md:border-white/20 rounded-full text-zinc-800 md:text-white cursor-pointer hover:bg-black/10 md:hover:bg-white/20 transition-all shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wider uppercase">Return</span>
          </motion.div>
        </Link>
      </div>

      {/* Left Column: Form (Flipped order for variety) */}
      <div className="flex items-center justify-center p-6 md:p-8 lg:p-24 bg-white order-2 md:order-1">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-serif text-[#002C6A] mb-2 uppercase tracking-wide">Create Account</h2>
            <p className="text-zinc-500 mb-10">Join Lumina to unlock exclusive stays and perks.</p>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-md outline-none focus:border-[#003B95] focus:ring-1 focus:ring-[#003B95] transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-md outline-none focus:border-[#003B95] focus:ring-1 focus:ring-[#003B95] transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-md outline-none focus:border-[#003B95] focus:ring-1 focus:ring-[#003B95] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-[#003B95] text-white rounded-md font-bold uppercase tracking-widest text-sm hover:bg-[#002C6A] transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-[#003B95]/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="mt-8 text-center text-zinc-500 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#003B95] font-bold hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Visual/Brand */}
      <div className="hidden md:flex flex-col justify-between bg-[#002C6A] text-white p-12 lg:p-24 relative overflow-hidden order-1 md:order-2">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/10 blur-[120px]" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl lg:text-5xl font-light tracking-[0.1em] mb-6 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              "Exceptional service<br /> starts with a single step."
            </h1>
            <div className="w-16 h-[2px] bg-amber-400 mb-8" />
            <p className="text-lg lg:text-xl font-light tracking-wide leading-relaxed text-zinc-300">
              Create an account to manage your reservations, receive dedicated support, and explore member-only retreats.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
              <span className="font-serif text-xl text-amber-400">L</span>
            </div>
            <div>
              <p className="text-sm tracking-widest uppercase font-bold text-white">Lumina Reserve</p>
              <p className="text-xs text-white/60">Membership Program</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
