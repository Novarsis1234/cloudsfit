import { HttpTypes } from "@medusajs/types"
import Link from "next/link"

type CollectionShowcaseProps = {
    collections: HttpTypes.StoreCollection[]
}

export default function CollectionShowcase({ collections }: CollectionShowcaseProps) {
    return (
        <div className="content-container py-24">
            <div className="flex flex-col items-center mb-16">
                <div className="flex items-center gap-2 mb-4 animate-bounce">
                    <span className="text-xl">⭐</span>
                    <span className="text-xs font-black tracking-[0.3em] text-cloudsfit-neon-blue uppercase">
                        Curated For You
                    </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-center text-white mb-4 uppercase tracking-tighter italic">
                    SHOP BY <span className="text-cloudsfit-blue">COLLECTION</span>
                </h2>
                <div className="w-24 h-1.5 bg-cloudsfit-blue rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collections.slice(0, 3).map((collection, index) => (
                    <Link
                        key={collection.id}
                        href={`/collections/${collection.handle}`}
                        className="group relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/5 shadow-2xl"
                    >
                        {/* Background Aesthetic */}
                        <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 ${index === 0 ? 'from-cloudsfit-purple/20 to-cloudsfit-dark' :
                                index === 1 ? 'from-cloudsfit-blue/20 to-cloudsfit-dark' :
                                    'from-cloudsfit-neon-pink/20 to-cloudsfit-dark'
                            }`} />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 text-center">
                            <h3 className="text-white font-black text-2xl md:text-3xl uppercase tracking-tighter mb-4 group-hover:scale-110 transition-transform duration-500">
                                {collection.title}
                            </h3>
                            <span className="px-6 py-2 border border-white/20 rounded-full text-xs font-bold text-white uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">
                                Explore
                            </span>
                        </div>

                        {/* Hover Shine Effect */}
                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-1000 ease-in-out" />
                    </Link>
                ))}
            </div>
        </div>
    )
}
