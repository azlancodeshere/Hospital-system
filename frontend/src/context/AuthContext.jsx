import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../api";

const AuthContext = createContext(false);

function AuthProvider({ children }) {

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access"));
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
     localStorage.removeItem("role");      
    localStorage.removeItem("username");   
    setIsAuthenticated(false);
    setUsername("");
    setRole("");
  };

  
  function get_username() {
    api.get("/api/get_username/")
      .then(res => {
        setUsername(res.data.username);
      })
      .catch(err => {
        console.log(err.message);
        logout(); 
      });
  }

  
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expiry_date = decoded.exp;
      const current_time = Date.now() / 1000;

      if (expiry_date >= current_time) {
        setIsAuthenticated(true);
       
        get_username();
      } else {
        logout(); 
      }
    } catch (error) {
      console.log("Invalid token");
      logout(); 
    }
  }, []);


  const authValue = {
    isAuthenticated,
    username,
    setIsAuthenticated,
    get_username,
    role,          
    setRole,       
    logout
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };