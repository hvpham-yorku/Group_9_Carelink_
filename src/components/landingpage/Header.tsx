import { useNavigate } from "react-router-dom";
import { Heart } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="header d-flex justify-content-between align-items-center px-5 mx-5 py-3 border-bottom">
      <div className="logo-container d-flex align-items-center">
        <Heart size={40} className="text-primary me-2" />
        <h1 className="h3 mb-0 col-6">CareLink</h1>
      </div>

      <nav className="d-flex align-items-center">
        <div className="nav nav-pills me-3">
          <a className="nav-link text-secondary fw-light" href="#features">Features</a>
          <a className="nav-link text-secondary fw-light" href="#benefits">Benefits</a>
          <a className="nav-link text-secondary fw-light" href="#who-its-for">Who It's For</a>
        </div>

        <button
          className="btn btn-primary px-5 py-2 rounded-lg"
          onClick={() => navigate("/login")}
        >
          Sign in
        </button>
      </nav>
    </header>
  )
}

