"use client";

import { useLanguage } from "./LanguageContext";
import { Mail, MapPin, Phone, Globe, Camera, MessageCircle } from "lucide-react";

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="w-full bg-[#001D4A] text-zinc-300 font-sans mt-auto border-t border-zinc-200">
            {/* Main Footer Links */}
            <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
                {/* Brand & Contact */}
                <div>
                    <h3 className="text-white text-2xl font-bold mb-6 tracking-tight">Lumina Bookings</h3>
                    <p className="text-sm leading-relaxed mb-6 font-medium opacity-90">
                        Experience the zenith of luxury and comfort tailored uniquely for you. Discover stays anywhere, anytime.
                    </p>
                    <div className="space-y-3 text-sm font-medium">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>123 Luxury Blvd, Horizon City</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>contact@luminabookings.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                    </div>
                </div>

                {/* Company Links */}
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t("explore") || "Company"}</h4>
                    <ul className="space-y-4 text-sm font-medium opacity-90">
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">About Us</a></li>
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Careers</a></li>
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Press Center</a></li>
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Investor Relations</a></li>
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Corporate Contact</a></li>
                    </ul>
                </div>

                {/* Help & Support */}
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Help</h4>
                    <ul className="space-y-4 text-sm font-medium opacity-90">
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Customer Service Help</a></li>
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Partner Help</a></li>
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Dispute Resolution</a></li>
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Safety Resource Center</a></li>
                    </ul>
                </div>

                {/* Discover */}
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Discover</h4>
                    <ul className="space-y-4 text-sm font-medium opacity-90">
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Countries</a></li>
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Regions</a></li>
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Cities</a></li>
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Hotels</a></li>
                        <li><a href="#" className="hover:text-amber-400 hover:underline transition-all">Flight Finder</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 bg-[#00173A]">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-4 text-center md:text-left">
                    <p className="text-xs font-medium">&copy; 2026 Lumina Bookings. All rights reserved.</p>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
                        <a href="#" className="hover:text-white transition-colors">{t("privacy") || "Privacy Policy"}</a>
                        <a href="#" className="hover:text-white transition-colors">{t("terms") || "Terms of Service"}</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-amber-400 transition-colors"><MessageCircle className="w-[18px] h-[18px]" /></a>
                        <a href="#" className="hover:text-amber-400 transition-colors"><Globe className="w-[18px] h-[18px]" /></a>
                        <a href="#" className="hover:text-amber-400 transition-colors"><Camera className="w-[18px] h-[18px]" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
