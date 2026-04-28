import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaClock, FaPhone, FaEnvelope, FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import api from "../../api";

export default function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/doctors/${id}/`)
      .then((res) => {
        setDoctor(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const isAvailable = (slots) => slots?.some((slot) => !slot.is_booked);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-lg">⏳ Loading doctor profile...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-400 text-lg">⚠️ {error}</p>
    </div>
  );

  if (!doctor) return null;

  const availableSlots = doctor.slots?.filter((s) => !s.is_booked) || [];
  const bookedSlots = doctor.slots?.filter((s) => s.is_booked) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm mb-4 transition">
            <FaArrowLeft /> Back to Doctors
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-4 pb-12">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                {doctor.username?.split(" ")[1]?.charAt(0)?.toUpperCase() || "D"}
              </div>
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                isAvailable(doctor.slots) ? "bg-green-400" : "bg-gray-300"
              }`} />
            </div>

           
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{doctor.username}</h1>
                  <span className="inline-block mt-1 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {doctor.specialization}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">₹{doctor.consultation_fee}</p>
                  <p className="text-xs text-gray-400">per visit</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <FaClock className="text-blue-400" />
                  {doctor.experience_years} years experience
                </span>
                <span className="flex items-center gap-1.5">
                  <FaEnvelope className="text-blue-400" />
                  {doctor.email}
                </span>
                {doctor.phone && (
                  <span className="flex items-center gap-1.5">
                    <FaPhone className="text-blue-400" />
                    {doctor.phone}
                  </span>
                )}
              </div>

              {doctor.bio && (
                <p className="mt-4 text-gray-600 text-sm leading-relaxed">{doctor.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Slots Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" /> Available Slots
          </h2>

          {availableSlots.length === 0 ? (
            <p className="text-gray-400 text-sm">No available slots at the moment.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableSlots.map((slot) => (
                <div key={slot.id} className="border border-green-200 bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold text-green-700">{slot.date}</p>
                  <p className="text-xs text-green-600 mt-1">{slot.start_time} – {slot.end_time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        
        <div className="flex gap-3">
          <Link
            to={`/doctors/${id}/book`}
            className={`flex-1 text-center py-3 rounded-xl font-semibold text-sm transition ${
              isAvailable(doctor.slots)
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
            }`}
          >
            {isAvailable(doctor.slots) ? "Book Appointment" : "No Slots Available"}
          </Link>
          <Link
            to="/doctors"
            className="px-6 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}