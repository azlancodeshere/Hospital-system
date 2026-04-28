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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg">

        {/* Left Panel */}
        <div className="flex flex-col justify-center bg-blue-700 text-white px-10 py-12 w-72">
          <h1 className="text-2xl font-semibold mb-3">MediBook</h1>
          <p className="text-blue-200 text-sm leading-relaxed">
            Welcome back! Login to manage your appointments.
          </p>
          <div className="flex gap-2 mt-8">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-6 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-white px-8 py-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Please login to your account
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={labelClass}>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="mb-4">
              <label className={labelClass}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-lg text-sm font-semibold transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 space-y-2 text-center">
            <p className="text-xs text-gray-400">
              <a href="#" className="text-blue-600 font-medium">
                Forgot password?
              </a>
            </p>
            <p className="text-xs text-gray-400">
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