import { useState, useEffect, useContext } from "react";
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaEdit, FaCheckCircle } from "react-icons/fa";
import api from "../../api";
import { AuthContext } from "../context/AuthContext";

export default function PatientProfile() {
  const { username } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "", phone: "", gender: ""
  });

  useEffect(() => {
    api.get("/api/profile/")
      .then((res) => {
        setProfile(res.data);
        setFormData({
          email: res.data.email || "",
          phone: res.data.phone || "",
          gender: res.data.gender || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.put("/api/profile/", formData);
      setProfile({ ...profile, ...formData });
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelClass = "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block";

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">⏳ Loading profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="bg-blue-600 py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-blue-100 text-sm mt-1">View and update your personal information</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
            <FaCheckCircle /> Profile updated successfully!
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Avatar + Name */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
            {profile?.username?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{profile?.username}</h2>
            <span className={`inline-block mt-1 text-xs font-medium px-3 py-1 rounded-full ${
              profile?.role === "doctor"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-600"
            }`}>
              {profile?.role}
            </span>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="ml-auto flex items-center gap-2 text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            <FaEdit /> {editing ? "Cancel" : "Edit"}
          </button>
        </div>

       
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-5">Personal Information</h3>

          {!editing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <FaUser className="text-blue-400 w-4" />
                <span className="text-gray-400 w-20">Username</span>
                <span className="text-gray-700 font-medium">{profile?.username}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-blue-400 w-4" />
                <span className="text-gray-400 w-20">Email</span>
                <span className="text-gray-700 font-medium">{profile?.email || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaPhone className="text-blue-400 w-4" />
                <span className="text-gray-400 w-20">Phone</span>
                <span className="text-gray-700 font-medium">{profile?.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaVenusMars className="text-blue-400 w-4" />
                <span className="text-gray-400 w-20">Gender</span>
                <span className="text-gray-700 font-medium capitalize">{profile?.gender || "—"}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClass}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition mt-2"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}