import Layout from "../components/Layout";
import Link from "next/link";

export default function HomePage() {
  return (
    <Layout>
      <h1 className="text-3xl mb-6">Welcome to E-Commerce Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/orders" className="bg-blue-600 hover:bg-blue-700 p-6 rounded-lg shadow-md text-center font-bold">View Orders</Link>
        <Link href="/products" className="bg-green-600 hover:bg-green-700 p-6 rounded-lg shadow-md text-center font-bold">View Products</Link>
        <Link href="/users" className="bg-yellow-600 hover:bg-yellow-700 p-6 rounded-lg shadow-md text-center font-bold">View Users</Link>
        <Link href="/analytics" className="bg-purple-600 hover:bg-purple-700 p-6 rounded-lg shadow-md text-center font-bold">Analytics</Link>
        <Link href="/create-order" className="bg-purple-600 hover:bg-purple-700 p-6 rounded-lg shadow-md text-center font-bold">Create Order</Link>
     
      </div>
    </Layout>
  );
}
