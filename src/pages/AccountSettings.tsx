import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Save,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { repositories } from "../data";
import CustomToast from "../components/ui/CustomToast";

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "danger") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    },
    [],
  );

  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [original, setOriginal] = useState(emptyForm);

  useEffect(() => {
    if (!user) return;
    repositories.profile
      .getProfile(user.id)
      .then((profile) => {
        const data = {
          firstName: profile.firstName ?? "",
          lastName: profile.lastName ?? "",
          email: profile.email ?? "",
          phoneNumber: profile.phoneNumber ?? "",
          jobTitle: profile.jobTitle ?? "",
        };
        setFormData(data);
        setOriginal(data);
      })
      .catch(console.error)
      .finally(() => setPageLoading(false));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const repo = repositories.profile;
      const updates: Promise<void>[] = [];

      if (formData.firstName !== original.firstName)
        updates.push(repo.updateFirstName(user.id, formData.firstName));
      if (formData.lastName !== original.lastName)
        updates.push(repo.updateLastName(user.id, formData.lastName));
      if (formData.phoneNumber !== original.phoneNumber)
        updates.push(repo.updatePhoneNumber(user.id, formData.phoneNumber));
      if (formData.jobTitle !== original.jobTitle)
        updates.push(repo.updateJobTitle(user.id, formData.jobTitle));

      await Promise.all(updates);
      setOriginal({ ...formData });
      showToast("Changes saved successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save changes.", "danger");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      {toast && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="container" style={{ maxWidth: "850px" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-white border shadow-sm rounded-circle p-2"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft size={20} className="text-dark" />
            </button>
            <div>
              <h2 className="fw-bold m-0 h4">Account Settings</h2>
              <p className="text-muted small mb-0">
                Update your information and preferences
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary px-4 shadow-sm fw-medium"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={18} className="me-2" />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        <div
          className="card border-0 shadow-sm overflow-hidden"
          style={{ borderRadius: "16px" }}
        >
          <div className="p-4 bg-white border-bottom">
            <div className="d-flex align-items-center gap-4">
              <div
                className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                style={{ width: "70px", height: "70px" }}
              >
                <User className="text-primary" size={28} />
              </div>
              <div>
                <h5 className="fw-bold mb-1 text-dark">
                  {formData.firstName || formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`.trim()
                    : "—"}
                </h5>
                <div className="d-flex align-items-center gap-2 text-success small fw-medium">
                  <ShieldCheck size={16} />
                  Verified Caregiver
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-bottom">
            <h6 className="fw-bold text-dark mb-4 small text-uppercase letter-spacing-1">
              Personal Details
            </h6>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="text-muted small fw-bold mb-2">
                  FIRST NAME
                </label>
                <input
                  name="firstName"
                  className="form-control border-light bg-light bg-opacity-50 py-2"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="text-muted small fw-bold mb-2">
                  LAST NAME
                </label>
                <input
                  name="lastName"
                  className="form-control border-light bg-light bg-opacity-50 py-2"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-bottom">
            <h6 className="fw-bold text-dark mb-4 small text-uppercase letter-spacing-1">
              Contact & Role
            </h6>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="text-muted small fw-bold mb-2">
                  EMAIL ADDRESS
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Mail size={16} className="text-muted" />
                  </span>
                  <input
                    name="email"
                    className="form-control border-start-0 py-2 bg-light text-muted"
                    value={formData.email}
                    readOnly
                  />
                </div>
                <p
                  className="text-muted small mt-1 mb-0"
                  style={{ fontSize: "11px" }}
                >
                  Email cannot be changed here.
                </p>
              </div>
              <div className="col-md-6">
                <label className="text-muted small fw-bold mb-2">
                  PHONE NUMBER
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Phone size={16} className="text-muted" />
                  </span>
                  <input
                    name="phoneNumber"
                    className="form-control border-start-0 py-2"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12">
                <label className="text-muted small fw-bold mb-2">
                  JOB TITLE
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Briefcase size={16} className="text-muted" />
                  </span>
                  <input
                    name="jobTitle"
                    className="form-control border-start-0 py-2"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-light bg-opacity-50">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-danger bg-opacity-10 p-2 rounded">
                  <Trash2 className="text-danger" size={18} />
                </div>
                <div>
                  <h6 className="fw-bold text-danger mb-0">Delete Account</h6>
                  <p className="text-muted small mb-0">
                    Permanently remove your account and all data.
                  </p>
                </div>
              </div>
              <button
                className="btn btn-outline-danger btn-sm px-4 fw-medium"
                disabled
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-muted small opacity-50">
            CareLink Platform &bull; Professional Caregiver Suite
          </p>
        </div>
      </div>
    </div>
  );
}
