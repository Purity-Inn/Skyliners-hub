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

  const scoreRows = [
    ["P1", "period1"],
    ["P2", "period2"],
    ["P3", "period3"],
    ["P4", "period4"],
    ["OT", "overtime"],
    ["Pen", "penalties"],
  ];

  const calculateTotals = (sheet) => {
    if (!sheet) return { teamAScore: 0, teamBScore: 0, teamAPoints: 0, teamBPoints: 0 };

    return scoreRows.reduce(
      (totals, [, key]) => ({
        teamAScore: totals.teamAScore + Number(sheet[key]?.teamA ?? 0),
        teamBScore: totals.teamBScore + Number(sheet[key]?.teamB ?? 0),
        teamAPoints: totals.teamAPoints + Number(sheet[key]?.teamAPoints ?? 0),
        teamBPoints: totals.teamBPoints + Number(sheet[key]?.teamBPoints ?? 0),
      }),
      { teamAScore: 0, teamBScore: 0, teamAPoints: 0, teamBPoints: 0 }
    );
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
                    {match.teamA || "Skyliners"} <span className="text-white/30 mx-2">vs</span> {match.teamB || match.opponent}
                  </h3>
                  <div className="flex gap-4 mt-2 text-white/40 text-sm">
                    <span>📅 {new Date(match.date).toDateString()}</span>
                    <span>📍 {match.venue}</span>
                  </div>
                  {match.notes && (
                    <p className="text-white/30 text-sm mt-2 italic">{match.notes}</p>
                  )}
                  {match.status === "completed" && match.scoreSheet && (
                    <div className="mt-4 overflow-x-auto rounded-lg border border-white/10">
                      <table className="w-full min-w-[760px] text-xs">
                        <thead className="bg-white/5 text-white/60 uppercase tracking-wider">
                          <tr>
                            <th className="px-3 py-2 text-left">Period</th>
                            <th className="px-3 py-2 text-left">{match.teamA || "Team A"} Score</th>
                            <th className="px-3 py-2 text-left">{match.teamB || match.opponent || "Team B"} Score</th>
                            <th className="px-3 py-2 text-left">{match.teamA || "Team A"} Points</th>
                            <th className="px-3 py-2 text-left">{match.teamB || match.opponent || "Team B"} Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scoreRows.map(([label, key]) => (
                            <tr key={key} className="border-t border-white/10 text-white/70">
                              <td className="px-3 py-2 font-medium">{label}</td>
                              <td className="px-3 py-2">{match.scoreSheet?.[key]?.teamA ?? 0}</td>
                              <td className="px-3 py-2">{match.scoreSheet?.[key]?.teamB ?? 0}</td>
                              <td className="px-3 py-2">{match.scoreSheet?.[key]?.teamAPoints ?? 0}</td>
                              <td className="px-3 py-2">{match.scoreSheet?.[key]?.teamBPoints ?? 0}</td>
                            </tr>
                          ))}
                          <tr className="border-t border-white/20 bg-white/5 text-white">
                            <td className="px-3 py-2 font-semibold">Totals</td>
                            <td className="px-3 py-2 font-semibold">{calculateTotals(match.scoreSheet).teamAScore}</td>
                            <td className="px-3 py-2 font-semibold">{calculateTotals(match.scoreSheet).teamBScore}</td>
                            <td className="px-3 py-2 font-semibold">{calculateTotals(match.scoreSheet).teamAPoints}</td>
                            <td className="px-3 py-2 font-semibold">{calculateTotals(match.scoreSheet).teamBPoints}</td>
                          </tr>
                        </tbody>
                      </table>
                      {match.scoreSheet?.notes ? (
                        <p className="px-3 py-2 border-t border-white/10 text-white/40 text-xs">Notes: {match.scoreSheet.notes}</p>
                      ) : null}
                    </div>
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
