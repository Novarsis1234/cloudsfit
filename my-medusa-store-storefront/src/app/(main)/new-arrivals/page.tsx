import { getProducts } from '@/lib/medusa/get-products';
import ProductCard from '@/components/ProductCard';
import { Toaster } from 'sonner';
import Link from 'next/link';

export default async function NewArrivalsPage() {
  const products = await getProducts('new-arrivals');

  if (!products.length) return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center">
      <p className="text-gray-400">No products found in New Arrivals collection.</p>
    </div>
  );

  return (
    <main className="bg-black min-h-screen text-white pt-0">
      <Toaster position="top-center" theme="dark" />

      {/* Header Section */}
      <section className="py-12 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-cloudsfit-blue text-sm font-bold tracking-widest uppercase">
            ✨ JUST DROPPED
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight mt-4">
            NEW ARRIVALS
          </h1>
          <p className="text-gray-400">Check out our latest collection of anime and gaming inspired streetwear</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                collectionHandle="new-arrivals"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 uppercase">Missed something?</h2>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-bold rounded-lg hover:opacity-90 transition"
          >
            EXPLORE THE FULL SHOP
          </Link>
        </div>
      </section>
    </main>
  );
}
