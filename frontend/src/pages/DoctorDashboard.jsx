import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaUser, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import api from "../../api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); 
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    api.get("/api/appointments/doctor/")
      .then((res) => {
        setAppointments(res.data.appointments);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/api/appointments/${id}/status/`, { status });
      setAppointments((prev) =>
        prev.map((apt) => apt.id === id ? { ...apt, status } : apt)
      );
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  const pending = appointments.filter((a) => a.status === "pending");
  const others = appointments.filter((a) => a.status !== "pending");

  return (
    <div className="min-h-screen bg-gray-50">
    
      <div className="bg-blue-600 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Doctor Dashboard</h1>
          <p className="text-blue-100 text-sm mt-1">Manage your appointments</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
      
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-500">{pending.length}</p>
              <p className="text-xs text-gray-400 mt-1">Pending</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-green-500">
                {appointments.filter((a) => a.status === "confirmed").length}
              </p>
              <p className="text-xs text-gray-400 mt-1">Confirmed</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
              <p className="text-xs text-gray-400 mt-1">Total</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">⏳</p>
            <p>Loading appointments...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-400">
            <p className="text-4xl mb-3">⚠️</p>
            <p>{error}</p>
          </div>
        )}

      
        {!loading && !error && pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-700 mb-3">
              Pending Requests ({pending.length})
            </h2>
            <div className="space-y-3">
              {pending.map((apt) => (
                <div key={apt.id} className="bg-white rounded-2xl border border-yellow-100 p-5 flex flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <FaUser className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{apt.patient_name}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-400" /> {apt.slot_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-blue-400" /> {apt.slot_time}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(apt.id, "confirmed")}
                      disabled={updating === apt.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition"
                    >
                      <FaCheckCircle /> Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(apt.id, "rejected")}
                      disabled={updating === apt.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-400 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition"
                    >
                      <FaTimesCircle /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      
        {!loading && !error && others.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-3">
              Past Appointments
            </h2>
            <div className="space-y-3">
              {others.map((apt) => (
                <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-row items-center  gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <FaUser className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{apt.patient_name}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-400" /> {apt.slot_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-blue-400" /> {apt.slot_time}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[apt.status]}`}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-lg font-medium">No appointments yet</p>
            <p className="text-sm">Patients will appear here once they book with you</p>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 flex gap-3">
          <Link
            to="/doctor/slots/add"
            className="flex-1 text-center py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            + Add New Slot
          </Link>
        </div>
      </div>
    </div>
  );
}