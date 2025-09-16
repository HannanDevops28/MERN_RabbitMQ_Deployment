import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 p-4">
        <h1 className="text-xl font-bold mb-6">📊 Dashboard</h1>
        <nav className="flex flex-col space-y-3">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/orders" className="hover:text-white">Orders</Link>
          <Link href="/products" className="hover:text-white">Products</Link>
          <Link href="/users" className="hover:text-white">Users</Link>
          <Link href="/analytics" className="hover:text-white">Analytics</Link>
          <Link href="/create-order" className="hover:text-white">Create Order</Link>

        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
