import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnnouncements } from "../services/announcementService";
import { getMatches } from "../services/matchService";
import { getUpcomingBirthdays } from "../services/playerService";

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [matches, setMatches] = useState([]);
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
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
