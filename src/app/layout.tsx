import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mi Ecommerce',
  description: 'Tienda online con Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider> {/* Envuelve toda la aplicación */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}