import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
    setShowMenu(false);
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
          <span className="text-2xl font-display tracking-widest gradient-text">SKYLINERS</span>
          <span className="text-xs text-white/40 uppercase tracking-widest mt-1">Hub</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}
              className={`transition-colors hover:text-glow ${location.pathname === link.to ? "text-glow" : "text-white/70"}`}>
              {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-gold hover:text-yellow-300 font-semibold transition-colors">
              ⚡ Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Social icons */}
          <a href="https://www.tiktok.com/@kirinyaga_rollball_?_r=1&_t=ZS-94f73hzHoft"
            target="_blank" rel="noopener noreferrer"
            className="text-white/40 hover:text-white transition-colors hidden md:block" title="TikTok">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/kirinyaga_rollball_ke?igsh=NGpxaGZlb2RrOWts"
            target="_blank" rel="noopener noreferrer"
            className="text-white/40 hover:text-white transition-colors hidden md:block" title="Instagram">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-glow/50" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-glow/20 border border-glow/30 flex items-center justify-center text-glow font-bold text-sm">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-white/70 hidden md:block">{user.name}</span>
                <span className="text-white/30 text-xs">▾</span>
              </button>

              {/* Dropdown */}
              {showMenu && (
                <div className="absolute right-0 top-12 w-48 glass-card border border-white/10 rounded-xl overflow-hidden shadow-glass z-50">
                  <Link to="/profile" onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                    👤 My Profile
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gold hover:bg-white/5 transition-all">
                      ⚡ Dashboard
                    </Link>
                  )}
                  <div className="border-t border-white/10" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-all">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors px-3 py-2">Login</Link>
              <Link to="/register" className="glow-btn text-sm">Join Team</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
