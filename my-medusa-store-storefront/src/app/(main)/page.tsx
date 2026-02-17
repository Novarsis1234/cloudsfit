import HeroCloudsFit from "@/components/HeroCloudsFit";
import ShopCollections from "@/components/ShopCollections";
import BestSellers from "@/components/BestSellers";
import NewArrivals from "@/components/NewArrivals";
import AboutCloudsFit from "@/components/AboutCloudsFit";

export default function Home() {
  return (
    <main className="pt-0">
      <HeroCloudsFit />
      <ShopCollections />
      <BestSellers />
      <NewArrivals />
      <AboutCloudsFit />
    </main>
  );
}
