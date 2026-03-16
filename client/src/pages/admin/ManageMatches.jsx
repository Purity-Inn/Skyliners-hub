import { useEffect, useState } from "react";
import { getMatches, createMatch, updateMatch, deleteMatch } from "../../services/matchService";

const emptyForm = {
  teamA: "Skyliners", teamB: "", opponent: "", date: "", venue: "",
  competition: "Friendly", status: "upcoming",
  skylinerScore: "", opponentScore: "", outcome: "", notes: "",
};

export default function ManageMatches() {
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => getMatches().then((r) => setMatches(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
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
          skylinerScore: Number(form.skylinerScore),
          opponentScore: Number(form.opponentScore),
          outcome: form.outcome,
        } : undefined,
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
      skylinerScore: match.result?.skylinerScore ?? "",
      opponentScore: match.result?.opponentScore ?? "",
      outcome: match.result?.outcome || "",
      notes: match.notes || "",
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
                  <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Skyliners Score</label>
                  <input name="skylinerScore" value={form.skylinerScore} onChange={handleChange} type="number" className="input-dark" placeholder="0" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Opponent Score</label>
                  <input name="opponentScore" value={form.opponentScore} onChange={handleChange} type="number" className="input-dark" placeholder="0" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Outcome</label>
                  <select name="outcome" value={form.outcome} onChange={handleChange} className="input-dark">
                    <option value="">Select outcome</option>
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="draw">Draw</option>
                  </select>
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
