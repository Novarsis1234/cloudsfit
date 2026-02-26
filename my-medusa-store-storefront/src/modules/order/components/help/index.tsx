import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="border-t border-white/5 pt-8">
      <h2 className="text-sm font-black uppercase tracking-widest text-white/30 mb-4">Need help?</h2>
      <div className="flex gap-x-6">
        <LocalizedClientLink
          href="/contact"
          className="text-xs font-bold uppercase tracking-widest text-cloudsfit-blue hover:underline"
        >
          Contact Support
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/contact"
          className="text-xs font-bold uppercase tracking-widest text-cloudsfit-blue hover:underline"
        >
          Returns & Exchanges
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Help
