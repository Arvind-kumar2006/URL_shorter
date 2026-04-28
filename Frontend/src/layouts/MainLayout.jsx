import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function MainLayout({ children }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Navbar */}
      <header className="border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold"
          >
            Snip
          </Link>

          {/* Menu */}
          <nav className="flex items-center gap-8 text-sm">

            <Link
              to="/"
              className="text-zinc-300 hover:text-white"
            >
              Home
            </Link>

            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-zinc-300 hover:text-white"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-white text-black rounded-xl font-medium hover:opacity-90"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-zinc-300 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 bg-white text-black rounded-xl font-medium hover:opacity-90"
                >
                  Register
                </Link>
              </>
            )}

          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between text-sm text-zinc-500">
          <p>© 2026 Snip</p>
          <p>Built by Arvind</p>
        </div>
      </footer>

    </div>
  );
}