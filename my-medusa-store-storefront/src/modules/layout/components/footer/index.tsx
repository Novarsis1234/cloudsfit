"use client"

import Link from "next/link"
import { Instagram } from "@medusajs/icons"
import { useState } from "react"

const Footer = () => {
    const [email, setEmail] = useState("")

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement newsletter subscription
        console.log("Subscribe:", email)
        setEmail("")
    }

    return (
        <footer className="bg-cloudsfit-dark-light border-t border-white/10">
            <div className="content-container py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🎮</span>
                            </div>
                            <span className="text-xl font-bold text-white">CloudsFit</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-6 max-w-sm">
                            Level up your wardrobe with anime & gaming-inspired streetwear. Bold prints. Premium quality. Epic style.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-cloudsfit-purple transition-colors flex items-center justify-center">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-cloudsfit-purple transition-colors flex items-center justify-center">
                                <span className="text-sm">𝕏</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-cloudsfit-purple transition-colors flex items-center justify-center">
                                <span className="text-sm">▶</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-cloudsfit-purple transition-colors flex items-center justify-center">
                                <span className="text-sm">💬</span>
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Shop</h3>
                        <ul className="space-y-2">
                            <li><Link href="/store" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">New Drops</Link></li>
                            <li><Link href="/store" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">Best Sellers</Link></li>
                            <li><Link href="/collections" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">Anime Collection</Link></li>
                            <li><Link href="/collections" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">Gaming Hoodies</Link></li>
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Help</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">Track Order</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">Shipping Info</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">Returns & Exchange</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">Size Guide</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Community Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Community</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">About Us</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">Discord Server</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">Player Spotlight</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-cloudsfit-purple-light transition-colors text-sm">Blog</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="border-t border-white/10 pt-8 mb-8">
                    <div className="max-w-md">
                        <h3 className="text-white font-bold text-lg mb-2 uppercase">
                            JOIN THE <span className="gradient-text-purple">SQUAD</span>
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Get exclusive drops, early access & legendary offers straight to your inbox.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cloudsfit-purple"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-semibold rounded-lg hover:opacity-90 transition-opacity uppercase text-sm"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2025 CloudsFit. All rights reserved. 🎮 GR 420
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-gray-500 hover:text-cloudsfit-purple-light transition-colors text-sm">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-cloudsfit-purple-light transition-colors text-sm">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-cloudsfit-purple-light transition-colors text-sm">
                            Refund Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
