import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import LoginText from "../components/login/LoginText";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/teams");
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
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "linear-gradient(to bottom, #f8fafc, #f1f5f9)", minHeight: "100vh" }} className="d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "1rem" }}>
              
              <div style={{ height: "4px", background: "transparent" }}>
                {loading && (
                  <div className="progress rounded-0" style={{ height: "4px" }}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated w-100 bg-primary"></div>
                  </div>
                )}
              </div>

              <div className="card-body p-4 p-lg-5">
                <div className="text-center mb-4">
                  <LoginText />
                </div>

                {error && <div className="alert alert-danger border-0 small text-center mb-4">{error}</div>}

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-semibold">Email Address</label>
                    <input
                      type="email"
                      className="form-control form-control-lg fs-6 border-light-subtle"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <div className="d-flex justify-content-between">
                      <label className="form-label small text-muted fw-semibold">Password</label>
                      <Link to="/forgot-password" style={{ fontSize: "0.8rem" }} className="text-decoration-none">Forgot?</Link>
                    </div>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg fs-6 border-light-subtle"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyUp={checkCapsLock}
                        onKeyDown={checkCapsLock}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-light border-light-subtle text-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div style={{ minHeight: "22px" }} className="mb-3">
                    {capsLockActive && (
                      <div className="text-warning small" style={{ fontSize: "0.75rem" }}>
                        ⚠️ Caps Lock is on
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fs-6 fw-bold shadow-sm"
                    disabled={loading}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>

                  <p className="text-center mt-4 mb-0 text-muted small">
                    New here? <Link to="/signup" className="fw-semibold text-decoration-none">Create account</Link>
                  </p>
                </form>
              </div>
            </div>
            <p className="text-center text-muted mt-4" style={{ fontSize: "0.75rem" }}>
              &copy; 2026 CareLink. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;