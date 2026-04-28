import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaClock, FaSearch, FaFilter } from "react-icons/fa";
import api from "../../api";

const specializations = [
  "All", "Cardiologist", "Dermatologist", "Neurologist",
  "Orthopedic", "Pediatrician", "Dentist", "Ophthalmologist", "Psychiatrist",
];

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    api.get("/api/doctors/")
      .then((res) => {
        console.log("API response:", res.data);
        setDoctors(res.data);   
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

 
  const isAvailable = (slots) => slots?.some((slot) => !slot.is_booked);


  const filtered = doctors.filter((doc) => {
    const matchSearch =
      (doc.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (doc.specialization || "").toLowerCase().includes(search.toLowerCase());


    const matchSpec =
  selectedSpec === "All" ||
  doc.specialization?.toLowerCase() === selectedSpec.toLowerCase();
    const matchAvail = !availableOnly || isAvailable(doc.slots);

    

    return matchSearch && matchSpec && matchAvail;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Find a Doctor</h1>
          <p className="text-blue-100 text-center mb-6">Search from verified doctors</p>
          <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-md max-w-2xl mx-auto gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <FaFilter className="text-gray-400 text-sm" />
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                selectedSpec === spec
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              {spec}
            </button>
          ))}
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`ml-auto px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              availableOnly
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
            }`}
          >
            Available Now
          </button>
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">⏳</p>
            <p className="text-lg font-medium">Loading doctors...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-400">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-lg font-medium">{error}</p>
            <p className="text-sm">Make sure your Django server is running</p>
          </div>
        )}

        {!loading && !error && (
          <p className="text-sm text-gray-500 mb-4">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> doctors
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-medium">No doctors found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition flex gap-4"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {doc.username?.charAt(0)?.toUpperCase()}  
                  </div>
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    isAvailable(doc.slots) ? "bg-green-400" : "bg-gray-300"
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base leading-tight">
                        {doc.username} 
                      </h3>
                      <span className="inline-block mt-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {doc.specialization}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-gray-800">₹{doc.consultation_fee}</p>
                      <p className="text-xs text-gray-400">per visit</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaClock className="text-blue-400" />
                      {doc.experience_years} years exp.
                    </span>
                    <span className="flex items-center gap-1">
                      {isAvailable(doc.slots)
                        ? <span className="text-green-500 font-medium">● Available</span>
                        : <span className="text-gray-400 font-medium">● Unavailable</span>
                      }
                    </span>
                  </div>

                  {doc.bio && <p className="text-xs text-gray-400 mt-1 truncate">{doc.bio}</p>}

                  <div className="flex gap-2 mt-3">
                    <Link
                      to={`/doctors/${doc.id}`}
                      className="flex-1 text-center text-sm font-medium text-blue-600 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-50 transition"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/doctors/${doc.id}/book`}
                      className={`flex-1 text-center text-sm font-medium rounded-lg py-1.5 transition ${
                        isAvailable(doc.slots)
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                      }`}
                    >
                      {isAvailable(doc.slots) ? "Book Now" : "Unavailable"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}