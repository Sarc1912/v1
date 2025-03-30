import { loadCSVData } from '@/lib/csvLoader';
import ProductList from '@/components/ProductList';

export default async function Home() {
  const { products, categories } = await loadCSVData();

  return (
    <main className="min-h-screen bg-gray-50">
      <ProductList initialProducts={products} initialCategories={categories} />
    </main>
  );
}