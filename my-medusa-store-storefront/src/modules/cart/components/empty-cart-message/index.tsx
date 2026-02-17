import InteractiveLink from "@/modules/common/components/interactive-link"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center px-4" data-testid="empty-cart-message">
      <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>

      <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2">
        Your Cart is <span className="text-gray-500">Empty</span>
      </h1>

      <p className="text-gray-400 max-w-sm mb-8">
        Looks like you haven&apos;t added any items yet.
      </p>

      <LocalizedClientLink
        href="/store"
        className="px-8 py-3 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
      >
        Continue Shopping
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage

