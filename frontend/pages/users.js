import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_USERS_API}/users`);
        setUsers(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error("Failed to fetch users:", err.message);
      }
    }
    fetchUsers();
  }, []);

  if (!users.length) return <Layout><p>No users found.</p></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Users</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
