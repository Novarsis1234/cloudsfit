"use client"

import { useState } from "react"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Image from "next/image"

const collections = [
    { name: "Regular Tees", handle: "regular-tees", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500" },
    { name: "Oversized Tees", handle: "oversized-tees", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=500" },
    { name: "Acid Wash", handle: "acid-wash", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=500" },
    { name: "Gaming Hoodies", handle: "hoodies", image: "https://images.unsplash.com/photo-1556906781-9a412961d28c?auto=format&fit=crop&q=80&w=500" },
    { name: "Sweatshirts", handle: "sweatshirts", image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80&w=500" },
    { name: "Accessories", handle: "accessories", image: "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&q=80&w=500" },
]

export default function NavCollections() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <LocalizedClientLink
                href="/collections"
                className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-wide h-full"
            >
                Collections
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cloudsfit-purple' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </LocalizedClientLink>

            {/* Mega Menu Dropdown */}
            <div
                className={`fixed left-0 right-0 top-[112px] bg-[#0b0b15]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl transition-all duration-300 transform origin-top z-40 ${isOpen
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-4 invisible pointer-events-none"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        {collections.map((col) => (
                            <LocalizedClientLink
                                key={col.handle}
                                href={`/collections/${col.handle}`}
                                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-white/5 hover:border-cloudsfit-purple/50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Image
                                    src={col.image}
                                    alt={col.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white font-bold text-lg uppercase tracking-tight group-hover:text-cloudsfit-purple-light transition-colors">
                                        {col.name}
                                    </h3>
                                    <div className="h-0.5 w-0 bg-cloudsfit-purple group-hover:w-full transition-all duration-300 mt-2" />
                                </div>
                            </LocalizedClientLink>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                        <LocalizedClientLink
                            href="/collections"
                            className="flex items-center gap-2 text-cloudsfit-purple hover:text-white transition-colors uppercase text-sm font-bold tracking-widest"
                        >
                            View All Collections
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </LocalizedClientLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

