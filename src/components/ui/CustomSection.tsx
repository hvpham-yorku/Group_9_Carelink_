/*
    This component is a reusable customizable section that can be used across the application.

    It provides a consistent card-style container with a title, optional subheader,
    and a content area where any children elements can be rendered.

    Props:
    - title: the title of the section
    - subheader (optional): a brief description or contextual information
    - children (optional): any elements passed will render inside the section body
    - rightAction (optional): element displayed on the right side of the header
      (example: buttons, icons, filters)

    Syntax:
    <CustomSection title="Section Title" subheader="This is a subheader">
      <p>This is the content of the section.</p>
    </CustomSection>

    Example with action button:
    <CustomSection
      title="Medications"
      subheader="Today's schedule"
      rightAction={<button>Add Medication</button>}
    >
      <p>Medication list goes here</p>
    </CustomSection>
*/

import type { ReactNode } from "react";

interface CustomSectionProps {
  title: string;
  subheader?: string;
  children?: ReactNode;
  rightAction?: ReactNode;
}

const CustomSection = ({
  title,
  subheader,
  children,
  rightAction,
}: CustomSectionProps) => {
  return (
    <section
      className="bg-white shadow-sm mb-4"
      style={{
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      <div className="px-4 px-md-4 py-3 py-md-3">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
          <div>
            <h3
              className="mb-1 fw-semibold"
              style={{ fontSize: "1rem", color: "#111827" }}
            >
              {title}
            </h3>

            {subheader && (
              <p
                className="mb-0"
                style={{ fontSize: "0.9rem", color: "#6b7280" }}
              >
                {subheader}
              </p>
            )}
          </div>

          {rightAction && <div>{rightAction}</div>}
        </div>

        <div
          style={{
            height: "1px",
            backgroundColor: "#eef2f7",
            margin: "0 -1rem",
          }}
        />

        <div className="pt-3">{children}</div>
      </div>
    </section>
  );
};

export default CustomSection;