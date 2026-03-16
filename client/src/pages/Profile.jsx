import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";

export default function Profile() {
  const { user, loginUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(user?.profilePhoto || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) { setPhotoFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (photoFile) formData.append("profilePhoto", photoFile);

      const res = await updateProfile(formData);

      // Update AuthContext with new user data + new token
      loginUser(res.data, res.data.token);
      setMessage("✅ Profile updated successfully!");
      setPhotoFile(null);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Update failed"));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const roleColor = {
    admin: "text-gold border-gold/30 bg-gold/10",
    member: "text-glow border-glow/30 bg-glow/10",
    visitor: "text-white/40 border-white/10 bg-white/5",
  };

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Account</p>
          <h1 className="font-display text-5xl gradient-text tracking-wider">MY PROFILE</h1>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.startsWith("✅") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
            {message}
          </div>
        )}

        <div className="glass-card glow-border p-8">

          {/* Current photo + role */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="relative">
              {preview ? (
                <img src={preview} alt={user?.name} className="w-20 h-20 rounded-full object-cover border-2 border-glow/50 shadow-glow" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-glow/20 border-2 border-glow/30 flex items-center justify-center font-display text-3xl gradient-text">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-white text-xl">{user?.name}</p>
              <p className="text-white/40 text-sm">{user?.email}</p>
              <span className={`text-xs border px-3 py-1 rounded-full uppercase font-semibold mt-2 inline-block ${roleColor[user?.role]}`}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo upload */}
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-3">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                {preview ? (
                  <img src={preview} alt="preview" className="w-14 h-14 rounded-full object-cover border border-glow/30" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-xs">
                    No photo
                  </div>
                )}
                <div>
                  <label className="cursor-pointer glow-btn text-sm px-5 py-2 inline-block">
                    {preview ? "Change Photo" : "Upload Photo"}
                    <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                  </label>
                  <p className="text-white/20 text-xs mt-1">JPG, PNG or WebP · Max 5MB</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-dark"
                placeholder="Your name"
              />
            </div>

            {/* Email (read only) */}
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="input-dark opacity-40 cursor-not-allowed"
              />
              <p className="text-white/20 text-xs mt-1">Email cannot be changed</p>
            </div>

            <button type="submit" disabled={loading} className="glow-btn w-full py-3">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Role info */}
        <div className="glass-card border border-white/10 p-5 mt-6">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Your Permissions</p>
          {user?.role === "visitor" && (
            <p className="text-white/50 text-sm">
              You are a <span className="text-white">Visitor</span> — you can view all content. Contact an admin to be promoted to Member so you can upload photos.
            </p>
          )}
          {user?.role === "member" && (
            <p className="text-white/50 text-sm">
              You are a <span className="text-glow font-semibold">Member</span> — you can upload photos to the gallery. Your uploads go to admin for approval.
            </p>
          )}
          {user?.role === "admin" && (
            <p className="text-white/50 text-sm">
              You are an <span className="text-gold font-semibold">Admin</span> — you have full access to manage all content on Skyliners Hub.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
