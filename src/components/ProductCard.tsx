'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/types/types';
import Image from 'next/image';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart, cart } = useCart();
  const cartItem = cart.find(item => item.productId === product.id);
  const availableStock = product.stock - (cartItem?.quantity || 0);

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
      <div className="relative h-48">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-black">{product.name}</h3>
        <p className="text-black mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-black">${product.price}</span>
            <div className="text-sm text-black">
              Stock: {availableStock}
            </div>
          </div>
          <button 
            onClick={() => addToCart(product.id)}
            disabled={availableStock <= 0}
            className={`px-4 py-2 rounded ${
              availableStock > 0 
                ? 'bg-[#FAADA9] hover:bg-[#D96E84] text-black' 
                : 'bg-gray-300 cursor-not-allowed text-black'
            }`}
          >
            {availableStock > 0 ? 'Agregar al carrito' : 'Sin stock'}
          </button>
        </div>
      </div>
    </div>
  );
}