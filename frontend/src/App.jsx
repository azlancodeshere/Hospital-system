import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MainLayout from './layout/MainLayout';
import Home from "./pages/HomePage";
import DoctorList from "./pages/DoctorList";
import DoctorDetail from "./pages/DoctorDetail";
import AddSlot from "./pages/AddSlot";
import BookAppointment from "./pages/BookAppointment";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientProfile from "./pages/PatientProfile";
import DoctorProfile from "./DoctorProfile";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/doctors" element={<DoctorList />} />          
          <Route path="/doctors/:id" element={<DoctorDetail />} />    
          <Route path="/doctor/slots/add" element={<AddSlot />} />
          <Route path="/doctors/:id/book" element={<BookAppointment />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/profile" element={<PatientProfile />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
        </Route>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;