import type { ReactNode } from "react";

interface CustomTitleBannerProps {
  title: string;
  subheader?: string;
  children?: ReactNode;
}

const CustomTitleBanner = ({
  title,
  subheader,
  children,
}: CustomTitleBannerProps) => {
  return (
    <section
      className="bg-white shadow-sm mb-4"
      style={{
        borderRadius: "22px",
        border: "1px solid #e9ecef",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center px-4 py-4 flex-wrap gap-3">
        <div>
          <h1 className="mb-1 fw-bold" style={{ fontSize: "1.8rem" }}>
            {title}
          </h1>

          {subheader && (
            <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
              {subheader}
            </p>
          )}
        </div>

        {children && <div className="d-flex align-items-center">{children}</div>}
      </div>
    </section>
  );
};

export default CustomTitleBanner;