import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaUserMd } from "react-icons/fa";
import api from "../../api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/appointments/my/")
      .then((res) => {
        setAppointments(res.data.appointments);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">My Appointments</h1>
          <p className="text-blue-100 text-sm mt-1">Track your upcoming and past appointments</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
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

        {!loading && !error && appointments.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-lg font-medium">No appointments yet</p>
            <p className="text-sm mb-6">Book an appointment with a doctor to get started</p>
            <Link to="/doctors" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
              Find a Doctor
            </Link>
          </div>
        )}

        {!loading && !error && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <FaUserMd className="text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{apt.doctor_name}</h3>
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
        )}
      </div>
    </div>
  );
}