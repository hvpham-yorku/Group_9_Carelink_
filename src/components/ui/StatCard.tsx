import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  backgroundColor?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  backgroundColor = "#ffffff",
}: StatCardProps) => {
  return (
    <div
      className="h-100"
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
      }}
    >
      <div className="p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            {title}
          </span>

          <div
            style={{
              backgroundColor,
              borderRadius: "10px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </div>
        </div>

        <h2
          className="fw-bold mb-1"
          style={{ fontSize: "1.8rem", color: "#111827" }}
        >
          {value}
        </h2>

        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: 0 }}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default StatCard;