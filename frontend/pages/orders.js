import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_ORDERS_API}/orders`
        );
        setOrders(res.data || []); // fallback to empty array
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Orders Dashboard</h1>

      <table className="min-w-full table-auto border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="border border-gray-600 px-4 py-2">Order ID</th>
            <th className="border border-gray-600 px-4 py-2">Product Name</th>
            <th className="border border-gray-600 px-4 py-2">Category</th>
            <th className="border border-gray-600 px-4 py-2">Price ($)</th>
            <th className="border border-gray-600 px-4 py-2">Quantity</th>
            <th className="border border-gray-600 px-4 py-2">Status</th>
            <th className="border border-gray-600 px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.orderId}
              className="even:bg-gray-800 odd:bg-gray-700"
            >
              <td className="border border-gray-600 px-4 py-2">
                {order.orderId ?? "Unknown"}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {order.product?.name ?? "Unknown"}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {order.product?.category ?? "Unknown"}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {order.product?.price ?? 0}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {order.quantity ?? 0}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {order.status ?? "Pending"}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {new Date(order.createdAt).toLocaleString() ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
