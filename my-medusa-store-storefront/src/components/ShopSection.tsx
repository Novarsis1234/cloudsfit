import React from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { MedusaProduct } from "@/lib/medusa/mappers";

type Props = {
  title: string;
  subtitle?: string;
  products?: MedusaProduct[];
  collectionHandle?: string;
  viewAllLink?: string;
};

export default function ShopSection({
  title,
  subtitle,
  products = [],
  collectionHandle,
  viewAllLink
}: Props) {
  // User requested limit: only 1 row of 4 cards, others in View All
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{title.toUpperCase()}</h2>
            {subtitle && <p className="text-sm text-gray-400 mt-2">{subtitle}</p>}
          </div>
          <div>
            {viewAllLink && (
              <Link href={viewAllLink} className="text-sm text-purple-500 hover:text-purple-400 font-bold transition-colors">
                View All →
              </Link>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  collectionHandle={collectionHandle}
                />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500">
              No products found in {title}.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
