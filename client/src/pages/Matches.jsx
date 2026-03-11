import { useEffect, useState } from "react";
import { getMatches } from "../services/matchService";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getMatches(filter === "all" ? undefined : filter)
      .then((r) => setMatches(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  const outcomeColor = (outcome) => {
    if (outcome === "win") return "text-green-400 bg-green-400/10 border-green-400/30";
    if (outcome === "loss") return "text-red-400 bg-red-400/10 border-red-400/30";
    if (outcome === "draw") return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    return "text-glow bg-glow/10 border-glow/30";
  };

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Season 2024</p>
          <h1 className="font-display text-6xl gradient-text tracking-wider">MATCHES</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 mb-8 justify-center flex-wrap">
          {["all", "upcoming", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setLoading(true); }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border capitalize ${
                filter === s
                  ? "bg-glow border-glow text-white shadow-glow"
                  : "border-white/10 text-white/50 hover:border-glow/50 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-white/40 py-20">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="text-center text-white/40 py-20">No matches found</div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match._id} className="glass-card glow-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-glow transition-all duration-300">
                <div className="flex-1">
                  <p className="text-glow text-xs uppercase tracking-widest mb-1">{match.competition}</p>
                  <h3 className="text-xl font-semibold">
                    Skyliners <span className="text-white/30 mx-2">vs</span> {match.opponent}
                  </h3>
                  <div className="flex gap-4 mt-2 text-white/40 text-sm">
                    <span>📅 {new Date(match.date).toDateString()}</span>
                    <span>📍 {match.venue}</span>
                  </div>
                  {match.notes && (
                    <p className="text-white/30 text-sm mt-2 italic">{match.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {match.status === "completed" && match.result?.outcome ? (
                    <div className="text-center">
                      <p className="font-display text-3xl text-white">
                        {match.result.skylinerScore} — {match.result.opponentScore}
                      </p>
                      <span className={`text-xs border px-3 py-1 rounded-full uppercase font-semibold ${outcomeColor(match.result.outcome)}`}>
                        {match.result.outcome}
                      </span>
                    </div>
                  ) : (
                    <span className={`text-xs border px-3 py-1 rounded-full uppercase font-semibold ${outcomeColor(null)}`}>
                      {match.status}
                    </span>
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
