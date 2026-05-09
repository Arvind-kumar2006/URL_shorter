import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import api from "../services/api";

export default function AnalyticsPage() {
  const { shortCode } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] =
    useState(true);

  const BASE_URL =
    "https://url-shortener-api-k6gj.onrender.com";

  async function fetchAnalytics() {
    try {
      setLoading(true);

      const res = await api.get(
        `/analytics/${shortCode}`
      );

      const payload =
        res.data.data || res.data;


      setData(payload);
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, [shortCode]);

  const shortUrl = `${BASE_URL}/${shortCode}`;

  const totalClicks =
    data?.totalClicks ??
    data?.clicks ??
    data?.total ??
    0;

  const uniqueVisitors =
    data?.uniqueVisitors ??
    data?.unique ??
    data?.visitors ??
    0;

  const topReferrer =
    data?.topReferrer ??
    data?.referrer ??
    "Direct";

  /* ------------------------------
     SAFE CHART MAPPING
  ------------------------------ */

  const rawChart =
    data?.clicksByTime ??
    data?.dailyClicks ??
    data?.chart ??
    data?.analytics ??
    [];

  const chartData = rawChart.map(
    (item, index) => ({
      label:
        item.label ||
        item.date ||
        item.day ||
        item.name ||
        `Day ${index + 1}`,

      clicks:
        item.clicks ||
        item.count ||
        item.total ||
        item.value ||
        0,
    })
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        shortUrl
      );

      toast.success(
        "Copied to clipboard"
      );
    } catch (error) {
      toast.error("Copy failed");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen">
        <p className="text-zinc-400">
          Loading analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

        <div>
          <p className="text-zinc-400 text-sm">
            Link Analytics
          </p>

          <h1 className="text-4xl font-bold mt-2">
            {shortCode}
          </h1>

          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 text-sm mt-3 inline-block break-all"
          >
            {shortUrl}
          </a>
        </div>

        <div className="flex gap-3">

          <button
            onClick={copyLink}
            className="px-4 py-2 bg-white text-black rounded-xl font-medium"
          >
            Copy Link
          </button>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="px-4 py-2 border border-zinc-700 rounded-xl"
          >
            Back
          </button>

        </div>

      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">
            Total Clicks
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalClicks}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">
            Unique Visitors
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {uniqueVisitors}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">
            Top Referrer
          </p>

          <h2 className="text-xl font-bold mt-2 truncate">
            {topReferrer}
          </h2>
        </div>

      </div>

      {/* Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

        <h3 className="text-xl font-semibold mb-6">
          Click Trend
        </h3>

        {chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-zinc-400">
            No analytics data yet.
          </div>
        ) : (
          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={chartData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                />

                <XAxis
                  dataKey="label"
                  stroke="#a1a1aa"
                />

                <YAxis
                  stroke="#a1a1aa"
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "#18181b",
                    border:
                      "1px solid #27272a",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>
        )}

      </div>

    </div>
  );
}