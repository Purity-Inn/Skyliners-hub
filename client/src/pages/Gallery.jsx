import { useEffect, useState } from "react";
import { getPhotos, uploadPhoto } from "../services/galleryService";
import { useAuth } from "../context/AuthContext";

export default function Gallery() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ caption: "", category: "other" });
  const [imageFile, setImageFile] = useState(null);

  const categories = ["all", "match", "training", "event", "other"];

  useEffect(() => {
    getPhotos(filter === "all" ? undefined : filter)
      .then((r) => setPhotos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  const canUpload = user && ["admin", "member"].includes(user.role);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      setMessage("❌ Please choose a photo first.");
      return;
    }

    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", form.caption);
      formData.append("category", form.category);
      await uploadPhoto(formData);
      setForm({ caption: "", category: "other" });
      setImageFile(null);
      setMessage(user.role === "admin" ? "✅ Photo uploaded." : "✅ Photo submitted for admin approval.");
      if (user.role === "admin") {
        const refreshed = await getPhotos(filter === "all" ? undefined : filter);
        setPhotos(refreshed.data);
      }
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || "Upload failed"}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Team Memories</p>
          <h1 className="font-display text-6xl gradient-text tracking-wider">GALLERY</h1>
        </div>

        {canUpload && (
          <div className="glass-card glow-border p-6 mb-8 max-w-3xl mx-auto">
            <h2 className="font-display text-2xl gradient-text tracking-wider mb-4">UPLOAD TEAM PHOTO</h2>
            {message && (
              <div className={`p-3 rounded-lg mb-4 text-sm ${message.startsWith("✅") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Photo *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                  className="input-dark"
                  required
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className="input-dark"
                >
                  {categories.filter((cat) => cat !== "all").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Caption</label>
                <input
                  value={form.caption}
                  onChange={(event) => setForm({ ...form, caption: event.target.value })}
                  className="input-dark"
                  placeholder="Optional caption"
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={uploading} className="glow-btn px-6 py-3">
                  {uploading ? "Uploading..." : "Upload Photo"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-3 mb-8 justify-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setLoading(true); }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border capitalize ${
                filter === cat
                  ? "bg-glow border-glow text-white shadow-glow"
                  : "border-white/10 text-white/50 hover:border-glow/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-white/40 py-20">Loading gallery...</div>
        ) : photos.length === 0 ? (
          <div className="text-center text-white/40 py-20">No photos yet</div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {photos.map((photo) => (
              <div
                key={photo._id}
                className="break-inside-avoid glass-card overflow-hidden cursor-pointer group hover:shadow-glow transition-all duration-300"
                onClick={() => setSelected(photo)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {photo.caption && (
                  <p className="p-3 text-white/50 text-xs">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selected.imageUrl}
              alt={selected.caption}
              className="w-full rounded-xl shadow-glow"
            />
            {selected.caption && (
              <p className="text-white/60 text-center mt-4">{selected.caption}</p>
            )}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
