import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_PRODUCTS_API}/products`);
        setProducts(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error("Failed to fetch products:", err.message);
      }
    }
    fetchProducts();
  }, []);

  if (!products.length) return <Layout><p>No products found.</p></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Products</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((prod) => (
          <div key={prod._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">{prod.name}</h2>
            <p>Category: {prod.category}</p>
            <p>Price: ${prod.price}</p>
            <p>Stock: {prod.stock ?? "N/A"}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
