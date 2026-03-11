import { useEffect, useState } from "react";
import { getPlayers, deletePlayer } from "../../services/playerService";
import api from "../../services/api";

const emptyForm = {
  name: "", jerseyNumber: "", position: "Keeper", gender: "Male",
  bio: "", dateOfBirth: "", yearJoined: "", achievements: "",
};

export default function ManagePlayers() {
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const positions = ["Keeper", "Center", "Two", "Zero", "Captain", "Vice Captain"];
  const load = () => getPlayers().then((r) => setPlayers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) { setPhotoFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => { if (val) formData.append(key, val); });
      if (photoFile) formData.append("photo", photoFile);
      if (editing) {
        await api.put(`/players/${editing}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        setMessage("✅ Player updated!");
      } else {
        await api.post("/players", formData, { headers: { "Content-Type": "multipart/form-data" } });
        setMessage("✅ Player added!");
      }
      setForm(emptyForm);
      setPhotoFile(null);
      setPreview("");
      setEditing(null);
      load();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Error"));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEdit = (player) => {
    setEditing(player._id);
    setForm({
      name: player.name,
      jerseyNumber: player.jerseyNumber,
      position: player.position,
      gender: player.gender || "Male",
      bio: player.bio || "",
      dateOfBirth: player.dateOfBirth ? player.dateOfBirth.split("T")[0] : "",
      yearJoined: player.yearJoined || "",
      achievements: player.achievements?.join(", ") || "",
    });
    setPreview(player.photo || "");
    setPhotoFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this player?")) return;
    await deletePlayer(id);
    load();
  };

  const boys = players.filter((p) => p.gender === "Male");
  const girls = players.filter((p) => p.gender === "Female");

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Admin Panel</p>
          <h1 className="font-display text-5xl gradient-text tracking-wider">MANAGE PLAYERS</h1>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.startsWith("✅") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
            {message}
          </div>
        )}

        {/* Form */}
        <div className="glass-card glow-border p-8 mb-10">
          <h2 className="font-display text-2xl gradient-text tracking-wider mb-6">
            {editing ? "EDIT PLAYER" : "ADD NEW PLAYER"}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="input-dark" placeholder="Player name" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Jersey Number *</label>
              <input name="jerseyNumber" value={form.jerseyNumber} onChange={handleChange} required type="number" className="input-dark" placeholder="e.g. 7" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Position *</label>
              <select name="position" value={form.position} onChange={handleChange} className="input-dark">
                {positions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="input-dark">
                <option value="Male">Male — Boys Team</option>
                <option value="Female">Female — Girls Team</option>
              </select>
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Date of Birth</label>
              <input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} type="date" className="input-dark" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Year Joined</label>
              <input name="yearJoined" value={form.yearJoined} onChange={handleChange} type="number" className="input-dark" placeholder="e.g. 2021" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Achievements (comma separated)</label>
              <input name="achievements" value={form.achievements} onChange={handleChange} className="input-dark" placeholder="Best Player 2023, Top Scorer 2022" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Player Photo</label>
              <div className="flex items-center gap-4">
                {preview && <img src={preview} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-glow/30" />}
                <label className="cursor-pointer glow-btn text-sm px-4 py-2">
                  {preview ? "Change Photo" : "Upload Photo"}
                  <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} className="input-dark h-24 resize-none" placeholder="Short player biography..." />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={loading} className="glow-btn px-8 py-3">
                {loading ? "Saving..." : editing ? "Update Player" : "Add Player"}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); setPreview(""); setPhotoFile(null); }}
                  className="border border-white/20 text-white/60 px-8 py-3 rounded-lg hover:border-white/40 transition-all">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Boys Team */}
        <div className="glass-card glow-border p-6 mb-6">
          <h2 className="font-display text-2xl gradient-text tracking-wider mb-6">
            👦 BOYS TEAM ({boys.length})
          </h2>
          {boys.length === 0 ? (
            <p className="text-white/30 text-center py-6">No boys players added yet</p>
          ) : (
            <div className="space-y-3">
              {boys.map((player) => (
                <div key={player._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover border border-glow/30" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-glow/20 border border-glow/30 flex items-center justify-center text-glow font-bold">
                        {player.jerseyNumber}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white">{player.name}</p>
                      <p className="text-white/40 text-xs uppercase tracking-wider">{player.position}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(player)} className="text-xs border border-blue-500/30 text-blue-400 px-3 py-1 rounded-lg hover:border-blue-500 transition-all">Edit</button>
                    <button onClick={() => handleDelete(player._id)} className="text-xs border border-red-500/30 text-red-400 px-3 py-1 rounded-lg hover:border-red-500 transition-all">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Girls Team */}
        <div className="glass-card border border-pink-500/20 p-6">
          <h2 className="font-display text-2xl tracking-wider mb-6" style={{ color: "#f472b6" }}>
            👧 GIRLS TEAM ({girls.length})
          </h2>
          {girls.length === 0 ? (
            <p className="text-white/30 text-center py-6">No girls players added yet</p>
          ) : (
            <div className="space-y-3">
              {girls.map((player) => (
                <div key={player._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover border border-pink-500/30" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold">
                        {player.jerseyNumber}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white">{player.name}</p>
                      <p className="text-pink-400/60 text-xs uppercase tracking-wider">{player.position}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(player)} className="text-xs border border-blue-500/30 text-blue-400 px-3 py-1 rounded-lg hover:border-blue-500 transition-all">Edit</button>
                    <button onClick={() => handleDelete(player._id)} className="text-xs border border-red-500/30 text-red-400 px-3 py-1 rounded-lg hover:border-red-500 transition-all">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
