import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/auth/login", {
      email,
      password,
    });

    const token = res.data.access_token;
    const user = res.data.user; // 👈 IMPORTANT

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user)); // 👈 SAVE USER

    setToken(token);

    navigate("/chat");
  } catch (err) {
    alert("Login failed ❌");
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome back</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Continue
        </button>

        <p style={{ marginTop: "10px" }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    padding: "40px",
    background: "#111827",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    background: "#10a37f",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Login;