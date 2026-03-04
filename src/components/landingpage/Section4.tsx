import { CheckCircle2 } from 'lucide-react';

export default function Section4() {
    return (
        <section className="bg-primary py-5">
            <div className="container">
                <div className="row align-items-center"> 
                    <div className="col-md-6">
                        <img 
                            className="img-fluid rounded shadow-lg" 
                            src="https://images.unsplash.com/photo-1707286380312-ad352aa56cde?..." 
                            style={{ maxHeight: '500px', objectFit: 'cover' }} 
                        />
                    </div>
                    <div className="col-md-6 ps-lg-5 text-white">
                        <h2 className="display-6 fw-bold mb-4">The CareLink Difference</h2>
                        <div className="mb-4">
                            <div className="d-flex align-items-center mb-2">
                                <CheckCircle2 size={24} className="me-3" /> 
                                <h5 className="mb-0">Reduce Missed Care Actions</h5>
                            </div>
                            <p className="fw-light opacity-75 ms-5">
                                Visual indicators and shared task lists ensure nothing falls through the cracks.
                            </p>
                        </div>
                        <div className="mb-4">
                            <div className="d-flex align-items-center mb-2">
                                <CheckCircle2 size={24} className="me-3" /> 
                                <h5 className="mb-0">Improve Shift Continuity</h5>
                            </div>
                            <p className="fw-light opacity-75 ms-5">
                                Clear handoff notes mean every caregiver knows exactly what happened.
                            </p>
                        </div>
                        <div className="mb-4">
                            <div className="d-flex align-items-center mb-2">
                                <CheckCircle2 size={24} className="me-3" /> 
                                <h5 className="mb-0">Single Source of Truth</h5>
                            </div>
                            <p className="fw-light opacity-75 ms-5">
                                No more hunting through texts or paper notes—everything in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}