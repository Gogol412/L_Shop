import { useEffect, useState } from "react";

function Catalog() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    return (
        <div>
            <h1>Каталог</h1>

            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.price} BYN/{product.count}</p>
                </div>
            ))}
        </div>
    );
}

export default Catalog;