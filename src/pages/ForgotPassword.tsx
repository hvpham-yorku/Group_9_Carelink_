import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (step === "request") {
        setStep("verify");
      } else {
        navigate("/teams");
      }
    }, 1000);
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)" }}>
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="col-md-6 col-lg-4 p-4 shadow rounded bg-white">
          
          <div className="text-center mb-4">
            <h3 className="fw-bold">
              {step === "request" ? "Verify Your Email" : "Check Your Inbox"}
            </h3>
            <p className="text-muted small">
              {step === "request" 
                ? "Enter your email address to receive a 6-digit verification code." 
                : `We've sent a code to ${email}`}
            </p>
          </div>
          
          <form onSubmit={handleAction}>
            {step === "request" ? (
              <div className="mb-4">
                <label className="form-label small fw-bold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="mb-4 text-center">
                <label className="form-label small fw-bold mb-3">Verification Code</label>
                <input
                  type="text"
                  className="form-control text-center fw-bold fs-3"
                  placeholder="000000"
                  maxLength={6}
                  style={{ letterSpacing: "10px", border: "2px solid #dee2e6" }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-link btn-sm mt-3 text-decoration-none"
                  onClick={() => setStep("request")}
                >
                  Entered the wrong email?
                </button>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : step === "request" ? (
                "Send Code"
              ) : (
                "Verify & Login"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/login" className="text-decoration-none small text-secondary">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;