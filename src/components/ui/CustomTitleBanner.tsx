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
    <>
      <section className="rounded bg-white shadow-sm mb-4">
        <div className="container d-flex justify-content-between align-items-center pt-3 pb-3">
          <div className="">
            <h1>{title}</h1>

            {subheader && <span className="text-muted">{subheader}</span>}
          </div>

          <div className="">{children}</div>
        </div>
      </section>
    </>
  );
};

export default CustomTitleBanner;
