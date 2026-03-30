import { CheckCircle, XCircle } from "lucide-react";

interface CustomToastProps {
  message: string;
  type: "success" | "danger";
  onClose: () => void;
}

export default function CustomToast({
  message,
  type,
  onClose,
}: CustomToastProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 1055,
        minWidth: "280px",
      }}
    >
      <div
        className={`d-flex align-items-center gap-3 px-4 py-3 rounded-3 shadow text-white bg-${type}`}
      >
        {type === "success" ? (
          <CheckCircle size={20} className="flex-shrink-0" />
        ) : (
          <XCircle size={20} className="flex-shrink-0" />
        )}
        <span className="fw-medium small">{message}</span>
        <button
          type="button"
          className="btn-close btn-close-white ms-auto"
          style={{ fontSize: "0.7rem" }}
          onClick={onClose}
        />
      </div>
    </div>
  );
}
