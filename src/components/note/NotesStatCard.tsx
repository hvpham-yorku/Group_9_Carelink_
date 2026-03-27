import type { ReactNode } from "react";

type Props = {
  title: string;
  value: number;
  subtitle: string;
  icon: ReactNode;
  onClick?: () => void;
  accentClassName?: string;
  isActive?: boolean;
};

export default function NotesStatCard({
  title,
  value,
  subtitle,
  icon,
  onClick,
  isActive = false,
}: Props) {
  return (
    <div
      className="card border-0 h-100"
      style={{
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        borderRadius: "1rem",
        boxShadow: isActive
          ? "0 0 0 2px rgba(13, 110, 253, 0.35), 0 6px 20px rgba(0,0,0,0.08)"
          : "0 4px 14px rgba(0,0,0,0.06)",
        transform: "translateY(0)",
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(-3px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onClick={onClick}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="text-muted small fw-semibold">{title}</div>

          {/* ===== ICON BUBBLE ===== */}
          <div
            className="d-inline-flex align-items-center justify-content-center"
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(144, 238, 144, 0.15))",
            }}
          >
            {icon}
          </div>
        </div>

        {/* ===== VALUE ===== */}
        <div
          className="fw-bold"
          style={{
            fontSize: "1.6rem",
            color: isActive ? "#0d6efd" : "#1e2a38",
          }}
        >
          {value}
        </div>

        {/* ===== SUBTITLE ===== */}
        <div className="text-muted small">{subtitle}</div>
      </div>

      {/* ===== BOTTOM ACCENT BAR ===== */}
      <div
        style={{
          height: "4px",
          borderBottomLeftRadius: "1rem",
          borderBottomRightRadius: "1rem",
          background: isActive
            ? "linear-gradient(90deg, #4facfe, #00f2fe)"
            : "linear-gradient(90deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05))",
        }}
      />
    </div>
  );
}