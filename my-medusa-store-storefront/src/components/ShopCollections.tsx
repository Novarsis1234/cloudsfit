"use client";

import Link from "next/link";

export default function ShopCollections() {
  const collections = [
    { name: "REGULAR TEES", desc: "Classic fit for daily wear", href: "/collections/regular-tees", image: "/images/Product1.jpg" },
    { name: "OVERSIZED TEES", desc: "Loose fit streetwear essentials", href: "/collections/oversized-tees", image: "/images/Product2.jpg" },
    { name: "ACID WASH", desc: "Vintage wash aesthetic", href: "/collections/acid-wash", image: "/images/Product3.jpg" },
    { name: "OVERSIZED HOODIES", desc: "Ultra cozy & premium layering", href: "/collections/hoodies", image: "/images/Product4.jpg" },
    { name: "SWEATSHIRTS", desc: "Clean look for chilly days", href: "/collections/sweatshirts", image: "/images/Product5.jpg" },
  ];

  return (
    <section id="shop-collections" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-cloudsfit-purple text-sm font-bold tracking-widest uppercase">
            🔵 BROWSE BY
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 tracking-tight">
            SHOP COLLECTIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {collections.map((col, i) => (
            <Link
              key={i}
              href={col.href}
              className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-cloudsfit-purple/50 transition cursor-pointer group block h-full"
            >
              <div className="aspect-square relative overflow-hidden bg-neutral-800">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-4">
                <h3 className="font-bold tracking-wide text-sm uppercase text-cloudsfit-purple mb-1">
                  {col.name}
                </h3>
                <p className="text-xs text-gray-400">{col.desc}</p>
                <span className="inline-block mt-3 text-xs text-cloudsfit-purple hover:text-cloudsfit-blue font-bold tracking-wider uppercase transition">
                  View All →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
