import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function CreateOrderPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ userId: "", productId: "", quantity: 1 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_PRODUCTS_API}/products`
        );
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load products:", err.message);
      }
    }
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_ORDERS_API}/orders`,
        form
      );
      setMessage({ type: "success", text: "Order created successfully!" });
      setForm({ userId: "", productId: "", quantity: 1 });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to create order",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Create New Order</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto"
      >
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* User ID */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">User ID</label>
          <input
            type="text"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter user ID"
          />
        </div>

        {/* Product */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Product</label>
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a product</option>
            {products.map((prod) => (
              <option key={prod._id} value={prod._id}>
                {prod.name} (${prod.price})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition duration-200"
        >
          {loading ? "Creating Order..." : "Create Order"}
        </button>
      </form>
    </Layout>
  );
}
