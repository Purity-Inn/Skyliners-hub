import { useEffect, useState } from "react";
import { getLeadership, updateLeadership } from "../../services/leadershipService";
import { getPlayers } from "../../services/playerService";

const emptyForm = {
  coach: "To Be Announced",
  coachPlayer: "",
  menCaptain: "To Be Announced",
  menCaptainPlayer: "",
  womenCaptain: "To Be Announced",
  womenCaptainPlayer: "",
  menViceCaptain: "To Be Announced",
  menViceCaptainPlayer: "",
  treasurer: "To Be Announced",
  treasurerPlayer: "",
  socialMediaManager: "To Be Announced",
  socialMediaManagerPlayer: "",
};

export default function ManageLeadership() {
  const [form, setForm] = useState(emptyForm);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getPlayers().then((response) => setPlayers(response.data || [])).catch(() => {});

    getLeadership()
      .then((response) => {
        setForm({
          coach: response.data.coach || "To Be Announced",
          coachPlayer: response.data.coachPlayer?._id || response.data.coachPlayer || "",
          menCaptain: response.data.menCaptain || "To Be Announced",
          menCaptainPlayer: response.data.menCaptainPlayer?._id || response.data.menCaptainPlayer || "",
          womenCaptain: response.data.womenCaptain || "To Be Announced",
          womenCaptainPlayer: response.data.womenCaptainPlayer?._id || response.data.womenCaptainPlayer || "",
          menViceCaptain: response.data.menViceCaptain || "To Be Announced",
          menViceCaptainPlayer: response.data.menViceCaptainPlayer?._id || response.data.menViceCaptainPlayer || "",
          treasurer: response.data.treasurer || "To Be Announced",
          treasurerPlayer: response.data.treasurerPlayer?._id || response.data.treasurerPlayer || "",
          socialMediaManager: response.data.socialMediaManager || "To Be Announced",
          socialMediaManagerPlayer: response.data.socialMediaManagerPlayer?._id || response.data.socialMediaManagerPlayer || "",
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

  const menPlayers = players.filter((player) => player.gender === "Male");
  const womenPlayers = players.filter((player) => player.gender === "Female");

  const renderPlayerSelect = (name, label, options) => (
    <div>
      <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">{label} Profile</label>
      <select name={name} value={form[name]} onChange={handleChange} className="input-dark">
        <option value="">No player selected</option>
        {options.map((player) => (
          <option key={player._id} value={player._id}>
            {player.name} • #{player.jerseyNumber} • {player.position}
          </option>
        ))}
      </select>
    </div>
  );

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
            {renderPlayerSelect("coachPlayer", "Coach", players)}
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Coach (fallback text)</label>
              <input name="coach" value={form.coach} onChange={handleChange} className="input-dark" placeholder="Shown if no player profile is selected" />
            </div>

            {renderPlayerSelect("menCaptainPlayer", "Captain — Men Team", menPlayers)}
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Captain — Men Team (fallback text)</label>
              <input name="menCaptain" value={form.menCaptain} onChange={handleChange} className="input-dark" placeholder="Shown if no player profile is selected" />
            </div>

            {renderPlayerSelect("womenCaptainPlayer", "Captain — Women Team", womenPlayers)}
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Captain — Women Team (fallback text)</label>
              <input name="womenCaptain" value={form.womenCaptain} onChange={handleChange} className="input-dark" placeholder="Shown if no player profile is selected" />
            </div>

            {renderPlayerSelect("menViceCaptainPlayer", "Vice Captain — Men Team", menPlayers)}
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Vice Captain — Men Team (fallback text)</label>
              <input name="menViceCaptain" value={form.menViceCaptain} onChange={handleChange} className="input-dark" placeholder="Shown if no player profile is selected" />
            </div>

            {renderPlayerSelect("treasurerPlayer", "Treasurer", players)}
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Treasurer (fallback text)</label>
              <input name="treasurer" value={form.treasurer} onChange={handleChange} className="input-dark" placeholder="Shown if no player profile is selected" />
            </div>

            {renderPlayerSelect("socialMediaManagerPlayer", "Social Media Manager", players)}
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Social Media Manager (fallback text)</label>
              <input name="socialMediaManager" value={form.socialMediaManager} onChange={handleChange} className="input-dark" placeholder="Shown if no player profile is selected" />
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
