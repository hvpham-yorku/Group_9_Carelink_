import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
}

const StatCard = ({ title, value, description, icon }: StatCardProps) => {
  return (
    <div
      className="bg-white shadow-sm h-100"
      style={{
        borderRadius: "18px",
        border: "1px solid #e9ecef",
      }}
    >
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className="text-muted" style={{ fontSize: "0.95rem" }}>
            {title}
          </span>

          {icon}
        </div>

        <h2 className="fw-bold mb-1">{value}</h2>
        <p className="text-muted mb-0">{description}</p>
      </div>
    </div>
  );
};

export default StatCard;