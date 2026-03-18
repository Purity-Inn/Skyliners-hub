import { useEffect, useState } from "react";
import { getLeadership, updateLeadership } from "../../services/leadershipService";

const emptyForm = {
  coach: "To Be Announced",
  menCaptain: "To Be Announced",
  womenCaptain: "To Be Announced",
  menViceCaptain: "To Be Announced",
  treasurer: "To Be Announced",
  socialMediaManager: "To Be Announced",
};

export default function ManageLeadership() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getLeadership()
      .then((response) => {
        setForm({
          coach: response.data.coach || "To Be Announced",
          menCaptain: response.data.menCaptain || "To Be Announced",
          womenCaptain: response.data.womenCaptain || "To Be Announced",
          menViceCaptain: response.data.menViceCaptain || "To Be Announced",
          treasurer: response.data.treasurer || "To Be Announced",
          socialMediaManager: response.data.socialMediaManager || "To Be Announced",
        });
      })
      .catch(() => {});
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await updateLeadership(form);
      setMessage("✅ Leadership board updated!");
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Error"));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Admin Panel</p>
          <h1 className="font-display text-5xl gradient-text tracking-wider">LEADERSHIP BOARD</h1>
          <p className="text-white/40 mt-2">Manage who appears on the homepage leadership board</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.startsWith("✅") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
            {message}
          </div>
        )}

        <div className="glass-card glow-border p-8">
          <h2 className="font-display text-2xl gradient-text tracking-wider mb-6">UPDATE LEADERSHIP</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Coach</label>
              <input name="coach" value={form.coach} onChange={handleChange} className="input-dark" placeholder="Coach name" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Captain — Men Team</label>
              <input name="menCaptain" value={form.menCaptain} onChange={handleChange} className="input-dark" placeholder="Men captain name" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Captain — Women Team</label>
              <input name="womenCaptain" value={form.womenCaptain} onChange={handleChange} className="input-dark" placeholder="Women captain name" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Vice Captain — Men Team</label>
              <input name="menViceCaptain" value={form.menViceCaptain} onChange={handleChange} className="input-dark" placeholder="Men vice captain name" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Treasurer</label>
              <input name="treasurer" value={form.treasurer} onChange={handleChange} className="input-dark" placeholder="Treasurer name" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Social Media Manager</label>
              <input name="socialMediaManager" value={form.socialMediaManager} onChange={handleChange} className="input-dark" placeholder="Social media manager name" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="glow-btn px-8 py-3">
                {loading ? "Saving..." : "Save Leadership Board"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
