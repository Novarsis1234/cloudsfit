"use client";

import Link from "next/link";

export default function HeroCloudsFit() {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-0 text-white overflow-hidden flex items-center"
    >
      {/* 🔥 Background Image (TOP SAFE) */}
      <div
        className="absolute inset-0 z-0 bg-top bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/images/HomePic.jpg')",
        }}
      />

    

      {/* 🔥 RIGHT SIDE FLOATING DESIGN */}
      <div className="absolute right-16 top-32 w-20 h-20 border-2 border-cloudsfit-purple rotate-45 opacity-40 z-20" />
      <div className="absolute right-24 bottom-32 w-10 h-10 border-2 border-cloudsfit-blue opacity-50 z-20" />

      {/* 🔥 Content */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-6">
        <div className="max-w-2xl">

          <div className="flex items-center gap-2 mb-6 text-cloudsfit-blue">
            <span>✕</span>
            <span className="text-sm font-bold tracking-[3px] uppercase">
              NEW DROP 2026
            </span>
            <span>✕</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            LEVEL UP
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg,#a855f7,#60a5fa,#ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              YOUR STYLE
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-8 font-light">
            Anime · Mobile Legends · Gaming Streetwear
          </p>

          {/* 🔥 BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="px-8 py-4 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-bold tracking-wider uppercase hover:opacity-90 transition rounded text-center"
            >
              SHOP ALL
            </Link>

            <Link
              href="/collections/regular-tees"
              className="px-8 py-4 border-2 border-cloudsfit-purple text-cloudsfit-purple font-bold tracking-wider uppercase hover:bg-cloudsfit-purple/10 transition rounded text-center"
            >
              VIEW COLLECTIONS
            </Link>
          </div>

          <div className="absolute bottom-10 left-6 text-cloudsfit-purple text-xs md:text-sm font-bold tracking-widest">
            SCROLL
          </div>
        </div>
      </div>
    </section>
  );
}
