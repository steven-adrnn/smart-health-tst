'use client'

import { useState } from 'react';
import { Database } from '@/lib/database.types';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
    product: Database['public']['Tables']['products']['Row'];
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [isAdding, setIsAdding] = useState(false);

    // components/ProductCard.tsx
    const addToCart = async () => {
        try {
            const session = localStorage.getItem('user_session');
            if (!session) {
                toast.error('Anda harus login');
                return;
            }

            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            toast.success('Produk ditambahkan ke keranjang');
        } catch (error) {
            toast.error('Gagal menambahkan produk');
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow-md">
            <Link href={`/product/${product.id}`}>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                {product.image && (
                    <div className="relative w-full h-48 mb-2">
                        <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill
                            className="object-cover rounded-md"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                )}
                <p className="text-gray-600">{product.description}</p>
                <p className="font-bold text-green-600">Rp {product.price.toLocaleString()}</p>
            </Link>
            <Button 
                onClick={addToCart} 
                disabled={isAdding} 
                className="w-full mt-2"
            >
                {isAdding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
            </Button>
        </div>
    );
};

export default ProductCard;