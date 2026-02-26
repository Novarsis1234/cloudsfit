import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-black relative min-h-screen flex flex-col">
      <Navbar />
      <div className="relative flex-1 pt-24" data-testid="checkout-container">
        {children}
      </div>
      <Footer />
    </div>
  )
}

