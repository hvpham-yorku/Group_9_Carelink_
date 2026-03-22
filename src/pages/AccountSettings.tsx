import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const navigate = useNavigate();

  // 1. Local State for all fields (UI Only)
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    username: "jdoe_dev",
    email: "john.doe@example.com",
    phoneNumber: "+1 (555) 123-4567",
    password: "••••••••", // Placeholder text for UI
  });

  const [showPassword, setShowPassword] = useState(false);

  // 2. Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Simple Submit Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Changes saved to local state! (UI Demo)");
    console.log("Updated Data:", formData);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0">Account Settings</h2>
            <button 
            className="btn btn-outline-secondary btn-sm" 
            onClick={() => navigate(-1)} // This goes back to previous page
            >
            Back to dashboard
            </button>
          </div>

          <form onSubmit={handleSave}>
            {/* --- SECTION: Personal Information --- */}
            <div className="card shadow-sm border-0 p-4 mb-4">
              <h5 className="mb-4 text-primary border-bottom pb-2">Personal Information</h5>
              
              <div className="row g-3">
                {/* First Name */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">FIRST NAME</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                {/* Last Name */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">LAST NAME</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                {/* Username */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">USERNAME</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">@</span>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">PHONE NUMBER</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="form-control"
                    placeholder="+1 (000) 000-0000"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* --- SECTION: Account Security --- */}
            <div className="card shadow-sm border-0 p-4 mb-4">
              <h5 className="mb-4 text-primary border-bottom pb-2">Account Security</h5>
              
              <div className="row g-3">
                {/* Email (Read Only) */}
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={formData.email}
                    disabled
                    readOnly
                  />
                  <div className="form-text">Verified email cannot be changed.</div>
                </div>

                {/* Password Field */}
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">PASSWORD</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* --- ACTIONS --- */}
            <div className="d-flex justify-content-end gap-3 mt-4">
              <button type="button" className="btn btn-light border px-4" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-5 shadow-sm">
                Save Changes
              </button>
            </div>
          </form>

          {/* --- DANGER ZONE --- */}
          <div className="mt-5 pt-4 border-top">
            <div className="alert alert-light border d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold text-danger mb-1">Delete Account</h6>
                <p className="small text-muted mb-0">Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <button 
                className="btn btn-outline-danger"
                onClick={() => window.confirm("Are you absolutely sure?")}
              >
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountSettings;