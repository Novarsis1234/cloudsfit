"use client"

import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden bg-cloudsfit-dark">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/HomeSection.jpg"
          alt="CloudsFit Hero - Anime Streetwear"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark Purple/Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b15] via-[#0b0b15]/70 to-transparent opacity-90" />
      </div>

      {/* Content Container */}
      <div className="content-container relative z-10 h-full flex flex-col justify-center items-start">
        {/* Badge */}
        {/* Badge */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in-top">
          <span className="text-cloudsfit-neon-blue text-xl">⚔️</span>
          <span className="text-cloudsfit-neon-blue font-bold tracking-[0.3em] uppercase text-sm">
            NEW DROP 2026
          </span>
          <span className="text-cloudsfit-neon-blue text-xl">⚔️</span>
        </div>

        {/* Main Heading */}
        <div className="max-w-3xl mb-4">
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-2">
            LEVEL UP
          </h1>
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#06B6D4] leading-[0.9] tracking-tighter filter drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
            YOUR STYLE
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 mb-10 font-medium tracking-wide">
          Anime • Mobile Legends • Gaming Streetwear
        </p>

        {/* CTAs */}
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/store"
            className="px-10 py-4 bg-[#3B82F6] text-white font-black uppercase tracking-wider hover:bg-[#2563EB] transition-all duration-300 text-center shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] hover:-translate-y-1 rounded-sm"
          >
            SHOP ALL
          </Link>
          <Link
            href="/store"
            className="px-10 py-4 border-2 border-[#8B5CF6] text-white font-black uppercase tracking-wider hover:bg-[#8B5CF6]/20 transition-all duration-300 text-center hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:-translate-y-1 rounded-sm"
          >
            VIEW COLLECTIONS
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="w-24 h-24 border-2 border-cloudsfit-purple/30 rotate-45 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default Hero
