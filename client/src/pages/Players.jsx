import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeadership } from "../services/leadershipService";
import { getPlayers } from "../services/playerService";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("All");
  const [team, setTeam] = useState("All");
  const [leadership, setLeadership] = useState({
    coach: "To Be Announced",
    coachPlayer: null,
    menCaptain: "To Be Announced",
    menCaptainPlayer: null,
    womenCaptain: "To Be Announced",
    womenCaptainPlayer: null,
    menViceCaptain: "To Be Announced",
    menViceCaptainPlayer: null,
    treasurer: "To Be Announced",
    treasurerPlayer: null,
    socialMediaManager: "To Be Announced",
    socialMediaManagerPlayer: null,
  });

  const suggestedPositions = [
    "Left Wing",
    "Right Wing",
    "Center",
    "Keeper",
  ];

  const hiddenPositions = new Set(["defender", "pivot"]);

  useEffect(() => {
    getPlayers()
      .then((r) => setPlayers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    getLeadership()
      .then((response) => {
        setLeadership({
          coach: response.data.coach || "To Be Announced",
          coachPlayer: response.data.coachPlayer || null,
          menCaptain: response.data.menCaptain || "To Be Announced",
          menCaptainPlayer: response.data.menCaptainPlayer || null,
          womenCaptain: response.data.womenCaptain || "To Be Announced",
          womenCaptainPlayer: response.data.womenCaptainPlayer || null,
          menViceCaptain: response.data.menViceCaptain || "To Be Announced",
          menViceCaptainPlayer: response.data.menViceCaptainPlayer || null,
          treasurer: response.data.treasurer || "To Be Announced",
          treasurerPlayer: response.data.treasurerPlayer || null,
          socialMediaManager: response.data.socialMediaManager || "To Be Announced",
          socialMediaManagerPlayer: response.data.socialMediaManagerPlayer || null,
        });
      })
      .catch(() => {});
  }, []);

  const leaders = [
    { role: "Coach", name: leadership.coach, player: leadership.coachPlayer },
    { role: "Captain — Men Team", name: leadership.menCaptain, player: leadership.menCaptainPlayer },
    { role: "Captain — Women Team", name: leadership.womenCaptain, player: leadership.womenCaptainPlayer },
    { role: "Vice Captain — Men Team", name: leadership.menViceCaptain, player: leadership.menViceCaptainPlayer },
    { role: "Treasurer", name: leadership.treasurer, player: leadership.treasurerPlayer },
    { role: "Social Media Manager", name: leadership.socialMediaManager, player: leadership.socialMediaManagerPlayer },
  ];

  const normalizePosition = (positionValue) => {
    if (!positionValue) return "";
    return String(positionValue).trim().toLowerCase() === "zero"
      ? "Left Wing"
      : positionValue;
  };

  const filtered = players.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchPosition = position === "All" || normalizePosition(p.position) === position;
    const matchTeam = team === "All" || p.gender === team;
    return matchSearch && matchPosition && matchTeam;
  });

  const positions = [
    "All",
    ...new Set([
      ...suggestedPositions,
      ...players
        .map((player) => normalizePosition(player.position))
        .filter((value) => value && !hiddenPositions.has(String(value).toLowerCase())),
    ]),
  ];

  const menPlayers = filtered.filter((p) => p.gender === "Male");
  const womenPlayers = filtered.filter((p) => p.gender === "Female");

  const PlayerCard = ({ player, i, color }) => (
    <Link
      to={`/players/${player._id}`}
      className="glass-card group overflow-hidden transition-all duration-300 hover:shadow-glow"
      style={{
        border: `1px solid ${color === "pink" ? "rgba(244,114,182,0.3)" : "rgba(249,115,22,0.3)"}`,
        animationDelay: `${i * 0.1}s`
      }}
    >
      <div className="h-48 bg-navy/80 relative overflow-hidden">
        {player.photo ? (
          <img src={player.photo} alt={player.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-6xl opacity-20" style={{ color: color === "pink" ? "#f472b6" : "#f97316" }}>
              {player.name[0]}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-glow"
          style={{ background: color === "pink" ? "#ec4899" : "#f97316" }}>
          {player.jerseyNumber}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white group-hover:text-glow transition-colors">{player.name}</h3>
        <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: color === "pink" ? "#f472b6" : "rgba(249,115,22,0.7)" }}>
          {normalizePosition(player.position)}
        </p>
        {player.yearJoined && <p className="text-white/30 text-xs mt-1">Since {player.yearJoined}</p>}
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Kirinyaga University</p>
          <h1 className="font-display text-6xl gradient-text tracking-wider">THE SQUAD</h1>
          <p className="text-white/40 mt-3">Meet the players behind the Skyliners legacy</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark md:w-64"
          />
        </div>

        {/* Team tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["All", "Male", "Female"].map((t) => (
            <button
              key={t}
              onClick={() => setTeam(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border ${
                team === t
                  ? t === "Female"
                    ? "bg-pink-500 border-pink-500 text-white"
                    : "bg-glow border-glow text-white shadow-glow"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              {t === "All" ? "🏆 All Players" : t === "Male" ? "👨 Men Team" : "👩 Women Team"}
            </button>
          ))}
        </div>

        {/* Position filter */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => setPosition(pos)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                position === pos
                  ? "bg-white/10 border-white/30 text-white"
                  : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/60"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Leadership Board */}
        <section className="mb-14">
          <div className="glass-card glow-border p-7 md:p-10">
            <div className="text-center mb-8">
              <p className="text-gold text-xs md:text-sm uppercase tracking-[0.35em] mb-3">Front Office</p>
              <h2 className="font-display text-4xl md:text-6xl text-white tracking-wider font-black uppercase">
                THE LEADERSHIP BOARD
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {leaders.map((leader) => (
                <Link
                  key={leader.role}
                  to={leader.player?._id ? `/players/${leader.player._id}` : "#"}
                  className={`rounded-xl border border-glow/40 bg-glow/10 p-6 text-center shadow-glow transition-all duration-300 ${leader.player?._id ? "hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.35)]" : "cursor-default"}`}
                  onClick={(event) => {
                    if (!leader.player?._id) event.preventDefault();
                  }}
                >
                  <p className="text-white text-xs uppercase tracking-[0.22em] mb-3 font-semibold">{leader.role}</p>
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-glow/40 bg-navy/60 flex items-center justify-center mb-4">
                    {leader.player?.photo ? (
                      <img src={leader.player.photo} alt={leader.player.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display text-3xl text-gold/80">{(leader.player?.name || leader.name || "T").charAt(0)}</span>
                    )}
                  </div>
                  <p className="font-display text-xl md:text-2xl text-gold tracking-wider font-bold">
                    {leader.player?.name || leader.name}
                  </p>
                  {leader.player?.position ? (
                    <p className="text-white/60 text-xs uppercase tracking-wider mt-2">{leader.player.position}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {loading ? (
          <div className="text-center text-white/40 py-20">Loading players...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-white/40 py-20">No players found</div>
        ) : (
          <>
            {/* Men Team */}
            {(team === "All" || team === "Male") && menPlayers.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-display text-3xl gradient-text tracking-wider">👨 MEN TEAM</h2>
                  <span className="text-xs bg-glow/10 border border-glow/30 text-glow px-3 py-1 rounded-full">
                    {menPlayers.length} players
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {menPlayers.map((player, i) => (
                    <PlayerCard key={player._id} player={player} i={i} color="orange" />
                  ))}
                </div>
              </div>
            )}

            {/* Women Team */}
            {(team === "All" || team === "Female") && womenPlayers.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-display text-3xl tracking-wider" style={{ color: "#f472b6" }}>
                    👩 WOMEN TEAM
                  </h2>
                  <span className="text-xs border px-3 py-1 rounded-full" style={{ color: "#f472b6", borderColor: "rgba(244,114,182,0.3)", background: "rgba(244,114,182,0.1)" }}>
                    {womenPlayers.length} players
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {womenPlayers.map((player, i) => (
                    <PlayerCard key={player._id} player={player} i={i} color="pink" />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
