import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "About Us | CloudsFit",
    description: "Learn about CloudsFit, our mission, and our passion for gaming and anime streetwear.",
}

export default async function AboutPage() {
    return (
        <div className="bg-black min-h-screen pt-6">
            {/* Main Section */}
            <section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left: Image */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-md aspect-square rounded-2xl bg-neutral-800 overflow-hidden shadow-2xl">
                                <img
                                    src="/images/AboutPic.jpg"
                                    alt="CloudsFit Streetwear"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="space-y-8">
                            {/* Label */}
                            <div className="flex items-center gap-3">
                                <span className="text-cloudsfit-purple text-sm font-bold">⚡ OUR STORY</span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase tracking-tight">
                                ABOUT <br className="hidden sm:block" /> CLOUDSFIT
                            </h1>

                            {/* Description */}
                            <div className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed">
                                <p>
                                    Born from a passion for anime culture and mobile gaming, CloudsFit is a streetwear brand crafted for gamers who want to wear their identity with pride.
                                </p>
                                <p>
                                    We blend iconic anime aesthetics with Mobile Legends-inspired designs, creating pieces that speak to the warrior within. From legendary hero prints to subtle gaming references – every piece tells a story.
                                </p>
                                <p>
                                    Whether you're grinding ranks, attending conventions, or just repping your favorite characters, CloudsFit gear is designed to make you feel legendary.
                                </p>
                            </div>

                            {/* Button */}
                            <div>
                                <Link
                                    href="/shop"
                                    className="inline-block px-8 py-3 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-bold uppercase rounded-lg hover:opacity-90 transition"
                                >
                                    JOIN THE SQUAD
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-t border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-3 gap-8 md:gap-12 text-center">
                        {/* Stat 1 */}
                        <div className="space-y-3">
                            <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-cloudsfit-purple">
                                50K+
                            </div>
                            <p className="text-gray-400 text-sm md:text-base font-semibold">Squad Members</p>
                        </div>

                        {/* Stat 2 */}
                        <div className="space-y-3">
                            <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-cloudsfit-blue">
                                200+
                            </div>
                            <p className="text-gray-400 text-sm md:text-base font-semibold">Epic Designs</p>
                        </div>

                        {/* Stat 3 */}
                        <div className="space-y-3">
                            <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-cloudsfit-blue">
                                100%
                            </div>
                            <p className="text-gray-400 text-sm md:text-base font-semibold">Premium Quality</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
