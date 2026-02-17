"use client";

import Link from "next/link";

export default function AboutCloudsFit() {
  return (
    <section id="about" className="py-16 md:py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* 🔥 LEFT IMAGE */}
          <div className="relative order-2 lg:order-1">
            <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] rounded-xl overflow-hidden border-4 border-cloudsfit-purple/30">
              
              {/* IMAGE FROM PUBLIC FOLDER */}
              <img
                src="/images/AboutPic.jpg"
               // 👈 apni image ka naam yaha change karo
                alt="About CloudsFit"
                className="w-full h-full object-cover"
              />

              {/* Soft gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Decorative corner box */}
            <div className="hidden md:block absolute -bottom-6 -right-6 w-32 h-32 border-2 border-cloudsfit-purple/20 rounded-lg -z-10" />
          </div>

          {/* 🔥 RIGHT TEXT CONTENT */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-cloudsfit-purple">🔮</span>
              <span className="text-sm font-bold tracking-widest uppercase text-cloudsfit-purple">
                OUR STORY
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              ABOUT <span className="text-cloudsfit-purple">CLOUDSFIT</span>
            </h2>

            <div className="space-y-5 text-gray-300 font-light mb-8 text-sm sm:text-base leading-relaxed">
              <p>
                Born from a passion for online culture and mobile gaming, CloudsFit is a streetwear brand crafted for gamers who want to wear their identity with pride.
              </p>
              <p>
                We blend iconic anime aesthetics with Mobile Legends-inspired designs, creating pieces that speak to the warrior within. From legendary hero points to subtle gaming references — every piece tells a story.
              </p>
              <p>
                Whether you're grinding ranks, attending conventions, or just repping your favorite characters, CloudsFit gear is designed to make you feel legendary.
              </p>
            </div>

            {/* 🔥 CTA LINK BUTTON */}
            <Link
              href="/about"
              className="inline-block px-8 py-4 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-bold tracking-wider uppercase hover:opacity-90 transition rounded mb-12"
            >
              JOIN THE SQUAD
            </Link>

            {/* 🔥 STATS */}
            <div className="grid grid-cols-3 gap-6 sm:gap-8 border-t border-neutral-800 pt-8">
              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-cloudsfit-purple">50K+</p>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mt-1">
                  Squad Members
                </p>
              </div>

              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-cloudsfit-blue">200+</p>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mt-1">
                  Epic Designs
                </p>
              </div>

              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-cloudsfit-purple">100%</p>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mt-1">
                  Premium Quality
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
