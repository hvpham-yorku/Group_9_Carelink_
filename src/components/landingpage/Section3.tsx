import { Calendar, ClipboardList, Users, Shield, Bell, CheckCircle2 } from 'lucide-react';

export default function Section3() {
    return (
        <section className="container my-5 py-5">
            {/* Header - Centered with controlled width */}
            <div className="row justify-content-center text-center mb-5">
                <div className="col-lg-8">
                    <h2 className="fw-bold mb-3">Built for Home Care Teams</h2>
                    <p className="text-secondary fw-light fs-5">
                        Features designed with real nurses and PSWs to address home healthcare's unique challenges
                    </p>
                </div>
            </div>

            {/* The Grid: 1 column on mobile, 2 on tablets, 3 on desktops */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                
                {/* Card 1 */}
                <div className="col">
                    <div className="card h-100 p-4 border-0 shadow-sm hover-shadow-transition">
                        <div className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4" style={{ width: '50px', height: '50px' }}>
                            <Users className="text-primary" size={24} />
                        </div>
                        <h5 className="fw-bold text-dark">Patient-Centric Workspace</h5>
                        <p className="text-secondary small mb-0">
                            All caregivers for a patient collaborate in one shared place. No more scattered notes or missed communications.
                        </p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="col">
                    <div className="card h-100 p-4 border-0 shadow-sm hover-shadow-transition">
                        <div className="rounded-3 bg-success bg-opacity-10 d-flex align-items-center justify-content-center mb-4" style={{ width: '50px', height: '50px' }}>
                            <ClipboardList className="text-success" size={24} />
                        </div>
                        <h5 className="fw-bold text-dark">Shift Handoff Notes</h5>
                        <p className="text-secondary small mb-0">
                            Purpose-built caregiver-to-caregiver communication. Share critical updates and care instructions seamlessly.
                        </p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="col">
                    <div className="card h-100 p-4 border-0 shadow-sm hover-shadow-transition">
                        <div className="rounded-3 bg-info bg-opacity-10 d-flex align-items-center justify-content-center mb-4" style={{ width: '50px', height: '50px' }}>
                            <Calendar className="text-info" size={24} />
                        </div>
                        <h5 className="fw-bold text-dark">Tasks & Medications</h5>
                        <p className="text-secondary small mb-0">
                            Lightweight tracking without hospital-level complexity. Visual indicators show missed tasks at a glance.
                        </p>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="col">
                    <div className="card h-100 p-4 border-0 shadow-sm hover-shadow-transition">
                        <div className="rounded-3 bg-warning bg-opacity-10 d-flex align-items-center justify-content-center mb-4" style={{ width: '50px', height: '50px' }}>
                            <Shield className="text-warning" size={24} />
                        </div>
                        <h5 className="fw-bold text-dark">Role-Based Access</h5>
                        <p className="text-secondary small mb-0">
                            Caregivers get edit access. Family members can view updates. Control who modifies patient information.
                        </p>
                    </div>
                </div>

                {/* Card 5 */}
                <div className="col">
                    <div className="card h-100 p-4 border-0 shadow-sm hover-shadow-transition">
                        <div className="rounded-3 bg-danger bg-opacity-10 d-flex align-items-center justify-content-center mb-4" style={{ width: '50px', height: '50px' }}>
                            <Bell className="text-danger" size={24} />
                        </div>
                        <h5 className="fw-bold text-dark">Multiple Patients & Locations</h5>
                        <p className="text-secondary small mb-0">
                            Manage all your patients from one dashboard. See schedules, locations, and urgent items across your entire caseload.
                        </p>
                    </div>
                </div>

                {/* Card 6 */}
                <div className="col">
                    <div className="card h-100 p-4 border-0 shadow-sm hover-shadow-transition">
                        <div className="rounded-3 bg-dark bg-opacity-10 d-flex align-items-center justify-content-center mb-4" style={{ width: '50px', height: '50px' }}>
                            <CheckCircle2 className="text-dark" size={24} />
                        </div>
                        <h5 className="fw-bold text-dark">Low Learning Curve</h5>
                        <p className="text-secondary small mb-0">
                            Simple, intuitive interface designed for non-technical users. Spend time caring, not learning software.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}