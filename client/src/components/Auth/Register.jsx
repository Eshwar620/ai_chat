import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState(""); // ✅ ADD THIS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    // ✅ Validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/register",
        {
          name,      // ✅ FIX
          email,
          password,
        }
      );

      console.log("✅ REGISTER SUCCESS:", res.data);

      alert("Registered successfully ✅");

      // 🔥 Go to login page
      navigate("/");

    } catch (err) {
      console.error("❌ ERROR:", err.response?.data);

      setError(
        err.response?.data?.detail ||
        "Registration failed ❌"
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create account</h2>

        {error && <p style={styles.error}>{error}</p>}

        {/* ✅ NAME FIELD */}
        <input
          placeholder="Name"
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleRegister}>
          Continue
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    width: "360px",
    padding: "32px",
    borderRadius: "12px",
    background: "#111827",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    color: "white",
    textAlign: "center",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #374151",
    background: "#020617",
    color: "white",
  },
  button: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    background: "#10a37f",
    color: "white",
    cursor: "pointer",
  },
  footer: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: "14px",
  },
  link: {
    color: "#3b82f6",
    cursor: "pointer",
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
    fontSize: "13px",
  },
};

export default Register;