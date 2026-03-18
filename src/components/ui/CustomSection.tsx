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
      className="bg-white shadow-sm"
      style={{
        borderRadius: "18px",
        border: "1px solid #e9ecef",
        overflow: "hidden",
      }}
    >
      <div className="container px-4 py-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h3 className="mb-1 fw-semibold">{title}</h3>

            {subheader && (
              <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                {subheader}
              </p>
            )}
          </div>

          {rightAction && <div>{rightAction}</div>}
        </div>

        <hr style={{ opacity: 0.08 }} />

        <div className="pt-2">{children}</div>
      </div>
    </section>
  );
};

export default CustomSection;
