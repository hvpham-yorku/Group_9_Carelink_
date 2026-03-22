import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const navigate = useNavigate();

  // Simple local state for the UI demo
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email] = useState("john.doe@example.com"); // Static for now

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          
          {/* Header */}
          <div className="mb-4">
            <h2 className="fw-bold">Account Settings</h2>
            <p className="text-muted">Update your personal information below.</p>
          </div>

          {/* Settings Card */}
          <div className="card shadow-sm border-0 p-4">
            <form>
              <div className="row">
                {/* First Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-uppercase text-muted">First Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                {/* Last Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-uppercase text-muted">Last Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase text-muted">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-lg bg-light"
                  value={email}
                  readOnly
                  disabled
                />
                <div className="form-text">Contact support to change your verified email.</div>
              </div>

              <hr className="my-4 text-secondary opacity-25" />

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary px-4"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary px-4"
                  onClick={() => alert("UI Demo: Changes would be saved here!")}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone Placeholder (Great for future stories) */}
          <div className="mt-5 pt-3 border-top">
            <h5 className="text-danger">Danger Zone</h5>
            <button className="btn btn-outline-danger btn-sm mt-2">Delete Account</button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;