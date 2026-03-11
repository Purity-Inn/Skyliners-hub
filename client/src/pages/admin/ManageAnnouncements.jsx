import { useEffect, useState } from "react";
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "../../services/announcementService";

const emptyForm = { title: "", body: "", pinned: false };

export default function ManageAnnouncements() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => getAnnouncements().then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await updateAnnouncement(editing, form);
        setMessage("✅ Announcement updated!");
      } else {
        await createAnnouncement(form);
        setMessage("✅ Announcement posted!");
      }
      setForm(emptyForm);
      setEditing(null);
      load();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Error"));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEdit = (item) => {
    setEditing(item._id);
    setForm({ title: item.title, body: item.body, pinned: item.pinned });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    await deleteAnnouncement(id);
    load();
  };

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Admin Panel</p>
          <h1 className="font-display text-5xl gradient-text tracking-wider">ANNOUNCEMENTS</h1>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.startsWith("✅") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
            {message}
          </div>
        )}

        <div className="glass-card glow-border p-8 mb-10">
          <h2 className="font-display text-2xl gradient-text tracking-wider mb-6">
            {editing ? "EDIT ANNOUNCEMENT" : "NEW ANNOUNCEMENT"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required className="input-dark" placeholder="Announcement title" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Body *</label>
              <textarea name="body" value={form.body} onChange={handleChange} required className="input-dark h-32 resize-none" placeholder="Write your announcement here..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="pinned" id="pinned" checked={form.pinned} onChange={handleChange} className="w-4 h-4 accent-orange-500" />
              <label htmlFor="pinned" className="text-white/60 text-sm">Pin this announcement to the top</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="glow-btn px-8 py-3">
                {loading ? "Saving..." : editing ? "Update" : "Post Announcement"}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); }}
                  className="border border-white/20 text-white/60 px-8 py-3 rounded-lg hover:border-white/40 transition-all">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="glass-card glow-border p-6">
          <h2 className="font-display text-2xl gradient-text tracking-wider mb-6">ALL ANNOUNCEMENTS ({items.length})</h2>
          {items.length === 0 ? (
            <p className="text-white/30 text-center py-10">No announcements yet</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="flex items-start justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {item.pinned && <span className="text-xs text-gold">📌</span>}
                      <p className="font-semibold text-white">{item.title}</p>
                    </div>
                    <p className="text-white/40 text-sm line-clamp-2">{item.body}</p>
                    <p className="text-white/20 text-xs mt-1">{new Date(item.createdAt).toDateString()}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(item)}
                      className="text-xs border border-blue-500/30 text-blue-400 px-3 py-1 rounded-lg hover:border-blue-500 transition-all">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)}
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
