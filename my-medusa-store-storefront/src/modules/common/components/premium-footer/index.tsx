import Link from "next/link"

const PremiumFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Antygravity</h3>
              <p className="mt-2 text-sm text-gray-600">
                Premium fashion ecommerce experience.
              </p>
            </div>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-600 transition-colors hover:text-black"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-600 transition-colors hover:text-black"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-600 transition-colors hover:text-black"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-semibold">Shop</h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/store" className="hover:text-black">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/store?category=new" className="hover:text-black">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/store?category=sale" className="hover:text-black">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-semibold">Company</h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-black">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="font-semibold">Support</h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-black">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-600">
              &copy; {currentYear} Antygravity. All rights reserved.
            </p>
            {/* Payment Methods */}
            <div className="flex gap-4">
              <span className="text-xs text-gray-500">We Accept:</span>
              <div className="flex gap-3 text-xs text-gray-600">
                <span>💳 Credit Cards</span>
                <span>🏦 UPI</span>
                <span>🤝 PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PremiumFooter
