import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Trash2, 
  ArrowLeft, 
  ShieldCheck,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AccountSettings() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: "John",
        lastName: "Doe",
        username: "johndoe_care", // IMMUTABLE
        email: "john.doe@example.com",
        phoneNumber: "+1 (555) 000-0000",
        password: "password123"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container" style={{ maxWidth: '850px' }}>
                
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
                            <p className="text-muted small mb-0">Update your information and security</p>
                        </div>
                    </div>
                    <button className="btn btn-primary px-4 shadow-sm fw-medium" onClick={() => alert("Changes Saved!")}>
                        <Save size={18} className="me-2" />
                        Save Changes
                    </button>
                </div>

                <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
                    
                    <div className="p-4 bg-white border-bottom">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                                <User className="text-primary" size={28} />
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1 text-dark">@{formData.username}</h5>
                                <div className="d-flex align-items-center gap-2 text-success small fw-medium">
                                    <ShieldCheck size={16} />
                                    Verified Caregiver ID
                                </div>
                                <div className="text-muted x-small mt-1" style={{ fontSize: '11px' }}>
                                    Username is permanent and cannot be changed.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white border-bottom">
                        <h6 className="fw-bold text-dark mb-4 small text-uppercase letter-spacing-1">Personal Details</h6>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="text-muted small fw-bold mb-2">FIRST NAME</label>
                                <input 
                                    name="firstName" 
                                    className="form-control border-light bg-light bg-opacity-50 py-2" 
                                    value={formData.firstName} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small fw-bold mb-2">LAST NAME</label>
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
                        <h6 className="fw-bold text-dark mb-4 small text-uppercase letter-spacing-1">Contact & Security</h6>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="text-muted small fw-bold mb-2">EMAIL ADDRESS</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0"><Mail size={16} className="text-muted" /></span>
                                    <input 
                                        name="email" 
                                        className="form-control border-start-0 py-2" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small fw-bold mb-2">PHONE NUMBER</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0"><Phone size={16} className="text-muted" /></span>
                                    <input 
                                        name="phoneNumber" 
                                        className="form-control border-start-0 py-2" 
                                        value={formData.phoneNumber} 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="text-muted small fw-bold mb-2">UPDATE PASSWORD</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0"><Lock size={16} className="text-muted" /></span>
                                    <input 
                                        name="password" 
                                        type={showPassword ? "text" : "password"} 
                                        className="form-control border-start-0 border-end-0 py-2" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                    />
                                    <button 
                                        className="btn btn-white border border-start-0 text-muted" 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="text-muted small mt-2 mb-0">Password must be at least 8 characters long.</p>
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
                                    <p className="text-muted small mb-0">Permanently remove your account and all data.</p>
                                </div>
                            </div>
                            <button className="btn btn-outline-danger btn-sm px-4 fw-medium" onClick={() => window.confirm("Delete account?")}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p className="text-muted small opacity-50">CareLink Platform &bull; Professional Caregiver Suite</p>
                </div>
            </div>
        </div>
    );
}