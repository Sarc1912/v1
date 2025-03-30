'use client';

import { Category } from '@/types/types';

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory
}: {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
}) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-full transition-colors ${
          !selectedCategory 
            ? 'bg-[#FAADA9] text-black' 
            : 'bg-gray-200 hover:bg-gray-300 text-black'
        }`}
      >
        Todas
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedCategory === category.id 
              ? 'bg-[#FAADA9] text-black' 
              : 'bg-gray-200 hover:bg-gray-300 text-black'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}