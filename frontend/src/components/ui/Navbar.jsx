import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, username, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">

      
      <Link to="/" className="text-blue-700 text-xl font-semibold tracking-tight">
        Medi<span className="text-gray-800">Book</span>
      </Link>

      
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-700 transition">
          Home
        </Link>
        <Link to="/doctors" className="hover:text-blue-700 transition">
          Doctors
        </Link>
        {isAuthenticated && role === "patient" && (
          <Link to="/patient/dashboard" className="hover:text-blue-700 transition">
            My Appointments
          </Link>
        )}
        {isAuthenticated && role === "doctor" && (
          <>
          <Link to="/doctor/dashboard" className="hover:text-blue-700 transition">
            My Dashboard
          </Link>

          <Link to="/doctor/slots/add" className="hover:text-blue-700 transition">
          Add Slot
        </Link>
        </>
        )}
      </div>

   

      
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
           
            <Link to="/profile" className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">
              <div className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center font-semibold">
                {username?.charAt(0).toUpperCase()}
              </div>
              </Link>

              
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
              <span className="text-sm text-blue-700 font-medium">
                {username}
              </span>

            
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role === "doctor"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-600"
                }`}>
                {role}
              </span>
            </div>

           
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500 border border-gray-200 px-3 py-1.5 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-blue-700 border border-gray-200 px-4 py-1.5 rounded-lg transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-lg transition"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;