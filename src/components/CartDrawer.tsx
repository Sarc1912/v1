'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/types';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export default function CartDrawer({ isOpen, onClose, products }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const cartItems = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    return { ...cartItem, product };
  });

  const total = cartItems.reduce((acc, item) => 
    acc + (item.product?.price || 0) * item.quantity, 0
  );

  return (
    <div className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Tu Carrito</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      
      <div className="h-[calc(100vh-160px)] overflow-y-auto p-4 text-black">
        {cartItems.map((item) => (
          item.product && (
            <div key={item.productId} className="flex gap-4 mb-4 pb-4 border-b last:border-b-0">
              <Image 
                src={item.product.image} 
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg"
                width={80}
                height={80}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                    className="w-16 px-2 py-1 border rounded text-center"
                  />
                  <span className="text-gray-600">${(item.product.price * item.quantity).toFixed(2)}</span>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="ml-auto text-red-500 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )
        ))}
        
        {cartItems.length === 0 && (
          <p className="text-gray-500 text-center py-8">El carrito está vacío</p>
        )}
      </div>

      <div className="absolute bottom-0 w-full p-4 bg-white border-t">
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={clearCart}
            className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Vaciar Carrito
          </button>
          <button 
            className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}