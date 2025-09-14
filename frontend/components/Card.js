export default function Card({ title, children }) {
  return (
    <div className="bg-secondary p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
