import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedQr, setSelectedQr] =
    useState(null);

  const [deleteItem, setDeleteItem] =
    useState(null);

  /* NEW */
  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const BASE_URL =
    "https://url-shortener-api-k6gj.onrender.com";

  /* ---------------- FETCH LINKS ---------------- */

  const fetchLinks = async () => {
    try {
      setLoading(true);

      const res = await api.get("/links");

      setLinks(res.data.data || []);
    } catch (error) {
      console.log(error);
      setLinks([]);
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  /* ---------------- HELPERS ---------------- */

  const getShortUrl = (item) =>
    `${BASE_URL}/${item.shortCode}`;

  const getQrUrl = (item) =>
    `${BASE_URL}/api/v1/qr/${item.shortCode}`;

  const getClicks = (item) =>
    item.clickCount || 0;

  const isLinkActive = (item) =>
    item.isActive !== false;

  /* ---------------- ACTIONS ---------------- */

  const copyLink = async (item) => {
    try {
      await navigator.clipboard.writeText(
        getShortUrl(item)
      );

      toast.success(
        "Copied to clipboard"
      );
    } catch (error) {
      toast.error("Copy failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(
        `/links/${deleteItem.shortCode}`
      );

      toast.success(
        "Link deactivated"
      );

      setDeleteItem(null);

      fetchLinks();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const downloadQr = async () => {
    try {
      const response = await fetch(
        selectedQr.qrUrl
      );

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const a =
        document.createElement("a");

      a.href = url;

      a.download = `${selectedQr.shortCode}-qr.png`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(
        url
      );

      toast.success(
        "QR downloaded"
      );
    } catch (error) {
      toast.error(
        "Download failed"
      );
    }
  };

  /* ---------------- FILTERED LINKS ---------------- */

  const filteredLinks = useMemo(() => {
    return links.filter((item) => {
      const text =
        `${item.originalUrl} ${item.shortCode}`
          .toLowerCase();

      const matchSearch =
        text.includes(
          search.toLowerCase()
        );

      const matchFilter =
        filter === "all"
          ? true
          : filter === "active"
          ? isLinkActive(item)
          : !isLinkActive(item);

      return (
        matchSearch &&
        matchFilter
      );
    });
  }, [links, search, filter]);

  /* ---------------- STATS ---------------- */

  const stats = useMemo(() => {
    const totalLinks =
      links.length;

    const activeLinks =
      links.filter((item) =>
        isLinkActive(item)
      ).length;

    const totalClicks =
      links.reduce(
        (sum, item) =>
          sum + getClicks(item),
        0
      );

    return {
      totalLinks,
      activeLinks,
      totalClicks,
    };
  }, [links]);

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen">

      {/* HEADER */}
      <div className="mb-10">
        <p className="text-zinc-400 text-sm">
          Welcome back
        </p>

        <h1 className="text-4xl font-bold mt-2">
          Dashboard
        </h1>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <StatCard
          title="Total Links"
          value={stats.totalLinks}
        />

        <StatCard
          title="Active Links"
          value={stats.activeLinks}
        />

        <StatCard
          title="Total Clicks"
          value={stats.totalClicks}
        />

      </div>

      {/* SEARCH + FILTER */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <input
          type="text"
          placeholder="Search links..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600"
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600"
        >
          <option value="all">
            All Links
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>
        </select>

      </div>

      {/* BODY */}
      {loading ? (
        <p className="text-zinc-400">
          Loading links...
        </p>
      ) : filteredLinks.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <p className="text-zinc-400">
            No matching links found.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">

          {filteredLinks.map(
            (item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition"
              >
                {/* ORIGINAL URL */}
                <p className="text-zinc-400 text-sm truncate">
                  {
                    item.originalUrl
                  }
                </p>

                {/* SHORT URL */}
                <a
                  href={getShortUrl(
                    item
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 block mt-2 break-all hover:underline"
                >
                  {getShortUrl(
                    item
                  )}
                </a>

                {/* META */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm">

                  <span className="text-zinc-400">
                    Clicks:{" "}
                    {getClicks(
                      item
                    )}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isLinkActive(
                        item
                      )
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {isLinkActive(
                      item
                    )
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

                {/* BUTTONS */}
                <div className="flex flex-wrap gap-3 mt-5">

                  <button
                    onClick={() =>
                      copyLink(
                        item
                      )
                    }
                    className="px-4 py-2 bg-white text-black rounded-xl hover:opacity-90"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/analytics/${item.shortCode}`
                      )
                    }
                    className="px-4 py-2 border border-zinc-700 rounded-xl hover:bg-zinc-800"
                  >
                    Analytics
                  </button>

                  <button
                    onClick={() =>
                      setSelectedQr(
                        {
                          shortCode:
                            item.shortCode,
                          qrUrl:
                            getQrUrl(
                              item
                            ),
                          shortUrl:
                            getShortUrl(
                              item
                            ),
                        }
                      )
                    }
                    className="px-4 py-2 border border-zinc-700 rounded-xl hover:bg-zinc-800"
                  >
                    QR Code
                  </button>

                  {isLinkActive(
                    item
                  ) && (
                    <button
                      onClick={() =>
                        setDeleteItem(
                          item
                        )
                      }
                      className="px-4 py-2 border border-red-500 text-red-400 rounded-xl hover:bg-red-500/10"
                    >
                      Deactivate
                    </button>
                  )}

                </div>
              </div>
            )
          )}

        </div>
      )}

      {/* QR MODAL */}
      {selectedQr && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-2xl font-bold">
                QR Code
              </h2>

              <button
                onClick={() =>
                  setSelectedQr(
                    null
                  )
                }
                className="text-zinc-400 text-xl"
              >
                ×
              </button>

            </div>

            <img
              src={
                selectedQr.qrUrl
              }
              alt="QR Code"
              className="w-56 h-56 mx-auto bg-white rounded-xl p-3"
            />

            <p className="text-blue-400 text-sm mt-5 text-center break-all">
              {
                selectedQr.shortUrl
              }
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6">

              <button
                onClick={
                  downloadQr
                }
                className="px-4 py-2 bg-white text-black rounded-xl hover:opacity-90"
              >
                Download
              </button>

              <button
                onClick={() =>
                  setSelectedQr(
                    null
                  )
                }
                className="px-4 py-2 border border-zinc-700 rounded-xl hover:bg-zinc-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* DELETE MODAL */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">

            <h2 className="text-2xl font-bold mb-3">
              Deactivate Link?
            </h2>

            <p className="text-zinc-400 mb-6 break-all">
              {getShortUrl(
                deleteItem
              )}
            </p>

            <div className="grid grid-cols-2 gap-3">

              <button
                onClick={() =>
                  setDeleteItem(
                    null
                  )
                }
                className="px-4 py-2 border border-zinc-700 rounded-xl hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                onClick={
                  confirmDelete
                }
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Deactivate
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ---------------- CARD ---------------- */

function StatCard({
  title,
  value,
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

      <p className="text-zinc-400 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}