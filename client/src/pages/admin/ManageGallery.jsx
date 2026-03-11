import { useEffect, useState } from "react";
import { getPhotos, getPendingPhotos, approvePhoto, deletePhoto } from "../../services/galleryService";
import api from "../../services/api";

export default function ManageGallery() {
  const [photos, setPhotos] = useState([]);
  const [pending, setPending] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("other");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState("approved");

  const load = async () => {
    getPhotos().then((r) => setPhotos(r.data)).catch(() => {});
    getPendingPhotos().then((r) => setPending(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Please select an image");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);
      formData.append("category", category);
      await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Photo uploaded!");
      setFile(null);
      setPreview("");
      setCaption("");
      load();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Error"));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleApprove = async (id) => {
    await approvePhoto(id);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this photo?")) return;
    await deletePhoto(id);
    load();
  };

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Admin Panel</p>
          <h1 className="font-display text-5xl gradient-text tracking-wider">MANAGE GALLERY</h1>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.startsWith("✅") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
            {message}
          </div>
        )}

        {/* Upload Form */}
        <div className="glass-card glow-border p-8 mb-10">
          <h2 className="font-display text-2xl gradient-text tracking-wider mb-6">UPLOAD PHOTO</h2>
          <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Photo *</label>
              <div className="flex items-center gap-6">
                {preview && (
                  <img src={preview} alt="preview" className="w-24 h-24 rounded-lg object-cover border border-glow/30" />
                )}
                <label className="cursor-pointer glow-btn text-sm px-6 py-2">
                  {preview ? "Change Photo" : "Select Photo"}
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Caption</label>
              <input value={caption} onChange={(e) => setCaption(e.target.value)} className="input-dark" placeholder="Optional caption..." />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-dark">
                <option value="match">Match</option>
                <option value="training">Training</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="glow-btn px-8 py-3">
                {loading ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
          </form>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {["approved", "pending"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border capitalize ${
                tab === t ? "bg-glow border-glow text-white" : "border-white/10 text-white/50 hover:border-glow/50"
              }`}>
              {t} ({t === "approved" ? photos.length : pending.length})
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(tab === "approved" ? photos : pending).map((photo) => (
            <div key={photo._id} className="glass-card overflow-hidden group relative">
              <img src={photo.imageUrl} alt={photo.caption} className="w-full h-40 object-cover" />
              <div className="p-3">
                {photo.caption && <p className="text-white/50 text-xs truncate">{photo.caption}</p>}
                <p className="text-white/30 text-xs capitalize">{photo.category}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {tab === "pending" && (
                  <button onClick={() => handleApprove(photo._id)}
                    className="bg-green-500/80 text-white text-xs px-2 py-1 rounded">
                    ✓
                  </button>
                )}
                <button onClick={() => handleDelete(photo._id)}
                  className="bg-red-500/80 text-white text-xs px-2 py-1 rounded">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
