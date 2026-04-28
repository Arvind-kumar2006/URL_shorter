// src/pages/LandingPage.jsx
import UrlShortenerForm from "../components/UrlShortenerForm";
export default function LandingPage() {
  return (
    <div className="space-y-24">

      {/* Hero */}
      <section className="text-center max-w-4xl mx-auto pt-10">
        <p className="text-sm text-zinc-400 mb-4">
          Smart URL Shortener SaaS
        </p>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Shorten. Share. <br />
          Track smarter.
        </h1>

        <p className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto">
          Turn long messy links into clean short URLs.
          Track clicks, generate QR codes, and manage links easily.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <a
            href="/dashboard"
            className="bg-white text-black px-6 py-3 rounded-xl font-medium"
          >
            Get Started
          </a>

          <a
            href="#features"
            className="border border-zinc-700 px-6 py-3 rounded-xl"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* URL Form Placeholder */}
     {/* URL Shortener Form */}
<section className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
  <h2 className="text-xl font-semibold mb-4">
    Shorten Your URL
  </h2>

  <UrlShortenerForm />
</section>

      {/* Features */}
      <section id="features">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h3 className="font-semibold text-lg mb-2">
              Fast Short Links
            </h3>
            <p className="text-zinc-400">
              Convert long URLs into clean shareable links instantly.
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h3 className="font-semibold text-lg mb-2">
              Analytics
            </h3>
            <p className="text-zinc-400">
              Track clicks, devices, and traffic sources.
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h3 className="font-semibold text-lg mb-2">
              QR Code
            </h3>
            <p className="text-zinc-400">
              Generate QR codes for each short link.
            </p>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="grid md:grid-cols-3 gap-6 text-center">

          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <h3 className="text-4xl font-bold">10K+</h3>
            <p className="text-zinc-400 mt-2">Links Created</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <h3 className="text-4xl font-bold">50K+</h3>
            <p className="text-zinc-400 mt-2">Clicks Tracked</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <h3 className="text-4xl font-bold">99.9%</h3>
            <p className="text-zinc-400 mt-2">Uptime</p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-zinc-900 border border-zinc-800 rounded-3xl p-12">
        <h2 className="text-4xl font-bold">
          Start shortening smarter today
        </h2>

        <p className="text-zinc-400 mt-4">
          Build cleaner links and track performance.
        </p>

        <a
          href="/register"
          className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-xl font-medium"
        >
          Create Account
        </a>
      </section>

    </div>
  );
}