import React, { useState } from "react";
import { login } from "../../services/auth";
import useAuthStore from "../../store/auth";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login: storeLogin } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      storeLogin(response.data.userDetails, response.data.accessToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
