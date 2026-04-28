import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/doctors/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Doctor not found");
        return res.json();
      })
      .then((data) => setDoctor(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const availableSlots = doctor.slots.filter((s) => !s.is_booked);
  const bookedSlots = doctor.slots.filter((s) => s.is_booked);
  const initials = doctor.username?.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex gap-4 items-start">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-semibold">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dr. {doctor.username}</h1>
          <span className="inline-block text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full mt-1 mb-2">
            {doctor.specialization}
          </span>
          <div className="text-sm text-gray-500 flex gap-3 flex-wrap">
            <span>{doctor.email}</span>
            <span>|</span>
            <span>{doctor.phone}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Experience", value: `${doctor.experience_years} yrs` },
          { label: "Consultation fee", value: `₹${doctor.consultation_fee}` },
          { label: "Open slots", value: availableSlots.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Bio */}
      {doctor.bio && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">About</p>
          <p className="text-sm text-gray-600 leading-relaxed">{doctor.bio}</p>
        </div>
      )}

      {/* Slots */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Time slots</p>
        <div className="grid grid-cols-2 gap-2">
          {doctor.slots.map((slot) => (
            <div
              key={slot.id}
              className={`border rounded-xl p-3 ${
                slot.is_booked
                  ? "bg-gray-50 border-gray-200 opacity-60"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <p className="text-xs text-gray-400">{slot.date}</p>
              <p className="text-sm font-medium text-gray-800">
                {slot.start_time} – {slot.end_time}
              </p>
              <span
                className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                  slot.is_booked
                    ? "bg-gray-200 text-gray-500"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {slot.is_booked ? "Booked" : "Available"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}