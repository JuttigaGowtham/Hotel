"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "te" | "hi";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    en: {
        welcome: "Welcome to paradise",
        oasis: "An Oasis of Elegance",
        discoverStory: "Discover Our Story",
        discoverStays: "Discover Stays",
        hotelsIn: "Hotels in",
        guests: "2 Guests",
        cityCenter: "City Center",
        bookNow: "Book Now",
        explore: "Explore",
        contact: "Contact",
        ourSuites: "Our Suites",
        diningBar: "Dining & Bar",
        spaWellness: "Spa & Wellness",
        experienceZenith: "Experience the zenith of luxury and comfort tailored uniquely for you.",
        privacy: "Privacy",
        terms: "Terms",
        rights: "All rights reserved.",
        address: "123 Luxury Blvd, Horizon City"
    },
    te: {
        welcome: "స్వర్గానికి స్వాగతం",
        oasis: "అద్భుతమైన ప్రశాంతత",
        discoverStory: "మా కథను కనుగొనండి",
        discoverStays: "బసను కనుగొనండి",
        hotelsIn: "హోటళ్ల జాబితా:",
        guests: "2 అతిథులు",
        cityCenter: "నగర కేంద్రం",
        bookNow: "ఇప్పుడే బుక్ చేయండి",
        explore: "అన్వేషించండి",
        contact: "సంప్రదించండి",
        ourSuites: "మా సూట్‌లు",
        diningBar: "డైనింగ్ & బార్",
        spaWellness: "స్పా & వెల్‌నెస్",
        experienceZenith: "ఎన్నటికీ మరువలేని ప్రత్యేకమైన విలాసాలను ఇక్కడ ఆస్వాదించండి.",
        privacy: "గోప్యత",
        terms: "నియమాలు",
        rights: "అన్ని హక్కులూ ప్రత్యేకించబడినవి.",
        address: "123 లగ్జరీ రోడ్, హారిజాన్ సిటీ"
    },
    hi: {
        welcome: "स्वर्ग में आपका स्वागत है",
        oasis: "सुंदरता का ओएसिस",
        discoverStory: "हमारी कहानी खोजें",
        discoverStays: "ठहरने की खोज करें",
        hotelsIn: "होटल:",
        guests: "2 मेहमान",
        cityCenter: "सि‍टी सेंटर",
        bookNow: "अभी बुक करें",
        explore: "अन्वेषण करें",
        contact: "संपर्क करें",
        ourSuites: "हमारे सुइट्स",
        diningBar: "डाइनिंग और बार",
        spaWellness: "स्पा और वेलनेस",
        experienceZenith: "विशेष रूप से आपके लिए डिज़ाइन किए गए आराम का अनुभव करें।",
        privacy: "गोपनीयता",
        terms: "शर्तें",
        rights: "सभी अधिकार सुरक्षित।",
        address: "123 लक्ज़री बुलेवार्ड, हॉराइजन सिटी"
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    const t = (key: string) => {
        return (translations[language] as any)[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
}
