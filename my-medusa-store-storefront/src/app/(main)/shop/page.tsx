import ShopSection from "@/components/ShopSection";
import { productsData } from "@/lib/productsData";

export default function ShopPage() {
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
        products={productsData["regular-tees"]}
        collectionHandle="regular-tees"
        viewAllLink="/collections/regular-tees"
      />
      <ShopSection 
        title="Oversized Tees" 
        subtitle="Loose fit streetwear essentials" 
        products={productsData["oversized-tees"]}
        collectionHandle="oversized-tees"
        viewAllLink="/collections/oversized-tees"
      />
      <ShopSection 
        title="Acid Wash" 
        subtitle="Vintage wash aesthetic" 
        products={productsData["acid-wash"]}
        collectionHandle="acid-wash"
        viewAllLink="/collections/acid-wash"
      />
      <ShopSection 
        title="Oversized Hoodies" 
        subtitle="Ultra cozy & premium layering" 
        products={productsData["hoodies"]}
        collectionHandle="hoodies"
        viewAllLink="/collections/hoodies"
      />
      <ShopSection 
        title="Sweatshirts" 
        subtitle="Clean look for chilly days" 
        products={productsData["sweatshirts"]}
        collectionHandle="sweatshirts"
        viewAllLink="/collections/sweatshirts"
      />
    </main>
  );
}
