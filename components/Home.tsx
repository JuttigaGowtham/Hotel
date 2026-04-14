"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, BedDouble, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import Brahamaseva1 from "./Brahamaseva1";

export default function Home() {
    const { t } = useLanguage();

    // Search bar state management
    const [location, setLocation] = useState("vijaywada");
    const [hasSearched, setHasSearched] = useState(false);
    const [showBrahmaSeva, setShowBrahmaSeva] = useState(false);

    const locationHotels: Record<string, any[]> = {
        vijaywada: [
            { title: "Brahama Seva 1", price: "$150 / night", img: "https://5.imimg.com/data5/DL/VQ/YH/SELLER-17025285/brahmin-agraharam-hindu-community-houses-in-swamimalai-kumbakonam-500x500.JPG" },
            { title: "Brahama Seva 2", price: "$200 / night", img: "https://www.dakshinachitra.net/img/karnataka-house.jpg" },
            { title: "Brahama Seva 3", price: "$120 / night", img: "https://www.joinpaperplanes.com/wp-content/uploads/2023/11/Olappamanna-Mana-the-Namboodiri-Brahmin-Residence-in-Palakkad-Kerala-scaled.jpg" }
        ],
        arunachalam: [
            { title: "Bhrama seva", price: "$100 / night", img: "https://live.staticflickr.com/4161/34611794696_dec5a0a9a5_b.jpg" },
            { title: "Bhramin Seva Samithi", price: "$80 / night", img: "https://i.pinimg.com/736x/d5/79/3f/d5793f2a28ab8783a61e33cd78697bd7.jpg" },
            { title: "Bhramam Mattam", price: "$60 / night", img: "https://c8.alamy.com/comp/ET07K0/old-traditional-house-of-nambudiri-namboodiri-namboothiri-namputiri-ET07K0.jpg" }

        ],
        tirupathi: [
            { title: "Tirupati", price: "$180 / night", img: "https://i.pinimg.com/736x/19/b0/77/19b07704a3145b6298fe0e81c36329fa.jpg" },
            { title: "Marasa Sarovar ", price: "$140 / night", img: "https://paperquote.wordpress.com/wp-content/uploads/2017/09/20170921_174054.jpg?w=1440" },
            { title: "Bhramam Mattam Samithi", price: "$130 / night", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Varikkasseri_Nalukettu.jpg/330px-Varikkasseri_Nalukettu.jpg" }
        ]
    };

    if (showBrahmaSeva) {
        return <Brahamaseva1 onBack={() => setShowBrahmaSeva(false)} />;
    }

    return (
        <main className="w-full bg-white text-zinc-900 font-sans pb-4">
            {/* Hero Header Section */}
            <div className="text-white w-full pt-20 md:pt-32 pb-32 md:pb-48 px-4 relative flex flex-col justify-center overflow-hidden min-h-[400px] md:min-h-[650px]">
                <img
                    src="https://www.dakshinachitra.net/img/tamilnadu/brahmin-house/01-brahmin-house.jpg"
                    alt="Booking Cover"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ zIndex: 0 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 pointer-events-none" style={{ zIndex: 1 }} />
                <div className="max-w-6xl w-full mx-auto relative text-center md:text-left" style={{ zIndex: 10 }}>
                    <h1 className="text-3xl md:text-6xl font-bold mb-3 md:mb-4 drop-shadow-xl text-white leading-tight">Find your next stay</h1>
                    <p className="text-lg md:text-2xl font-medium text-white mb-6 md:mb-10 drop-shadow-lg">
                        Search low prices on hotels, homes and much more...
                    </p>
                </div>
            </div>

            {/* Floating Search Bar Array */}
            <div className="max-w-xl mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-amber-400 p-1 md:rounded-[4px] border-[3px] border-amber-400 flex flex-col md:flex-row gap-1 shadow-lg">
                    {/* Destination Input Wrapper */}
                    <div className="flex-1 bg-white p-3 flex items-center gap-3 rounded-[3px] text-zinc-800">
                        <MapPin className="w-6 h-6 text-zinc-400 shrink-0" />
                        <select
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value);
                                setHasSearched(true);
                            }}
                            className="w-full bg-transparent outline-none cursor-pointer appearance-none text-md font-bold text-zinc-800"
                        >
                            <option value="vijaywada">Vijaywada</option>
                            <option value="arunachalam">Arunachalam</option>
                            <option value="tirupathi">Tirupathi</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Default Quick Locations Grid (Displays before searching) */}
            {!hasSearched && (
                <section className="max-w-6xl mx-auto px-4 mt-20 mb-12">
                    <div className="mb-6">
                        <h2 className="text-[24px] md:text-[28px] font-bold mb-1">Explore Locations</h2>
                        <p className="text-zinc-500 font-medium text-sm md:text-base">Discover our premium properties across popular destinations.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.keys(locationHotels).map((locKey) => {
                            const firstHotel = locationHotels[locKey][0];
                            return (
                                <div
                                    key={locKey}
                                    onClick={() => {
                                        setLocation(locKey);
                                        setHasSearched(true);
                                    }}
                                    className="group cursor-pointer rounded-[8px] overflow-hidden shadow-md hover:shadow-xl transition-all border border-zinc-200"
                                >
                                    <div className="w-full aspect-[4/3] relative overflow-hidden bg-zinc-100">
                                        <img
                                            src={firstHotel.img}
                                            alt={locKey}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#001D4A]/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                                            <h3 className="text-white text-2xl font-bold capitalize drop-shadow-md tracking-tight mb-1">{locKey}</h3>
                                            <p className="text-amber-400 text-[13px] font-bold drop-shadow-md tracking-wide uppercase">{firstHotel.title} & More</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Trending Properties (Hotels in Location) */}
            {hasSearched && (
                <section className="max-w-6xl mx-auto px-4 mt-16">
                    <div className="mb-6">
                        <h2 className="text-[28px] font-bold mb-1">{t("hotelsIn")} {location}</h2>
                        <p className="text-zinc-500 font-medium">Most popular choices for travelers from India</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {locationHotels[location]?.map((room: any, index: number) => (
                            <div key={`${location}-${index}`} className="group cursor-pointer rounded overflow-hidden">
                                <div className="rounded-[8px] overflow-hidden mb-3 aspect-[4/3] bg-zinc-200">
                                    <img
                                        src={room.img}
                                        alt={room.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-zinc-900 text-[18px] leading-tight mb-1 group-hover:underline decoration-2 underline-offset-2">{room.title}</h3>
                                    </div>
                                    <p className="text-[13px] text-zinc-500 mb-2 truncate font-medium underline">Location • {t("cityCenter") || "City Center"}</p>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => {
                                                if (room.title === "Brahama Seva 1") {
                                                    setShowBrahmaSeva(true);
                                                } else {
                                                    alert(`Booking initiated for ${room.title}!`);
                                                }
                                            }}
                                            className="w-full bg-[#0071C2] hover:bg-[#00599c] text-white py-[10px] rounded-[4px] text-sm font-bold shadow-sm hover:shadow-md active:scale-95 transition-all"
                                        >
                                            {t("bookNow") || "Book Now"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
