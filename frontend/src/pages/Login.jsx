import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../api"
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { setIsAuthenticated, get_username } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    setError("");
    setLoading(true);

    api.post("/api/login/", { username, password })
      .then(res => {
        const { access, refresh, role } = res.data;

        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);

        
        setIsAuthenticated(true);
        get_username();
        const from = location?.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      })
      .catch(err => {
        const message =
          err.response?.data?.error ||
          "Invalid username or password";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const inputClass =
    "w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";
  const labelClass =
    "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block";

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">

      {/* LEFT PANEL (HIDDEN ON MOBILE) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 text-white flex-col justify-center px-10">
        <h1 className="text-3xl font-semibold mb-4">MediBook</h1>
        <p className="text-blue-200 text-sm">
          Welcome back! Login to manage your appointments.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 px-6 sm:px-10 py-10">

        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Welcome back
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          Please login to your account
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 space-y-2 text-center">
          <p className="text-sm">
            <a href="#" className="text-blue-600 font-medium">
              Forgot password?
            </a>
          </p>

          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  </div>
);
};

export default Login;