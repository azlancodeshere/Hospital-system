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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-lg">

     
        <div className="flex flex-col justify-center bg-blue-700 text-white px-10 py-12 w-72">
          <h1 className="text-2xl font-semibold mb-3">MediBook</h1>
          <p className="text-blue-200 text-sm leading-relaxed">
            Book appointments with top doctors in your city, anytime.
          </p>
          <div className="flex gap-2 mt-8">
            <div className="w-6 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>

     
        <div className="flex-1 bg-white px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Create your account
          </h2>

          
          <div className="flex bg-gray-100 rounded-lg p-1 mb-5 gap-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "patient" })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${formData.role === "patient"
                  ? "bg-white text-blue-700 shadow-sm border border-gray-200"
                  : "text-gray-500"
                }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "doctor" })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${formData.role === "doctor"
                  ? "bg-white text-blue-700 shadow-sm border border-gray-200"
                  : "text-gray-500"
                }`}
            >
              Doctor
            </button>
          </div>

          <form onSubmit={handleSubmit}>
           
            <div className="mb-3">
              <label className={labelClass}>Username</label>
              <input
                type="text"
                name="username"
                placeholder="e.g. john_doe"
                value={formData.username}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            
            <div className="mb-3">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

           
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Confirm password</label>
                <input
                  type="password"
                  name="password2"
                  placeholder="••••••••"
                  value={formData.password2}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

           
            <div className="mb-3">
              <label className={labelClass}>Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>


           
            <div className="mb-3">
              <label className={labelClass}>Gender</label>
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
            </div>

           
            {formData.role === "doctor" && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Doctor details
                </p>
                <div className="mb-3">
                  <label className={labelClass}>Specialization</label>
                  <input
                    name="specialization"
                    placeholder="e.g. Cardiologist"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Experience (yrs)</label>
                    <input
                      name="experience_years"
                      type="number"
                      placeholder="5"
                      value={formData.experience_years}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Fee (₹)</label>
                    <input
                      name="consultation_fee"
                      type="number"
                      placeholder="500"
                      value={formData.consultation_fee}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-lg text-sm font-semibold transition mt-5"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-xs mt-4 text-gray-400">
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