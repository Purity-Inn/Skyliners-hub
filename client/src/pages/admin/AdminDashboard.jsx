import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlayers } from "../../services/playerService";
import { getMatches } from "../../services/matchService";
import { getUsers } from "../../services/authService";
import { getAnnouncements } from "../../services/announcementService";
import { getHof } from "../../services/hofService";
import { getPhotos } from "../../services/galleryService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ players: 0, matches: 0, users: 0, announcements: 0, hof: 0, photos: 0 });

  useEffect(() => {
    Promise.all([
      getPlayers(), getMatches(), getUsers(), getAnnouncements(), getHof(), getPhotos(),
    ]).then(([players, matches, users, announcements, hof, photos]) => {
      setStats({
        players: players.data.length,
        matches: matches.data.length,
        users: users.data.length,
        announcements: announcements.data.length,
        hof: hof.data.length,
        photos: photos.data.length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: "Players", value: stats.players, icon: "👟", link: "/admin/players" },
    { label: "Matches", value: stats.matches, icon: "🏆", link: "/admin/matches" },
    { label: "Users", value: stats.users, icon: "👥", link: "/admin/users" },
    { label: "Announcements", value: stats.announcements, icon: "📢", link: "/admin/announcements" },
    { label: "Hall of Fame", value: stats.hof, icon: "⭐", link: "/admin/hof" },
    { label: "Gallery Photos", value: stats.photos, icon: "🖼️", link: "/admin/gallery" },
  ];

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Admin Panel</p>
          <h1 className="font-display text-6xl gradient-text tracking-wider">DASHBOARD</h1>
          <p className="text-white/40 mt-2">Manage everything about the Skyliners team</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {cards.map((card) => (
            <Link key={card.label} to={card.link}
              className="glass-card glow-border p-6 hover:shadow-glow transition-all duration-300 group">
              <div className="text-3xl mb-3">{card.icon}</div>
              <p className="font-display text-4xl gradient-text">{card.value}</p>
              <p className="text-white/40 text-xs mt-1 uppercase tracking-wider group-hover:text-white/70 transition-colors">
                {card.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Manage Sections */}
        <div className="glass-card glow-border p-6">
          <h2 className="font-display text-2xl gradient-text tracking-wider mb-4">MANAGE SECTIONS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "👟 Manage Players", link: "/admin/players" },
              { label: "🏆 Manage Matches", link: "/admin/matches" },
              { label: "📢 Announcements", link: "/admin/announcements" },
              { label: "👥 Manage Users", link: "/admin/users" },
              { label: "⭐ Hall of Fame", link: "/admin/hof" },
              { label: "🖼️ Gallery", link: "/admin/gallery" },
            ].map((item) => (
              <Link key={item.link} to={item.link}
                className="flex items-center gap-2 text-white/60 hover:text-glow transition-colors text-sm p-3 rounded-lg hover:bg-white/5">
                {item.label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
