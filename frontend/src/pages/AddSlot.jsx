import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaCalendarPlus } from "react-icons/fa";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";

export default function AddSlot() {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    end_time: "",
  });


  if (role && role !== "doctor") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-400">Access denied. Doctors only.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/doctors/slots/add/", formData);
      setSuccess(true);
      setFormData({ date: "", start_time: "", end_time: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add slot. Make sure you're logged in as a doctor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 py-6 px-6">
        <div className="max-w-lg mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm mb-2 transition">
            <FaArrowLeft /> Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">Manage Your Slots</h1>
          <p className="text-blue-100 text-sm mt-1">Add available appointment slots for patients</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8">
       
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
            ✅ Slot added successfully!
            <button onClick={() => setSuccess(false)} className="ml-auto text-green-500 hover:text-green-700">✕</button>
          </div>
        )}

      
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <FaCalendarPlus className="text-blue-500" /> Add New Slot
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Start Time</label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">End Time</label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition mt-2"
            >
              {loading ? "Adding slot..." : "Add Slot"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}