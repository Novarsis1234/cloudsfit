import ShopSection from "@/components/ShopSection";
import { getProducts } from "@/lib/medusa/get-products";
import { MedusaProduct } from "@/lib/medusa/mappers";

export default async function ShopPage() {
  const [regularTees, oversizedTees, acidWash, hoodies, sweatshirts] = await Promise.all([
    getProducts('regular-tees'),
    getProducts('oversized-tees'),
    getProducts('acid-wash'),
    getProducts('hoodies'),
    getProducts('sweatshirts'),
  ]);

  return (
    <main className="bg-black min-h-screen pt-0">
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">SHOP ALL</h1>
          <p className="text-gray-400">Explore our complete collection of anime and gaming inspired streetwear</p>
        </div>
      </section>

      <ShopSection
        title="Regular Tees"
        subtitle="Classic fit for daily wear"
        products={regularTees}
        collectionHandle="regular-tees"
        viewAllLink="/collections/regular-tees"
      />
      <ShopSection
        title="Oversized Tees"
        subtitle="Loose fit streetwear essentials"
        products={oversizedTees}
        collectionHandle="oversized-tees"
        viewAllLink="/collections/oversized-tees"
      />
      <ShopSection
        title="Acid Wash"
        subtitle="Vintage wash aesthetic"
        products={acidWash}
        collectionHandle="acid-wash"
        viewAllLink="/collections/acid-wash"
      />
      <ShopSection
        title="Oversized Hoodies"
        subtitle="Ultra cozy & premium layering"
        products={hoodies}
        collectionHandle="hoodies"
        viewAllLink="/collections/hoodies"
      />
      <ShopSection
        title="Sweatshirts"
        subtitle="Clean look for chilly days"
        products={sweatshirts}
        collectionHandle="sweatshirts"
        viewAllLink="/collections/sweatshirts"
      />
    </main>
  );
}
