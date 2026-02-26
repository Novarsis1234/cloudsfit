
import ProductDetail from "@/components/ProductDetail";
import { getProductById } from "@/lib/medusa/get-product-by-id";
import { getProducts } from "@/lib/medusa/get-products";
import { retrieveCustomer } from "@/lib/data/customer";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ handle: string; id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { handle: collectionHandle, id: productId } = await params;

  // Parallel fetch for product and related products
  const [product, relatedProducts, customer] = await Promise.all([
    getProductById(productId),
    getProducts(collectionHandle),
    retrieveCustomer().catch(() => null)
  ]);

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
    <ProductDetail
      product={product}
      collectionHandle={collectionHandle}
      relatedProducts={relatedProducts}
      customer={customer}
    />
  );
}
