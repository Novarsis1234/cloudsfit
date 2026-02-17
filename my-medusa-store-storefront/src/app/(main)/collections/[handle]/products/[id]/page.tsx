"use client";

import { useParams } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getProductById } from "@/lib/productsData";

export default function ProductPage() {
  const params = useParams();
  const collectionHandle = params.handle as string;
  const productId = parseInt(params.id as string);

  const product = getProductById(collectionHandle, productId);

  if (!product) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-400">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProductDetail product={product} collectionHandle={collectionHandle} />
  );
}
