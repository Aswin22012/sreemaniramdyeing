import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/RegisterPage/Register";
import Overview from "./pages/OverviewPage/Overview";
import AdminDashboard from "./pages/AdminDashboardPage/AdminDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Router>
          <Navbar />
          <div className="content-wrap">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Overview />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
