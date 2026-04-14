"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        alert(error.message);
      } else {
        router.push("/Home");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-zinc-50 relative">
      {/* Absolute Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white cursor-pointer hover:bg-white/20 transition-all shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wider uppercase">Return</span>
          </motion.div>
        </Link>
      </div>

      {/* Left Column: Visual/Brand */}
      <div className="hidden md:flex flex-col justify-between bg-[#003B95] text-white p-12 lg:p-24 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#0071C2]/40 blur-[120px]" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl lg:text-7xl font-light tracking-[0.1em] uppercase mb-6" style={{ fontFamily: "Georgia, serif" }}>
              Lumina
            </h1>
            <div className="w-24 h-[2px] bg-amber-400 mb-8" />
            <p className="text-xl lg:text-2xl font-light tracking-wide leading-relaxed text-zinc-200">
              Welcome back to your refined escape. Access your personalized concierge and exclusive bookings.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <p className="text-sm tracking-widest uppercase text-white/50">
            © {new Date().getFullYear()} Lumina Hotels & Resorts
          </p>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-serif text-[#002C6A] mb-2 uppercase tracking-wide">Sign In</h2>
            <p className="text-zinc-500 mb-10">Enter your details to access your account.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-md outline-none focus:border-[#003B95] focus:ring-1 focus:ring-[#003B95] transition-all text-black"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Password</label>
                  <a href="#" className="text-xs font-medium text-[#0071C2] hover:text-[#003B95] transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-md outline-none focus:border-[#003B95] focus:ring-1 focus:ring-[#003B95] transition-all text-black"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#003B95] text-white rounded-md font-bold uppercase tracking-widest text-sm hover:bg-[#002C6A] transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-[#003B95]/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="mt-8 text-center text-zinc-500 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#003B95] font-bold hover:underline transition-all">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
