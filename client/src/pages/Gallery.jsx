import { useEffect, useState } from "react";
import { getPhotos } from "../services/galleryService";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const categories = ["all", "match", "training", "event", "other"];

  useEffect(() => {
    getPhotos(filter === "all" ? undefined : filter)
      .then((r) => setPhotos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Team Memories</p>
          <h1 className="font-display text-6xl gradient-text tracking-wider">GALLERY</h1>
        </div>

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
