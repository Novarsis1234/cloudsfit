import React from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  rating?: number;
};

type Props = {
  title: string;
  subtitle?: string;
  products?: Product[];
  images?: string[];
  collectionHandle?: string;
  viewAllLink?: string;
};

export default function ShopSection({ 
  title, 
  subtitle, 
  products,
  images,
  collectionHandle,
  viewAllLink 
}: Props) {
  // Use products if provided, otherwise fall back to images array
  const displayData = products || images || [];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{title.toUpperCase()}</h2>
            {subtitle && <p className="text-sm text-gray-400 mt-2">{subtitle}</p>}
          </div>
          <div>
            {viewAllLink ? (
              <Link href={viewAllLink} className="text-sm text-purple-500 hover:underline">
                View All →
              </Link>
            ) : (
              <a href="/shop" className="text-sm text-purple-500 hover:underline">
                View All →
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayData.map((item: any, idx: number) => {
              // Check if item is a product or just an image URL string
              const isProduct = typeof item === 'object' && 'id' in item;
              const href = isProduct && collectionHandle 
                ? `/collections/${collectionHandle}/products/${item.id}`
                : '#';
              const imageUrl = isProduct ? item.image : item;
              const productName = isProduct ? item.name : `${title} ${idx + 1}`;
              const productPrice = isProduct ? item.price : '₹999';

              return (
                <Link 
                  key={idx}
                  href={href}
                  className="group cursor-pointer"
                >
                  <div className="bg-[#0f0f12] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div className="h-96 bg-gray-900 flex items-center justify-center overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={productName}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200" 
                      />
                    </div>
                    <div className="p-4 bg-[#0b0b0d]">
                      <h3 className="text-sm md:text-base font-semibold text-gray-100 uppercase line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {productName}
                      </h3>
                      <div className="text-blue-400 mt-2 font-semibold">{productPrice}</div>
                      {isProduct && item.rating && (
                        <div className="text-xs text-yellow-500 mt-1">
                          ★ {item.rating} ({item.reviews || 0} reviews)
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
