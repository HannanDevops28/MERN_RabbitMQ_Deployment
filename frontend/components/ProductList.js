import axios from "axios";

export default function ProductList({ products }) {
  const handleOrder = async (productId) => {
    try {
      const order = {
        userId: "12345", // placeholder (later from Users Service)
        productId,
        quantity: 1,
      };
      await axios.post(`${process.env.ORDERS_API}/orders`, order);
      alert("✅ Order placed!");
    } catch (err) {
      console.error("Order failed:", err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <ul>
      {products.map((p) => (
        <li key={p._id}>
          {p.name} - ${p.price} ({p.stock} in stock)
          <button onClick={() => handleOrder(p._id)}>Order</button>
        </li>
      ))}
    </ul>
  );
}
