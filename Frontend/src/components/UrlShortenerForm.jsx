import { useState } from "react";
import api from "../services/api";

export default function UrlShortenerForm() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setCopied(false);

      const res = await api.post("/shorten", {
        url,
      });

      console.log(res.data);

      setData(res.data);
      setUrl("");
    } catch (err) {
      setError("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    try {
      const link =
        data.shortUrl ||
        data.shortenSchema;

      await navigator.clipboard.writeText(
        link
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      setError("Copy failed");
    }
  };

  const displayLink =
    data?.shortUrl ||
    data?.shortenSchema;

  return (
    <div className="space-y-4">

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-3"
      >
        <input
          type="url"
          required
          value={url}
          onChange={(e) =>
            setUrl(e.target.value)
          }
          placeholder="Paste your URL..."
          className="flex-1 bg-zinc-950 border border-zinc-700 px-4 py-3 rounded-xl outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black px-6 py-3 rounded-xl font-medium disabled:opacity-60"
        >
          {loading
            ? "Loading..."
            : "Shorten"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-red-400">
          {error}
        </p>
      )}

      {/* Result */}
      {data && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-5">

          <p className="text-green-400 text-xl font-semibold">
            URL Created
          </p>

          {/* Link + Button */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">

            <a
              href={displayLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 break-all flex-1 text-xl hover:underline"
            >
              {displayLink}
            </a>

            <button
              type="button"
              onClick={copyLink}
              className="border border-white px-6 py-3 rounded-2xl hover:bg-white hover:text-black transition whitespace-nowrap"
            >
              {copied
                ? "Copied!"
                : "Copy Link"}
            </button>

          </div>

          {/* QR Code */}
          {data.qrCode && (
            <img
              src={data.qrCode}
              alt="QR Code"
              className="w-44 h-44 rounded-lg bg-white p-2"
            />
          )}

        </div>
      )}

    </div>
  );
}