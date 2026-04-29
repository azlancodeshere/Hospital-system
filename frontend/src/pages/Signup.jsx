import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";


const Signup = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, get_username, setRole} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    phone: "",
    gender: "",
    role: "patient",
    specialization: "",
    experience_years: "",
    consultation_fee: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const username = formData.username.trim();
    if (formData.password !== formData.password2) {
      alert("Passwords do not match");
      return;
    }
    try {
      setLoading(true);


    const payload = {
      ...formData,
      username,
      experience_years: formData.experience_years ? parseInt(formData.experience_years) : 0,
      consultation_fee: formData.consultation_fee ? parseFloat(formData.consultation_fee) : 0,
    };



      await api.post("/api/register/", payload);

      const autoLogin = await api.post("/api/login/", {
        username,
        password: formData.password,
      });
      const { access, refresh, role } = autoLogin.data;


      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);


      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      setIsAuthenticated(true);
      setRole(role);
      get_username(username);
       alert("User registered successfully");

      navigate("/");
    } catch (err) {
      console.error("ERROR:", err);
  console.error("RESPONSE:", err.response);
  console.error("DATA:", err.response?.data);
  console.error("MESSAGE:", err.message);
  
  alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";
  const labelClass = "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block";

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">

      {/* LEFT PANEL (HIDDEN ON MOBILE) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 text-white flex-col justify-center px-10">
        <h1 className="text-3xl font-semibold mb-4">MediBook</h1>
        <p className="text-blue-200 text-sm">
          Book appointments with top doctors in your city, anytime.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 px-6 sm:px-10 py-8">

        <h2 className="text-2xl font-semibold text-gray-800 mb-5">
          Create your account
        </h2>

        {/* ROLE SWITCH */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-5 gap-1">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "patient" })}
            className={`flex-1 py-2 text-sm rounded-md ${
              formData.role === "patient"
                ? "bg-white text-blue-700 shadow border"
                : "text-gray-500"
            }`}
          >
            Patient
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "doctor" })}
            className={`flex-1 py-2 text-sm rounded-md ${
              formData.role === "doctor"
                ? "bg-white text-blue-700 shadow border"
                : "text-gray-500"
            }`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            required
          />

          {/* PASSWORD FIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
              required
            />
            <input
              type="password"
              name="password2"
              placeholder="Confirm password"
              value={formData.password2}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* DOCTOR FIELDS */}
          {formData.role === "doctor" && (
            <div className="space-y-3 border-t pt-4">
              <input
                name="specialization"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={inputClass}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="experience_years"
                  type="number"
                  placeholder="Experience (years)"
                  value={formData.experience_years}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <input
                  name="consultation_fee"
                  type="number"
                  placeholder="Consultation fee"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  </div>
);
};

export default Signup;