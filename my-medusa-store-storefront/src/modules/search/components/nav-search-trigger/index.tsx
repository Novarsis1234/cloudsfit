"use client"

import { useState } from "react"
import SearchModal from "../search-modal"

const NavSearchTrigger = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-white hover:text-cloudsfit-purple transition-colors duration-200 flex items-center justify-center"
                aria-label="Search"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            <SearchModal isOpen={isOpen} close={() => setIsOpen(false)} />
        </>
    )
}

export default NavSearchTrigger
