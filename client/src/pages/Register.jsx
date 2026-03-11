import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const res = await register(form);
      loginUser(res.data, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">

      {/* ===== LEFT SIDE — BIG IMAGE ===== */}
      <div className="hidden lg:flex lg:w-3/5 relative">
        <img
          src="https://res.cloudinary.com/dnojvuwz1/image/upload/v1773220696/316cb3a1f43df08cf73a74ba32644735_t8qgc5.jpg"
          alt="Skyliners Team"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/80" />

        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            animation: "gridMove 8s linear infinite",
          }}
        />

        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-glow/15 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 flex flex-col justify-end p-12 w-full">
          <div className="mb-6">
            <p className="text-glow uppercase tracking-[0.4em] text-sm mb-2">Join Us Today</p>
            <h1 className="font-display text-8xl gradient-text tracking-wider leading-none">
              BE A<br />SKY<br />LINER
            </h1>
          </div>

          <div className="glass-card border border-white/10 p-4 max-w-sm">
            <p className="text-white/70 text-sm italic leading-relaxed">
              "Be part of something bigger. The Skyliners are more than a team — we are a legacy."
            </p>
            <p className="text-glow text-xs mt-2 uppercase tracking-wider">— Coach, Skyliners</p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE — REGISTER FORM ===== */}
      <div className="w-full lg:w-2/5 bg-primary flex items-center justify-center px-8 py-12 relative">

        <div className="lg:hidden absolute inset-0">
          <img
            src="https://res.cloudinary.com/dnojvuwz1/image/upload/v1773220696/316cb3a1f43df08cf73a74ba32644735_t8qgc5.jpg"
            alt="bg"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-primary/80" />
        </div>

        <div className="relative z-10 w-full max-w-sm animate-fade-up">
          <div className="lg:hidden text-center mb-8">
            <h1 className="font-display text-5xl gradient-text tracking-widest">SKYLINERS</h1>
            <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Kirinyaga University</p>
          </div>

          <h2 className="font-display text-3xl text-white tracking-wider mb-1">CREATE ACCOUNT</h2>
          <p className="text-white/30 text-sm mb-8">Join the Skyliners Hub today</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="input-dark" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-dark" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} className="input-dark" placeholder="Min 6 characters" />
            </div>
            <button type="submit" disabled={loading} className="glow-btn w-full py-3 text-base">
              {loading ? "Creating account..." : "Join the Team →"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/30 text-sm">
              Already a member?{" "}
              <Link to="/login" className="text-glow hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
      `}</style>
    </div>
  );
}
