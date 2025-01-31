import React, { useState } from "react";
import { signup } from "../../services/auth";

const Signup = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ger");
    if (!userData.username || !userData.email || !userData.password) {
      alert("All fields are required.");
      return;
    }
    console.log("ger");
    try {
      console.log("ger");
      await signup(userData);
      console.log("ger");
      alert("Signup successful! Please login.");
      //   setUserData({ username: "", email: "", password: "" }); // Reset form
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Signup failed. Please try again later.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={userData.username}
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
