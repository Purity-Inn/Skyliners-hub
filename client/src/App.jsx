import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Players from "./pages/Players";
import PlayerDetail from "./pages/PlayerDetail";
import Matches from "./pages/Matches";
import Gallery from "./pages/Gallery";
import HallOfFame from "./pages/HallOfFame";
import Announcements from "./pages/Announcements";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePlayers from "./pages/admin/ManagePlayers";
import ManageMatches from "./pages/admin/ManageMatches";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements";
import ManageHof from "./pages/admin/ManageHof";
import ManageGallery from "./pages/admin/ManageGallery";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "admin" ? children : <Navigate to="/" />;
};

function App() {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players/:id" element={<PlayerDetail />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/hall-of-fame" element={<HallOfFame />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/players" element={<AdminRoute><ManagePlayers /></AdminRoute>} />
        <Route path="/admin/matches" element={<AdminRoute><ManageMatches /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="/admin/announcements" element={<AdminRoute><ManageAnnouncements /></AdminRoute>} />
        <Route path="/admin/hof" element={<AdminRoute><ManageHof /></AdminRoute>} />
        <Route path="/admin/gallery" element={<AdminRoute><ManageGallery /></AdminRoute>} />
      </Routes>
    </div>
  );
}

export default App;
