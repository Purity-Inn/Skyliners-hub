import { useEffect, useState } from "react";
import { getMatches, createMatch, updateMatch, deleteMatch } from "../../services/matchService";

const emptyForm = {
  teamA: "Skyliners", teamB: "", opponent: "", date: "", venue: "",
  competition: "Friendly", status: "upcoming",
  outcome: "", notes: "",
  p1TeamA: "0", p1TeamB: "0",
  p1TeamAPoints: "0", p1TeamBPoints: "0",
  p2TeamA: "0", p2TeamB: "0",
  p2TeamAPoints: "0", p2TeamBPoints: "0",
  p3TeamA: "0", p3TeamB: "0",
  p3TeamAPoints: "0", p3TeamBPoints: "0",
  p4TeamA: "0", p4TeamB: "0",
  p4TeamAPoints: "0", p4TeamBPoints: "0",
  otTeamA: "0", otTeamB: "0",
  otTeamAPoints: "0", otTeamBPoints: "0",
  penTeamA: "0", penTeamB: "0",
  penTeamAPoints: "0", penTeamBPoints: "0",
  scoreSheetNotes: "",
};

export default function ManageMatches() {
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const numberValue = (value) => Number(value || 0);

  const scoreRows = [
    ["period1", "P1", "p1TeamA", "p1TeamB", "p1TeamAPoints", "p1TeamBPoints"],
    ["period2", "P2", "p2TeamA", "p2TeamB", "p2TeamAPoints", "p2TeamBPoints"],
    ["period3", "P3", "p3TeamA", "p3TeamB", "p3TeamAPoints", "p3TeamBPoints"],
    ["period4", "P4", "p4TeamA", "p4TeamB", "p4TeamAPoints", "p4TeamBPoints"],
    ["overtime", "OT", "otTeamA", "otTeamB", "otTeamAPoints", "otTeamBPoints"],
    ["penalties", "Pen", "penTeamA", "penTeamB", "penTeamAPoints", "penTeamBPoints"],
  ];

  const getTotals = () => {
    return scoreRows.reduce(
      (totals, [, , teamAScoreKey, teamBScoreKey, teamAPointsKey, teamBPointsKey]) => ({
        teamAScore: totals.teamAScore + numberValue(form[teamAScoreKey]),
        teamBScore: totals.teamBScore + numberValue(form[teamBScoreKey]),
        teamAPoints: totals.teamAPoints + numberValue(form[teamAPointsKey]),
        teamBPoints: totals.teamBPoints + numberValue(form[teamBPointsKey]),
      }),
      { teamAScore: 0, teamBScore: 0, teamAPoints: 0, teamBPoints: 0 }
    );
  };

  const load = () => getMatches().then((r) => setMatches(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const totals = getTotals();
      const finalOutcome = form.outcome || (
        totals.teamAScore > totals.teamBScore
          ? "win"
          : totals.teamAScore < totals.teamBScore
            ? "loss"
            : "draw"
      );

      const data = {
        teamA: form.teamA,
        teamB: form.teamB,
        opponent: form.teamB,
        date: form.date,
        venue: form.venue,
        competition: form.competition,
        status: form.status,
        notes: form.notes,
        result: form.status === "completed" ? {
          skylinerScore: totals.teamAScore,
          opponentScore: totals.teamBScore,
          outcome: finalOutcome,
        } : undefined,
        scoreSheet: {
          period1: {
            teamA: numberValue(form.p1TeamA),
            teamB: numberValue(form.p1TeamB),
            teamAPoints: numberValue(form.p1TeamAPoints),
            teamBPoints: numberValue(form.p1TeamBPoints),
          },
          period2: {
            teamA: numberValue(form.p2TeamA),
            teamB: numberValue(form.p2TeamB),
            teamAPoints: numberValue(form.p2TeamAPoints),
            teamBPoints: numberValue(form.p2TeamBPoints),
          },
          period3: {
            teamA: numberValue(form.p3TeamA),
            teamB: numberValue(form.p3TeamB),
            teamAPoints: numberValue(form.p3TeamAPoints),
            teamBPoints: numberValue(form.p3TeamBPoints),
          },
          period4: {
            teamA: numberValue(form.p4TeamA),
            teamB: numberValue(form.p4TeamB),
            teamAPoints: numberValue(form.p4TeamAPoints),
            teamBPoints: numberValue(form.p4TeamBPoints),
          },
          overtime: {
            teamA: numberValue(form.otTeamA),
            teamB: numberValue(form.otTeamB),
            teamAPoints: numberValue(form.otTeamAPoints),
            teamBPoints: numberValue(form.otTeamBPoints),
          },
          penalties: {
            teamA: numberValue(form.penTeamA),
            teamB: numberValue(form.penTeamB),
            teamAPoints: numberValue(form.penTeamAPoints),
            teamBPoints: numberValue(form.penTeamBPoints),
          },
          notes: form.scoreSheetNotes || "",
        },
      };
      if (editing) {
        await updateMatch(editing, data);
        setMessage("✅ Match updated!");
      } else {
        await createMatch(data);
        setMessage("✅ Match added!");
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

  const handleEdit = (match) => {
    setEditing(match._id);
    setForm({
      teamA: match.teamA || "Skyliners",
      teamB: match.teamB || match.opponent || "",
      opponent: match.teamB || match.opponent || "",
      date: match.date?.split("T")[0] || "",
      venue: match.venue,
      competition: match.competition,
      status: match.status,
      outcome: match.result?.outcome || "",
      notes: match.notes || "",
      p1TeamA: String(match.scoreSheet?.period1?.teamA ?? 0),
      p1TeamB: String(match.scoreSheet?.period1?.teamB ?? 0),
      p1TeamAPoints: String(match.scoreSheet?.period1?.teamAPoints ?? 0),
      p1TeamBPoints: String(match.scoreSheet?.period1?.teamBPoints ?? 0),
      p2TeamA: String(match.scoreSheet?.period2?.teamA ?? 0),
      p2TeamB: String(match.scoreSheet?.period2?.teamB ?? 0),
      p2TeamAPoints: String(match.scoreSheet?.period2?.teamAPoints ?? 0),
      p2TeamBPoints: String(match.scoreSheet?.period2?.teamBPoints ?? 0),
      p3TeamA: String(match.scoreSheet?.period3?.teamA ?? 0),
      p3TeamB: String(match.scoreSheet?.period3?.teamB ?? 0),
      p3TeamAPoints: String(match.scoreSheet?.period3?.teamAPoints ?? 0),
      p3TeamBPoints: String(match.scoreSheet?.period3?.teamBPoints ?? 0),
      p4TeamA: String(match.scoreSheet?.period4?.teamA ?? 0),
      p4TeamB: String(match.scoreSheet?.period4?.teamB ?? 0),
      p4TeamAPoints: String(match.scoreSheet?.period4?.teamAPoints ?? 0),
      p4TeamBPoints: String(match.scoreSheet?.period4?.teamBPoints ?? 0),
      otTeamA: String(match.scoreSheet?.overtime?.teamA ?? 0),
      otTeamB: String(match.scoreSheet?.overtime?.teamB ?? 0),
      otTeamAPoints: String(match.scoreSheet?.overtime?.teamAPoints ?? 0),
      otTeamBPoints: String(match.scoreSheet?.overtime?.teamBPoints ?? 0),
      penTeamA: String(match.scoreSheet?.penalties?.teamA ?? 0),
      penTeamB: String(match.scoreSheet?.penalties?.teamB ?? 0),
      penTeamAPoints: String(match.scoreSheet?.penalties?.teamAPoints ?? 0),
      penTeamBPoints: String(match.scoreSheet?.penalties?.teamBPoints ?? 0),
      scoreSheetNotes: match.scoreSheet?.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this match?")) return;
    await deleteMatch(id);
    load();
  };

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Admin Panel</p>
          <h1 className="font-display text-5xl gradient-text tracking-wider">MANAGE MATCHES</h1>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.startsWith("✅") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
            {message}
          </div>
        )}

        {/* Form */}
        <div className="glass-card glow-border p-8 mb-10">
          <h2 className="font-display text-2xl gradient-text tracking-wider mb-6">
            {editing ? "EDIT MATCH" : "ADD NEW MATCH"}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Team A *</label>
              <input name="teamA" value={form.teamA} onChange={handleChange} required className="input-dark" placeholder="e.g. Skyliners" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Team B *</label>
              <input name="teamB" value={form.teamB} onChange={handleChange} required className="input-dark" placeholder="e.g. Opponent or another team" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Date *</label>
              <input name="date" value={form.date} onChange={handleChange} required type="date" className="input-dark" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Venue *</label>
              <input name="venue" value={form.venue} onChange={handleChange} required className="input-dark" placeholder="Match location" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Competition</label>
              <input name="competition" value={form.competition} onChange={handleChange} className="input-dark" placeholder="e.g. University Games" />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-dark">
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Notes</label>
              <input name="notes" value={form.notes} onChange={handleChange} className="input-dark" placeholder="Optional notes" />
            </div>

            {/* Show result fields only if completed */}
            {form.status === "completed" && (
              <>
                <div>
                  <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Outcome</label>
                  <select name="outcome" value={form.outcome} onChange={handleChange} className="input-dark">
                    <option value="">Select outcome</option>
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="draw">Draw</option>
                  </select>
                </div>

                <div className="md:col-span-2 mt-2">
                  <h3 className="text-white/70 text-xs uppercase tracking-wider mb-3">Rollball Score Sheet</h3>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full min-w-[760px] text-sm">
                      <thead className="bg-white/5 text-white/60 uppercase tracking-wider text-xs">
                        <tr>
                          <th className="px-3 py-3 text-left">Period</th>
                          <th className="px-3 py-3 text-left">{form.teamA || "Team A"} Score</th>
                          <th className="px-3 py-3 text-left">{form.teamB || "Team B"} Score</th>
                          <th className="px-3 py-3 text-left">{form.teamA || "Team A"} Points</th>
                          <th className="px-3 py-3 text-left">{form.teamB || "Team B"} Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scoreRows.map(([, label, teamAScoreKey, teamBScoreKey, teamAPointsKey, teamBPointsKey]) => (
                          <tr key={label} className="border-t border-white/10">
                            <td className="px-3 py-2 text-white/70 font-medium">{label}</td>
                            <td className="px-3 py-2">
                              <input name={teamAScoreKey} value={form[teamAScoreKey]} onChange={handleChange} type="number" className="input-dark" min="0" />
                            </td>
                            <td className="px-3 py-2">
                              <input name={teamBScoreKey} value={form[teamBScoreKey]} onChange={handleChange} type="number" className="input-dark" min="0" />
                            </td>
                            <td className="px-3 py-2">
                              <input name={teamAPointsKey} value={form[teamAPointsKey]} onChange={handleChange} type="number" className="input-dark" min="0" />
                            </td>
                            <td className="px-3 py-2">
                              <input name={teamBPointsKey} value={form[teamBPointsKey]} onChange={handleChange} type="number" className="input-dark" min="0" />
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-white/20 bg-white/5">
                          <td className="px-3 py-3 text-white font-semibold">Totals</td>
                          <td className="px-3 py-3 text-white font-semibold">{getTotals().teamAScore}</td>
                          <td className="px-3 py-3 text-white font-semibold">{getTotals().teamBScore}</td>
                          <td className="px-3 py-3 text-white font-semibold">{getTotals().teamAPoints}</td>
                          <td className="px-3 py-3 text-white font-semibold">{getTotals().teamBPoints}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2">
                    <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Score Sheet Notes</label>
                    <textarea name="scoreSheetNotes" value={form.scoreSheetNotes} onChange={handleChange} className="input-dark h-20 resize-none" placeholder="Scorers, key moments, officials, etc." />
                  </div>
                </div>
              </>
            )}

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={loading} className="glow-btn px-8 py-3">
                {loading ? "Saving..." : editing ? "Update Match" : "Add Match"}
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

        {/* Matches List */}
        <div className="glass-card glow-border p-6">
          <h2 className="font-display text-2xl gradient-text tracking-wider mb-6">ALL MATCHES ({matches.length})</h2>
          {matches.length === 0 ? (
            <p className="text-white/30 text-center py-10">No matches added yet</p>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <div key={match._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <div>
                    <p className="font-semibold text-white">{match.teamA || "Skyliners"} vs {match.teamB || match.opponent}</p>
                    <p className="text-white/40 text-xs mt-1">
                      📅 {new Date(match.date).toDateString()} · 📍 {match.venue}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                      match.status === "completed" ? "bg-green-500/20 text-green-400" :
                      match.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                      "bg-glow/20 text-glow"
                    }`}>
                      {match.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(match)}
                      className="text-xs border border-blue-500/30 text-blue-400 px-3 py-1 rounded-lg hover:border-blue-500 transition-all">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(match._id)}
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
