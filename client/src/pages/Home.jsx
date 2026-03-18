import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnnouncements } from "../services/announcementService";
import { getLeadership } from "../services/leadershipService";
import { getMatches } from "../services/matchService";
import { getUpcomingBirthdays } from "../services/playerService";

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [matches, setMatches] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
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

  const leaders = [
    { role: "Coach", name: leadership.coach, player: leadership.coachPlayer },
    { role: "Captain — Men Team", name: leadership.menCaptain, player: leadership.menCaptainPlayer },
    { role: "Captain — Women Team", name: leadership.womenCaptain, player: leadership.womenCaptainPlayer },
    { role: "Vice Captain — Men Team", name: leadership.menViceCaptain, player: leadership.menViceCaptainPlayer },
    { role: "Treasurer", name: leadership.treasurer, player: leadership.treasurerPlayer },
    { role: "Social Media Manager", name: leadership.socialMediaManager, player: leadership.socialMediaManagerPlayer },
  ];

  useEffect(() => {
    getLeadership().then((r) => setLeadership({
      coach: r.data.coach || "To Be Announced",
      coachPlayer: r.data.coachPlayer || null,
      menCaptain: r.data.menCaptain || "To Be Announced",
      menCaptainPlayer: r.data.menCaptainPlayer || null,
      womenCaptain: r.data.womenCaptain || "To Be Announced",
      womenCaptainPlayer: r.data.womenCaptainPlayer || null,
      menViceCaptain: r.data.menViceCaptain || "To Be Announced",
      menViceCaptainPlayer: r.data.menViceCaptainPlayer || null,
      treasurer: r.data.treasurer || "To Be Announced",
      treasurerPlayer: r.data.treasurerPlayer || null,
      socialMediaManager: r.data.socialMediaManager || "To Be Announced",
      socialMediaManagerPlayer: r.data.socialMediaManagerPlayer || null,
    })).catch(() => {});
    getAnnouncements().then((r) => setAnnouncements(r.data.slice(0, 3))).catch(() => {});
    getMatches("upcoming").then((r) => setMatches(r.data.slice(0, 3))).catch(() => {});
    getUpcomingBirthdays().then((r) => setBirthdays(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-primary">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-glow/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 animate-fade-up">
          <p className="text-glow uppercase tracking-[0.4em] text-sm font-medium mb-4">
            Kirinyaga University
          </p>
          <h1 className="font-display text-7xl md:text-9xl tracking-wider mb-4">
            <span className="gradient-text">SKYLINERS</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light">
            Official platform for the Skyliners Rollball & Roller Skating Team
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/players" className="glow-btn text-base px-8 py-3">
              Meet the Team
            </Link>
            <Link
              to="/matches"
              className="border border-white/20 text-white px-8 py-3 rounded-lg hover:border-glow hover:text-glow transition-all text-base"
            >
              View Matches
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-glow rounded-full" />
          </div>
        </div>
      </section>

      {/* Team Leadership */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="glass-card glow-border p-7 md:p-10">
          <div className="text-center mb-8">
            <p className="text-gold text-xs md:text-sm uppercase tracking-[0.35em] mb-3">Front Office</p>
            <h2 className="font-display text-5xl md:text-7xl text-white tracking-wider font-black uppercase">
              THE LEADERSHIP BOARD
            </h2>
            <p className="text-white/70 mt-3 text-sm md:text-base">
              Coach, Captains, Vice Captain, Treasurer and Social Media Manager
            </p>
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
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-glow/40 bg-navy/60 flex items-center justify-center mb-4">
                  {leader.player?.photo ? (
                    <img src={leader.player.photo} alt={leader.player.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display text-3xl text-gold/80">{(leader.player?.name || leader.name || "T").charAt(0)}</span>
                  )}
                </div>
                <p className="font-display text-2xl md:text-3xl text-gold tracking-wider font-bold">
                  {leader.player?.name || leader.name}
                </p>
                {leader.player?.position ? (
                  <p className="text-white/60 text-xs uppercase tracking-wider mt-2">
                    {leader.player.position}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/10 py-8 bg-navy/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Active Players", value: "20+" },
            { label: "Matches Played", value: "50+" },
            { label: "Trophies Won", value: "12" },
            { label: "Years Active", value: "5+" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl gradient-text">{stat.value}</p>
              <p className="text-white/50 text-sm mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Matches */}
      {matches.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title gradient-text">Upcoming Matches</h2>
            <Link to="/matches" className="text-glow text-sm hover:underline">View All →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match._id} className="glass-card glow-border p-6 hover:shadow-glow transition-all duration-300">
                <p className="text-glow text-xs uppercase tracking-widest mb-3">{match.competition}</p>
                <h3 className="text-xl font-semibold mb-1">
                  Skyliners <span className="text-white/40">vs</span> {match.opponent}
                </h3>
                <p className="text-white/50 text-sm">📅 {new Date(match.date).toDateString()}</p>
                <p className="text-white/50 text-sm">📍 {match.venue}</p>
                <span className="inline-block mt-3 text-xs bg-glow/20 text-glow px-3 py-1 rounded-full border border-glow/30">
                  {match.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title gradient-text">Latest News</h2>
            <Link to="/announcements" className="text-glow text-sm hover:underline">View All →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {announcements.map((a) => (
              <div key={a._id} className="glass-card p-6 hover:glow-border transition-all duration-300">
                {a.pinned && (
                  <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full mb-3 inline-block">
                    �� Pinned
                  </span>
                )}
                <h3 className="font-semibold text-lg mb-2">{a.title}</h3>
                <p className="text-white/50 text-sm line-clamp-3">{a.body}</p>
                <p className="text-white/30 text-xs mt-3">
                  {new Date(a.createdAt).toDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Birthdays */}
      {birthdays.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="section-title gradient-text mb-8">🎂 Upcoming Birthdays</h2>
          <div className="flex flex-wrap gap-4">
            {birthdays.map((player) => (
              <div key={player._id} className="glass-card glow-border px-6 py-4 flex items-center gap-4 animate-float">
                <div className="w-10 h-10 rounded-full bg-glow/20 flex items-center justify-center text-glow font-display text-lg">
                  {player.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-white/50 text-xs">
                    🎂 {new Date(player.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        <p className="font-display text-xl gradient-text mb-2">SKYLINERS HUB</p>
        <div className="flex items-center justify-center gap-6 mb-2">
          <a
            href="https://www.tiktok.com/@kirinyaga_rollball_?_r=1&_t=ZS-94f73hzHoft"
            target="_blank"
            rel="noreferrer"
            className="text-white/60 hover:text-glow transition-colors"
          >
            TikTok
          </a>
          <a
            href="https://www.instagram.com/kirinyaga_rollball_ke?igsh=NGpxaGZlb2RrOWts"
            target="_blank"
            rel="noreferrer"
            className="text-white/60 hover:text-glow transition-colors"
          >
            Instagram
          </a>
        </div>
        <p>© 2018 - {new Date().getFullYear()} Kirinyaga University Skyliners. All rights reserved.</p>
      </footer>
    </div>
  );
}
