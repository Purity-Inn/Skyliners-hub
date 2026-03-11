import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPlayer } from "../services/playerService";

export default function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlayer(id)
      .then((r) => setPlayer(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-primary flex items-center justify-center text-white/40">Loading...</div>;
  if (!player) return <div className="min-h-screen bg-primary flex items-center justify-center text-white/40">Player not found</div>;

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/players" className="text-glow text-sm hover:underline mb-8 inline-block">
          ← Back to Squad
        </Link>

        <div className="glass-card glow-border overflow-hidden">
          <div className="md:flex">
            {/* Photo */}
            <div className="md:w-72 h-80 md:h-auto bg-navy relative flex-shrink-0">
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-9xl gradient-text opacity-30">{player.name[0]}</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-glow/90 text-white font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-glow">
                {player.jerseyNumber}
              </div>
            </div>

            {/* Info */}
            <div className="p-8 flex-1">
              <p className="text-glow uppercase tracking-widest text-xs mb-1">{player.position}</p>
              <h1 className="font-display text-5xl gradient-text tracking-wider mb-4">{player.name.toUpperCase()}</h1>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {player.yearJoined && (
                  <div className="glass-card p-3">
                    <p className="text-white/40 text-xs uppercase">Year Joined</p>
                    <p className="text-white font-semibold">{player.yearJoined}</p>
                  </div>
                )}
                {player.dateOfBirth && (
                  <div className="glass-card p-3">
                    <p className="text-white/40 text-xs uppercase">Birthday</p>
                    <p className="text-white font-semibold">
                      {new Date(player.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                    </p>
                  </div>
                )}
              </div>

              {player.bio && (
                <p className="text-white/60 text-sm leading-relaxed mb-6">{player.bio}</p>
              )}

              {player.achievements?.length > 0 && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Achievements</p>
                  <div className="flex flex-wrap gap-2">
                    {player.achievements.map((a, i) => (
                      <span key={i} className="text-xs bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full">
                        🏆 {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
