import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProfilePage.css"

function ProfilePage() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name);
        setDepartment(res.data.department || "");
        setRole(res.data.role);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        { name, department },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Update failed.");
    }
  };

  return (
    <div className="profile-wrapper">
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <br />
        {role === "admin" && (
          <div>
            
            <label>Department:</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="" disabled hidden>
                Department Name
              </option>
              <option value="Chemical">Chemical</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>
        )}
        <br/ >
        <button type="submit">Update Profile</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default ProfilePage;
