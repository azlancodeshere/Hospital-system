import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* BRAND */}
          <div>
            <h2 className="text-blue-700 text-xl font-semibold mb-3">
              Medi<span className="text-gray-800">Book</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Book appointments with top doctors in your city, anytime.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-blue-700">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-sm text-gray-400 hover:text-blue-700">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-gray-400 hover:text-blue-700">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-400 hover:text-blue-700">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* SPECIALIZATIONS */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Specializations
            </h3>
            <ul className="space-y-2">
              {["Cardiologist", "Dermatologist", "Neurologist", "Orthopedic", "Pediatrician"].map((s) => (
                <li key={s}>
                  <Link to="/doctors" className="text-sm text-gray-400 hover:text-blue-700">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">📧 support@medibook.com</li>
              <li className="text-sm text-gray-400">📞 +91 98765 43210</li>
              <li className="text-sm text-gray-400">📍 Mumbai, India</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-gray-400">
            © 2026 MediBook. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center sm:justify-end gap-4">
            <a href="#" className="text-xs text-gray-400 hover:text-blue-700">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-400 hover:text-blue-700">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-gray-400 hover:text-blue-700">
              Help
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;