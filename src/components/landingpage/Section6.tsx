import { useNavigate } from "react-router-dom";

export default function Section6() {
    const navigate = useNavigate();
    return (
        <section className="bg-primary-subtle">
            <div className="row justify-content-center text-center p-5">
                <div className="col-6 col-lg-7 col-md-8 my-5">
                    <h2 className="fw-bold mb-3">Ready to Improve Your Care Coordination?</h2>
                    <h5 className="text-secondary fw-light mb-4">
                    Join home care teams who trust CareLink to reduce missed care actions and improve patient safety.
                    </h5>
                    <button
                        className="btn btn-primary btn-lg px-5"
                        onClick={() => navigate("/dashboard")}
                    >
                        Get Started!
                    </button>
                </div> 
            </div>
        </section>
    )
}