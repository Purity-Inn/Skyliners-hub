import { useEffect, useState } from "react";
import { getAnnouncements } from "../services/announcementService";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnnouncements()
      .then((r) => setAnnouncements(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Stay Updated</p>
          <h1 className="font-display text-6xl gradient-text tracking-wider">NEWS & UPDATES</h1>
        </div>

        {loading ? (
          <div className="text-center text-white/40 py-20">Loading...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center text-white/40 py-20">No announcements yet</div>
        ) : (
          <div className="space-y-6">
            {announcements.map((a, i) => (
              <div
                key={a._id}
                className={`glass-card p-6 hover:glow-border transition-all duration-300 ${a.pinned ? "border border-gold/30" : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {a.pinned && (
                      <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full mb-3 inline-block">
                        📌 Pinned
                      </span>
                    )}
                    <h3 className="font-semibold text-xl mb-3 text-white">{a.title}</h3>
                    <p className="text-white/60 leading-relaxed">{a.body}</p>
                    <div className="flex gap-4 mt-4 text-white/30 text-xs">
                      <span>📅 {new Date(a.createdAt).toDateString()}</span>
                      {a.createdBy && <span>✍️ {a.createdBy.name}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
