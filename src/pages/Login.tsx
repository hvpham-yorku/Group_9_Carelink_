import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

// Auth services
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

import LoginText from "../components/login/LoginText";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Added back
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/teams");
    }
  }, [user, navigate]);

  const checkCapsLock = (e: React.KeyboardEvent) => {
    setCapsLockActive(e.getModifierState("CapsLock"));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.signIn({ email, password });
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during login.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)",
      }}
    >
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="col-md-6 col-lg-4 d-flex flex-column gap-3 p-4 shadow rounded bg-white">
          <form onSubmit={handleLogin}>
            <LoginText />

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="input-group mb-3">
              <input
                type="email"
                placeholder="Enter email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input Group */}
            <div className="input-group mb-1">
              <input
                type={showPassword ? "text" : "password"} // Dynamic type
                placeholder="Enter password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={checkCapsLock}
                onKeyDown={checkCapsLock}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Caps Lock Warning */}
            <div style={{ minHeight: "20px" }}> {/* Prevents layout jump */}
              {capsLockActive && (
                <div className="text-warning small mb-2" style={{ fontWeight: 500 }}>
                  ⚠️ Caps Lock is ON
                </div>
              )}
            </div>

            <div className="text-end mb-3">
              <Link to="/forgot-password" style={{ fontSize: "0.875rem", textDecoration: "none" }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="text-center mt-3 mb-0">
              New here? <Link to="/signup">Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;