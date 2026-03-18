import { useEffect, useState } from "react";
import { getHof, createHof, updateHof, deleteHof } from "../../services/hofService";

const emptyForm = { name: "", photo: "", position: "", yearsActive: "", achievements: "", tribute: "" };

export default function ManageHof() {
  const [legends, setLegends] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => getHof().then((r) => setLegends(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", form.name || "");
      payload.append("position", form.position || "");
      payload.append("yearsActive", form.yearsActive || "");
      payload.append("tribute", form.tribute || "");
      payload.append("achievements", form.achievements || "");

      if (photoFile) {
        payload.append("photo", photoFile);
      } else if (form.photo) {
        payload.append("photo", form.photo);
      }

      if (editing) {
        await updateHof(editing, payload);
        setMessage("✅ Legend updated!");
      } else {
        await createHof(payload);
        setMessage("✅ Legend added!");
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

  const handleEdit = (legend) => {
    setEditing(legend._id);
    setForm({
      name: legend.name,
      photo: legend.photo || "",
      position: legend.position || "",
      yearsActive: legend.yearsActive || "",
      achievements: legend.achievements?.join(", ") || "",
      tribute: legend.tribute || "",
    });
    setPhotoFile(null);
    setPreview(legend.photo || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this legend?")) return;
    await deleteHof(id);
    load();
  };

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-gold uppercase tracking-widest text-sm mb-2">Admin Panel</p>
          <h1 className="font-display text-5xl tracking-wider" style={{ color: "#fbbf24" }}>HALL OF FAME</h1>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.startsWith("✅") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
            {message}
          </div>
        )}

        <div className="glass-card border border-gold/20 p-8 mb-10">
          <h2 className="font-display text-2xl text-gold tracking-wider mb-6">
            {editing ? "EDIT LEGEND" : "ADD NEW LEGEND"}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="input-dark" placeholder="Legend's name" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Position</label>
              <input name="position" value={form.position} onChange={handleChange} className="input-dark" placeholder="e.g. Forward" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Years Active</label>
              <input name="yearsActive" value={form.yearsActive} onChange={handleChange} className="input-dark" placeholder="e.g. 2018 - 2022" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Profile Photo</label>
              <div className="flex items-center gap-4">
                {preview && <img src={preview} alt="legend preview" className="w-16 h-16 rounded-full object-cover border-2 border-gold/40" />}
                <label className="cursor-pointer glow-btn text-sm px-4 py-2">
                  {preview ? "Change Photo" : "Upload Photo"}
                  <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                </label>
              </div>
              <p className="text-white/30 text-xs mt-2">You can also paste an image URL below (optional)</p>
              <input name="photo" value={form.photo} onChange={handleChange} className="input-dark mt-2" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Achievements (comma separated)</label>
              <input name="achievements" value={form.achievements} onChange={handleChange} className="input-dark" placeholder="MVP 2021, Top Scorer 2020" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Tribute Message</label>
              <textarea name="tribute" value={form.tribute} onChange={handleChange} className="input-dark h-24 resize-none" placeholder="A short message about their legacy..." />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={loading} className="glow-btn px-8 py-3">
                {loading ? "Saving..." : editing ? "Update Legend" : "Add to Hall of Fame"}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); setPhotoFile(null); setPreview(""); }}
                  className="border border-white/20 text-white/60 px-8 py-3 rounded-lg hover:border-white/40 transition-all">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="glass-card border border-gold/20 p-6">
          <h2 className="font-display text-2xl text-gold tracking-wider mb-6">LEGENDS ({legends.length})</h2>
          {legends.length === 0 ? (
            <p className="text-white/30 text-center py-10">No legends added yet</p>
          ) : (
            <div className="space-y-3">
              {legends.map((legend) => (
                <div key={legend._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <div>
                    <p className="font-semibold text-gold">{legend.name}</p>
                    <p className="text-white/40 text-xs">{legend.position} · {legend.yearsActive}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(legend)}
                      className="text-xs border border-blue-500/30 text-blue-400 px-3 py-1 rounded-lg hover:border-blue-500 transition-all">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(legend._id)}
                      className="text-xs border border-red-500/30 text-red-400 px-3 py-1 rounded-lg hover:border-red-500 transition-all">
                      Delete
                    </button>
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
