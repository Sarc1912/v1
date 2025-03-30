"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/types/types";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";
import debounce from "lodash.debounce";
import CartDrawer from "./CartDrawer";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function ProductList({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: Category[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc">("price_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();

  const ITEMS_PER_PAGE = 6;

  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    // Filtros
    filtered = filtered.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || p.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Ordenamiento
    filtered.sort((a, b) =>
      sortBy === "price_asc" ? a.price - b.price : b.price - a.price
    );

    return filtered;
  }, [initialProducts, searchTerm, selectedCategory, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = debounce((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 300);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Controles */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/logo/logo.png"
            width={100}
            height={100}
            alt="Logo"
            className="rounded-lg"
          />
        </div>

        {/* Controles derechos */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Barra de búsqueda */}
          <input
            type="text"
            placeholder="Buscar productos..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:max-w-xs px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-black"
          />

          {/* Filtros y carrito */}
          <div className="flex gap-4 items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "price_asc" | "price_desc")}
              className="px-4 py-2 rounded-lg border text-black"
            >
              <option value="price_asc">Precio: Menor a Mayor</option>
              <option value="price_desc">Precio: Mayor a Menor</option>
            </select>

            <button
              onClick={() => setIsCartOpen(true)}
              className=" hover:text-[#D96E84] text-[#FAADA9] px-4 py-2 rounded-lg flex items-center gap-2 relative border-2"
            >
              <div className="relative">
                <ShoppingCartIcon className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros de Categoría */}
      <CategoryFilter
        categories={initialCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Listado de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-[#D96E84] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Carrito */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        products={initialProducts}
      />
    </div>
  );
}
