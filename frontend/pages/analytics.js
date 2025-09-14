import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Layout from "../components/Layout";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsPage() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_ANALYTICS_API}/analytics/summary`);
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err.message);
      }
    }
    fetchAnalytics();
  }, []);

  const data = {
    labels: summary.map((s) => s._id),
    datasets: [
      {
        label: "Total Quantity Sold",
        data: summary.map((s) => s.totalQuantity),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Analytics</h1>
      {summary.length === 0 ? <p>No analytics data found.</p> : <Bar data={data} />}
    </Layout>
  );
}
