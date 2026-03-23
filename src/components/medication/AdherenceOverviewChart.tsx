interface AdherenceDay {
  day: string;
  taken: number;
  total: number;
}

interface AdherenceOverviewChartProps {
  data: AdherenceDay[];
}

const AdherenceOverviewChart = ({
  data,
}: AdherenceOverviewChartProps) => {
  const maxTotal = Math.max(...data.map((item) => item.total), 1);

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <div className="fw-semibold">7-Day Adherence Overview</div>
          <div className="text-muted" style={{ fontSize: "0.92rem" }}>
            Daily medication completion trends
          </div>
        </div>

        <div className="text-muted" style={{ fontSize: "0.88rem" }}>
          Last 7 days
        </div>
      </div>

      <div className="row g-3">
        {data.map((item) => {
          const takenHeight = item.total > 0 ? (item.taken / maxTotal) * 120 : 0;
          const totalHeight = item.total > 0 ? (item.total / maxTotal) * 120 : 0;
          const adherence =
            item.total > 0 ? Math.round((item.taken / item.total) * 100) : 0;

          return (
            <div key={item.day} className="col">
              <div
                className="d-flex flex-column align-items-center justify-content-end h-100"
                style={{
                  minHeight: "190px",
                  borderRadius: "18px",
                  padding: "1rem 0.5rem",
                  background: "#ffffff",
                  border: "1px solid #e9ecef",
                }}
              >
                <div
                  className="d-flex align-items-end justify-content-center gap-1 mb-3"
                  style={{ height: "125px" }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: `${totalHeight}px`,
                      minHeight: item.total > 0 ? "16px" : "0px",
                      borderRadius: "999px",
                      backgroundColor: "#e9ecef",
                    }}
                  />

                  <div
                    style={{
                      width: "16px",
                      height: `${takenHeight}px`,
                      minHeight: item.taken > 0 ? "16px" : "0px",
                      borderRadius: "999px",
                      backgroundColor: "#0d6efd",
                    }}
                  />
                </div>

                <div className="fw-semibold mb-1" style={{ fontSize: "0.92rem" }}>
                  {item.day}
                </div>

                <div className="text-muted mb-1" style={{ fontSize: "0.82rem" }}>
                  {item.taken}/{item.total}
                </div>

                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: adherence >= 80 ? "#d1e7dd" : "#fff3cd",
                    color: adherence >= 80 ? "#146c43" : "#997404",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.45rem 0.65rem",
                  }}
                >
                  {adherence}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="d-flex align-items-center gap-3 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "999px",
              backgroundColor: "#0d6efd",
              display: "inline-block",
            }}
          />
          <span className="text-muted" style={{ fontSize: "0.85rem" }}>
            Taken
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "999px",
              backgroundColor: "#e9ecef",
              display: "inline-block",
            }}
          />
          <span className="text-muted" style={{ fontSize: "0.85rem" }}>
            Scheduled
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdherenceOverviewChart;