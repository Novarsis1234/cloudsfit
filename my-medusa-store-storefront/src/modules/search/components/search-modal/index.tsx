"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const SearchModal = ({
    isOpen,
    close,
}: {
    isOpen: boolean
    close: () => void
}) => {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
            inputRef.current?.focus()
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/store?q=${encodeURIComponent(query)}`)
            close()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-8 sm:pt-10 md:pt-12 animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-2xl mx-4 bg-[#0b0b15] border border-cloudsfit-purple/50 rounded-xl shadow-[0_0_30px_rgba(124,58,237,0.3)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSearch} className="relative flex items-center">
                    <div className="absolute left-6 text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search products..."
                        className="w-full h-16 pl-16 pr-16 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="absolute right-16 text-gray-500 hover:text-white"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={close}
                        className="absolute right-6 text-gray-500 hover:text-white"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </form>

                {/* Quick Suggestions (Hardcoded for now as per design) */}
                <div className="px-6 py-4 border-t border-white/5 bg-white/5">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 block">Popular Searches</span>
                    <div className="flex flex-wrap gap-2">
                        {['Anime Tees', 'Gaming Hoodies', 'Oversized', 'Accessories'].map((term) => (
                            <button
                                key={term}
                                type="button"
                                onClick={() => {
                                    setQuery(term)
                                    router.push(`/store?q=${encodeURIComponent(term)}`)
                                    close()
                                }}
                                className="px-3 py-1 bg-white/10 hover:bg-cloudsfit-purple hover:text-white rounded-full text-sm text-gray-300 transition-colors"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Click outside to close area */}
            <div className="absolute inset-0 -z-10" onClick={close} />
        </div>
    )
}

export default SearchModal
