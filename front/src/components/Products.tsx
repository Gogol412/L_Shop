// front/src/components/Products.tsx
import { useEffect, useState } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
}

function Products() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            {products.map(product => (
                <div key={product.id}>
                    {product.name} - {product.price}₽
                </div>
            ))}
        </div>
    );
}

export default Products;