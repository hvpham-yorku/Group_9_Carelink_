/*
    This component is a reusable customizable section, can be used across the application
    Props:
    - title: the title of the section
    - subheader: a brief description, or subheader, or current time
    - children (optional): any element can be passed here, it will be rendered inside the section
*/

import type { ReactNode } from "react";

interface CustomSectionProps {
  title: string;
  subheader?: string;

  children?: ReactNode;
}

const CustomSection = ({ title, subheader, children }: CustomSectionProps) => {
  return (
    <>
      <section className="rounded bg-white shadow-sm mb-4">
        <div className="container">
          <div className="pt-3">
            <h3>{title}</h3>
            {subheader && <p>{subheader}</p>}

            <hr />
          </div>

          <div className="pb-3">{children}</div>
        </div>
      </section>
    </>
  );
};

export default CustomSection;
