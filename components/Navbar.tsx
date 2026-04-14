"use client";

import { Menu, X, ChevronDown, Check, Globe, MapPin } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
    // Nav States
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Custom Dropdown States
    const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

    // Data
    const [location, setLocation] = useState("vijaywada");
    const { language, setLanguage, t } = useLanguage();

    const locations = [
        { id: "vijaywada", name: "Vijaywada" },
        { id: "arunachalam", name: "Arunachalam" },
        { id: "tirupathi", name: "Tirupathi" }
    ];

    const languages = [
        { id: "en", name: "English" },
        { id: "te", name: "Telugu" },
        { id: "hi", name: "Hindi" }
    ];

    // Helpers
    const handleLocSelect = (id: string) => {
        setLocation(id);
        setIsLocDropdownOpen(false);
    };

    const handleLangSelect = (id: string) => {
        setLanguage(id as any);
        setIsLangDropdownOpen(false);
    };

    return (
        <nav className="w-full relative z-50 px-4 md:px-6 py-4 flex justify-between items-center text-white bg-[#003B95] shadow-md">
            {/* Custom Location Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => { setIsLocDropdownOpen(!isLocDropdownOpen); setIsLangDropdownOpen(false); isMobileMenuOpen && setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-[22px] md:text-2xl font-serif tracking-widest uppercase hover:text-amber-400 transition-colors"
                >
                    <MapPin className="w-5 h-5 hidden md:block" />
                    {locations.find(l => l.id === location)?.name}
                    <ChevronDown className="w-5 h-5" />
                </button>

                <AnimatePresence>
                    {isLocDropdownOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-4 w-56 bg-white rounded shadow-xl border border-zinc-200 overflow-hidden text-zinc-900"
                        >
                            {locations.map(loc => (
                                <button
                                    key={loc.id}
                                    onClick={() => handleLocSelect(loc.id)}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-50 border-b border-zinc-100 last:border-0 text-[13px] font-bold uppercase tracking-wider text-left transition-colors"
                                >
                                    {loc.name}
                                    {location === loc.id && <Check className="w-4 h-4 text-[#0071C2]" />}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Nav Links - Desktop */}
            <div className="hidden lg:flex items-center gap-10 text-[13px] uppercase tracking-widest font-bold">
                <a href="#" className="hover:text-amber-400 transition-colors">{t("Locations") || "Locations"}</a>
                <a href="#" className="hover:text-amber-400 transition-colors">{t("Rooms") || "Rooms"}</a>
                <Link href="/profile" className="hover:text-amber-400 transition-colors">{t("Profile") || "Profile"}</Link>
                <a href="#" className="hover:text-amber-400 transition-colors">{t("contact") || "Contact"}</a>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                {/* Custom Language Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => { setIsLangDropdownOpen(!isLangDropdownOpen); setIsLocDropdownOpen(false); isMobileMenuOpen && setIsMobileMenuOpen(false); }}
                        className="flex items-center justify-center gap-2 border border-white/40 hover:border-white px-3 md:px-5 py-[6px] md:py-2 text-[12px] md:text-sm uppercase tracking-widest font-bold transition-all rounded-[4px]"
                    >
                        <Globe className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden md:inline">{languages.find(l => l.id === language)?.name}</span>
                    </button>

                    <AnimatePresence>
                        {isLangDropdownOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full right-0 mt-4 w-40 bg-white rounded shadow-xl border border-zinc-200 overflow-hidden text-zinc-900"
                            >
                                {languages.map(lan => (
                                    <button
                                        key={lan.id}
                                        onClick={() => handleLangSelect(lan.id)}
                                        className="w-full flex items-center justify-between text-left px-4 py-3 hover:bg-[#0071C2]/10 border-b border-zinc-100 last:border-0 text-[13px] font-bold uppercase transition-colors"
                                    >
                                        <span className={language === lan.id ? "text-[#003B95]" : "text-zinc-600"}>{lan.name}</span>
                                        {language === lan.id && <Check className="w-4 h-4 text-[#003B95]" />}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Menu Hamburger */}
                <button 
                    onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsLocDropdownOpen(false); setIsLangDropdownOpen(false); }}
                    className="lg:hidden p-2 text-white hover:text-amber-400 transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
            </div>

            {/* Mobile Dropdown Menu (Nav Links) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-0 w-full bg-[#002C6A] border-t border-white/10 lg:hidden overflow-hidden shadow-xl"
                    >
                        <div className="flex flex-col px-6 py-4">
                            <a href="#" className="text-white hover:text-amber-400 text-[14px] font-bold uppercase tracking-wider py-4 border-b border-white/10 transition-colors">{t("Locations") || "Locations"}</a>
                            <a href="#" className="text-white hover:text-amber-400 text-[14px] font-bold uppercase tracking-wider py-4 border-b border-white/10 transition-colors">{t("Rooms") || "Rooms"}</a>
                            <Link href="/profile" className="text-white hover:text-amber-400 text-[14px] font-bold uppercase tracking-wider py-4 border-b border-white/10 transition-colors">{t("Profile") || "Profile"}</Link>
                            <a href="#" className="text-white hover:text-amber-400 text-[14px] font-bold uppercase tracking-wider py-4 transition-colors">{t("contact") || "Contact"}</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
