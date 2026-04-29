import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, username, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
    setOpen(false);
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-blue-700 text-xl font-semibold">
          Medi<span className="text-gray-800">Book</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <Link to="/doctors" className="hover:text-blue-700">Doctors</Link>

          {isAuthenticated && role === "patient" && (
            <Link to="/patient/dashboard" className="hover:text-blue-700">
              My Appointments
            </Link>
          )}

          {isAuthenticated && role === "doctor" && (
            <>
              <Link to="/doctor/dashboard" className="hover:text-blue-700">
                Dashboard
              </Link>
              <Link to="/doctor/slots/add" className="hover:text-blue-700">
                Add Slot
              </Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <div className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center">
                  {username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-blue-700">{username}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 border px-3 py-1.5 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="border px-4 py-1.5 rounded-lg">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-700 text-white px-4 py-1.5 rounded-lg">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-gray-600">

          <Link to="/" onClick={() => setOpen(false)} className="block">
            Home
          </Link>

          <Link to="/doctors" onClick={() => setOpen(false)} className="block">
            Doctors
          </Link>

          {isAuthenticated && role === "patient" && (
            <Link to="/patient/dashboard" onClick={() => setOpen(false)} className="block">
              My Appointments
            </Link>
          )}

          {isAuthenticated && role === "doctor" && (
            <>
              <Link to="/doctor/dashboard" onClick={() => setOpen(false)} className="block">
                Dashboard
              </Link>
              <Link to="/doctor/slots/add" onClick={() => setOpen(false)} className="block">
                Add Slot
              </Link>
            </>
          )}

          <hr />

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center">
                  {username?.charAt(0).toUpperCase()}
                </div>
                <span>{username}</span>
              </div>

              <button
                onClick={handleLogout}
                className="text-red-500 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block">
                Login
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="block text-blue-700 font-medium">
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;