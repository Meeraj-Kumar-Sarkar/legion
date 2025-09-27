import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, Bus, BarChart3 } from "lucide-react";

function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    
    if (!token || !userData) {
      navigate("/admin/login");
      return;
    }

    setAdminData(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    navigate("/admin/login");
  };

  if (!adminData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bus className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {adminData.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <Users className="text-blue-500" size={24} />
              <div>
                <p className="text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <Bus className="text-green-500" size={24} />
              <div>
                <p className="text-gray-600">Active Buses</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="text-purple-500" size={24} />
              <div>
                <p className="text-gray-600">Daily Passengers</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional admin content can go here */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">System Overview</h2>
          <p className="text-gray-600">Admin management panel content goes here...</p>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;