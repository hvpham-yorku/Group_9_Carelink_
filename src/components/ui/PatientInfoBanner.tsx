const PatientInfoBanner = () => {
  return (
    <>
      <div className="p-4 mb-4" style={styles.banner}>
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <div>
            <div
              className="fw-bold"
              style={{ fontSize: "2.6rem", lineHeight: 1.1 }}
            >
              {patient.name}
            </div>
            <div style={{ color: "rgba(255,255,255,0.85)" }}>
              {patient.meta}
            </div>

            {/* Condition pills */}
            <div className="mt-3 d-flex flex-wrap gap-2">
              {patient.conditions.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 rounded-pill"
                  style={styles.pill}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Emergency contact (right side card) */}
          <div
            className="p-3"
            style={{
              borderRadius: "14px",
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.15)",
              minWidth: "240px",
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem" }}
            >
              Emergency Contact
            </div>
            <div className="fw-semibold mt-1">{patient.emergencyContact}</div>
            <div className="mt-1" style={{ color: "rgba(255,255,255,0.9)" }}>
              {patient.emergencyPhone}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientInfoBanner;
