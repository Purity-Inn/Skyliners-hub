import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(form);
      loginUser(res.data, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">

      {/* ===== LEFT SIDE — BIG BACKGROUND IMAGE ===== */}
      <div className="hidden lg:flex lg:w-3/5 relative">

        {/* Background image — swap this URL with your actual team photo */}
        <img
          src="https://res.cloudinary.com/dnojvuwz1/image/upload/v1773220696/316cb3a1f43df08cf73a74ba32644735_t8qgc5.jpg"
          alt="Skyliners Team"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/80" />

        {/* Animated overlay lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            animation: "gridMove 8s linear infinite",
          }}
        />

        {/* Glow orbs floating */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-glow/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Content on image */}
        <div className="relative z-10 flex flex-col justify-end p-12 w-full">
          {/* Big team name */}
          <div className="mb-6">
            <p className="text-glow uppercase tracking-[0.4em] text-sm font-medium mb-2">
              Kirinyaga University
            </p>
            <h1 className="font-display text-8xl gradient-text tracking-wider leading-none">
              SKY<br />LIN<br />ERS
            </h1>
          </div>

          {/* Quote */}
          <div className="glass-card border border-white/10 p-4 max-w-sm">
            <p className="text-white/70 text-sm italic leading-relaxed">
              "We don't just play the game — we define it. Welcome to the Skyliners family."
            </p>
            <p className="text-glow text-xs mt-2 uppercase tracking-wider">— Skyliners Rollball Team</p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-6">
            {[
              { value: "20+", label: "Players" },
              { value: "50+", label: "Matches" },
              { value: "12", label: "Trophies" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl gradient-text">{s.value}</p>
                <p className="text-white/40 text-xs uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE — LOGIN FORM ===== */}
      <div className="w-full lg:w-2/5 bg-primary flex items-center justify-center px-8 py-12 relative">

        {/* Mobile background */}
        <div className="lg:hidden absolute inset-0">
          <img
            src="https://res.cloudinary.com/dnojvuwz1/image/upload/v1773220696/316cb3a1f43df08cf73a74ba32644735_t8qgc5.jpg"
            alt="bg"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-primary/80" />
        </div>

        <div className="relative z-10 w-full max-w-sm animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="font-display text-5xl gradient-text tracking-widest">SKYLINERS</h1>
            <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Kirinyaga University</p>
          </div>

          <h2 className="font-display text-3xl text-white tracking-wider mb-1">WELCOME BACK</h2>
          <p className="text-white/30 text-sm mb-8">Sign in to your Skyliners account</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="input-dark"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="input-dark"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="glow-btn w-full py-3 text-base">
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/30 text-sm">
              New here?{" "}
              <Link to="/register" className="text-glow hover:underline font-semibold">
                Join the team
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Grid animation keyframe */}
      <style>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
      `}</style>
    </div>
  );
}
