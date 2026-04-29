import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaHeart } from "react-icons/fa6";
import { PiHandSoapBold, PiBrainLight } from "react-icons/pi";
import { LuBone } from "react-icons/lu";
import { LiaToothSolid } from "react-icons/lia";
import { CgEye } from "react-icons/cg";
import { MdOutlineChildCare } from "react-icons/md";

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div>

      {/* HERO SECTION */}
      <div className="bg-blue-700 text-white py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Find & Book the Best Doctors
          </h1>

          <p className="text-blue-200 text-sm sm:text-base mb-6">
            Connect with top doctors in your city and book appointments instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/doctors"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Find Doctors
            </Link>

            {!isAuthenticated && (
              <Link
                to="/signup"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-white py-10 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-700">500+</p>
            <p className="text-sm text-gray-400 mt-1">Doctors</p>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-700">10k+</p>
            <p className="text-sm text-gray-400 mt-1">Patients</p>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-700">20+</p>
            <p className="text-sm text-gray-400 mt-1">Specializations</p>
          </div>
        </div>
      </div>

      {/* SPECIALIZATION */}
      <div className="py-14 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-8">
            Browse by Specialization
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Cardiologist", icon: <FaHeart className="text-red-500" /> },
              { name: "Dermatologist", icon: <PiHandSoapBold /> },
              { name: "Neurologist", icon: <PiBrainLight className="text-pink-600" /> },
              { name: "Orthopedic", icon: <LuBone /> },
              { name: "Pediatrician", icon: <MdOutlineChildCare className="text-yellow-600" /> },
              { name: "Dentist", icon: <LiaToothSolid className="text-yellow-700" /> },
              { name: "Ophthalmologist", icon: <CgEye /> },
              { name: "Psychiatrist", icon: "🧘" },
            ].map((s) => (
              <Link
                to="/doctors"
                key={s.name}
                className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-blue-300 hover:shadow-sm transition"
              >
                <div className="flex justify-center text-2xl mb-2">
                  {s.icon}
                </div>
                <p className="text-sm font-medium text-gray-700">{s.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      
      <div className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-10">
            How it works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                🔍
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Search Doctor</h3>
              <p className="text-sm text-gray-400">
                Find doctors by specialization or name
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                📅
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Book Appointment</h3>
              <p className="text-sm text-gray-400">
                Choose a time slot that works for you
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                ✅
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Get Confirmed</h3>
              <p className="text-sm text-gray-400">
                Doctor confirms your appointment
              </p>
            </div>
          </div>
        </div>
      </div>

      
      {!isAuthenticated && (
        <div className="bg-blue-700 py-14 px-4 sm:px-6 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">
              Ready to get started?
            </h2>

            <p className="text-blue-200 mb-6 text-sm sm:text-base">
              Join thousands of patients booking appointments online.
            </p>

            <Link
              to="/signup"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;