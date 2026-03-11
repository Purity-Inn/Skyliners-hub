import { useEffect, useState } from "react";
import { getHof } from "../services/hofService";

export default function HallOfFame() {
  const [legends, setLegends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHof()
      .then((r) => setLegends(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold uppercase tracking-widest text-sm mb-2">Legends Never Die</p>
          <h1 className="font-display text-6xl tracking-wider" style={{ color: "#fbbf24" }}>
            HALL OF FAME
          </h1>
          <p className="text-white/40 mt-3">Honoring the players who built the Skyliners legacy</p>
        </div>

        {loading ? (
          <div className="text-center text-white/40 py-20">Loading legends...</div>
        ) : legends.length === 0 ? (
          <div className="text-center text-white/40 py-20">No legends added yet</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legends.map((legend, i) => (
              <div
                key={legend._id}
                className="glass-card border border-gold/20 hover:border-gold/50 transition-all duration-300 overflow-hidden group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Photo */}
                <div className="h-56 bg-navy relative overflow-hidden">
                  {legend.photo ? (
                    <img
                      src={legend.photo}
                      alt={legend.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-8xl text-gold/20">{legend.name[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
                  {/* Gold badge */}
                  <div className="absolute top-3 left-3 bg-gold/20 border border-gold/40 text-gold text-xs px-2 py-1 rounded-full">
                    ⭐ Legend
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-display text-2xl text-gold tracking-wider">{legend.name.toUpperCase()}</h3>
                  {legend.position && (
                    <p className="text-white/50 text-xs uppercase tracking-wider mt-1">{legend.position}</p>
                  )}
                  {legend.yearsActive && (
                    <p className="text-white/30 text-xs mt-1">🗓 {legend.yearsActive}</p>
                  )}
                  {legend.tribute && (
                    <p className="text-white/50 text-sm mt-3 leading-relaxed italic">"{legend.tribute}"</p>
                  )}
                  {legend.achievements?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {legend.achievements.map((a, j) => (
                        <span key={j} className="text-xs bg-gold/10 text-gold border border-gold/20 px-2 py-1 rounded-full">
                          🏆 {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
