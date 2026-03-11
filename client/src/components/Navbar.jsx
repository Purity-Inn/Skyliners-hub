import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navLinks = [
    { to: "/players", label: "Players" },
    { to: "/matches", label: "Matches" },
    { to: "/gallery", label: "Gallery" },
    { to: "/hall-of-fame", label: "Hall of Fame" },
    { to: "/announcements", label: "News" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display tracking-widest gradient-text">
            SKYLINERS
          </span>
          <span className="text-xs text-white/40 uppercase tracking-widest mt-1">Hub</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors hover:text-glow ${
                location.pathname === link.to ? "text-glow" : "text-white/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-gold hover:text-yellow-300 font-semibold transition-colors"
            >
              ⚡ Dashboard
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-white/60 hidden md:block">
                👋 <span className="text-glow font-semibold">{user.name}</span>
              </span>
              <button onClick={handleLogout} className="glow-btn text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-white/70 hover:text-white transition-colors px-3 py-2"
              >
                Login
              </Link>
              <Link to="/register" className="glow-btn text-sm">
                Join Team
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
