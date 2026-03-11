import { useEffect, useState } from "react";
import { getUsers, updateUserRole, deleteUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const { user: currentUser } = useAuth();

  const load = () => getUsers().then((r) => setUsers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      setMessage("✅ Role updated!");
      load();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Error"));
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await deleteUser(id);
    load();
  };

  const roleColor = (role) => {
    if (role === "admin") return "text-gold border-gold/30 bg-gold/10";
    if (role === "member") return "text-glow border-glow/30 bg-glow/10";
    return "text-white/40 border-white/10 bg-white/5";
  };

  return (
    <div className="min-h-screen bg-primary px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-glow uppercase tracking-widest text-sm mb-2">Admin Panel</p>
          <h1 className="font-display text-5xl gradient-text tracking-wider">MANAGE USERS</h1>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.startsWith("✅") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
            {message}
          </div>
        )}

        <div className="glass-card glow-border p-6">
          <h2 className="font-display text-2xl gradient-text tracking-wider mb-6">ALL USERS ({users.length})</h2>
          {users.length === 0 ? (
            <p className="text-white/30 text-center py-10">No users found</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-glow/10 border border-glow/20 flex items-center justify-center text-glow font-bold uppercase">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {user.name}
                        {user._id === currentUser?._id && (
                          <span className="text-xs text-glow ml-2">(you)</span>
                        )}
                      </p>
                      <p className="text-white/40 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs border px-3 py-1 rounded-full uppercase font-semibold ${roleColor(user.role)}`}>
                      {user.role}
                    </span>
                    {user._id !== currentUser?._id && (
                      <>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="text-xs bg-white/10 border border-white/20 text-white rounded-lg px-2 py-1"
                        >
                          <option value="visitor">Visitor</option>
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-xs border border-red-500/30 text-red-400 px-3 py-1 rounded-lg hover:border-red-500 transition-all"
                        >
                          Delete
                        </button>
                      </>
                    )}
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
