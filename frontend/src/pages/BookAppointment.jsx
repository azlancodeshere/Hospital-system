import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaClock, FaCheckCircle } from "react-icons/fa";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";

export default function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useContext(AuthContext);

  const [doctor, setDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const availableSlots = doctor?.slots?.filter((s) => !s.is_booked) || [];

  const handleBook = async () => {
    if (!selectedSlot) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setBooking(true);
    setError(null);
    try {
      await api.post("/api/appointments/book/", {
        slot_id: selectedSlot.id,
        doctor_id: parseInt(id),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to book appointment.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">⏳ Loading...</p>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center max-w-md">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Appointment Booked!</h2>
        <p className="text-gray-500 text-sm mb-2">
          Your appointment with <span className="font-semibold">{doctor?.username}</span> on{" "}
          <span className="font-semibold">{selectedSlot?.date}</span> at{" "}
          <span className="font-semibold">{selectedSlot?.start_time}</span> is pending confirmation.
        </p>
        <p className="text-xs text-gray-400 mb-6">The doctor will confirm your appointment shortly.</p>
        <div className="flex gap-3">
          <Link to="/doctors" className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
            Back to Doctors
          </Link>
          <Link to="/patient/dashboard" className="flex-1 text-center py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
            My Appointments
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 py-6 px-6">
        <div className="max-w-2xl mx-auto">
          <Link to={`/doctors/${id}`} className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm mb-2 transition">
            <FaArrowLeft /> Back to Profile
          </Link>
          <h1 className="text-2xl font-bold text-white">Book Appointment</h1>
          <p className="text-blue-100 text-sm mt-1">Select a slot with {doctor?.username}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
            {doctor?.username?.split(" ")[1]?.charAt(0)?.toUpperCase() || "D"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{doctor?.username}</h3>
            <p className="text-sm text-blue-600">{doctor?.specialization}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-bold text-gray-800">₹{doctor?.consultation_fee}</p>
            <p className="text-xs text-gray-400">per visit</p>
          </div>
        </div>

       
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" /> Select a Slot
          </h2>

          {availableSlots.length === 0 ? (
            <p className="text-gray-400 text-sm">No available slots at the moment.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`border rounded-xl p-3 text-center transition ${
                    selectedSlot?.id === slot.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <p className="text-xs font-semibold text-gray-700">{slot.date}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                    <FaClock className="text-blue-400" />
                    {slot.start_time}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

      
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

       
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-3 mb-4 text-sm">
            ⚠️ You need to <Link to="/login" className="font-semibold underline">login</Link> to book an appointment.
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={handleBook}
          disabled={!selectedSlot || booking || role === "doctor"}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
            selectedSlot && role !== "doctor"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {booking ? "Booking..." : role === "doctor" ? "Doctors cannot book appointments" : !selectedSlot ? "Select a slot first" : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}