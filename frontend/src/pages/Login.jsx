import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);

      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}
