import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Assuming your authService has a resetPassword method
      await authService.resetPassword(email);
      setMessage("Check your email for a password reset link.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)" }}>
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="col-md-6 col-lg-4 d-flex flex-column gap-3 p-4 shadow rounded bg-white">
          <h2 className="text-center mb-3">Reset Password</h2>
          <p className="text-muted text-center mb-4">
            Enter your email and we'll send you a link to get back into your account.
          </p>

          <form onSubmit={handleReset}>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center mt-3">
              <Link to="/login" className="text-decoration-none">Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;