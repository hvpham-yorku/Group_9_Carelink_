/*
    This component is a reusable customizable button, can be used across the application
    Props:
    - color: defines the color of the button, can be one of the following values:
        - primary, secondary, success, danger, outline-primary, outline-success, outline-secondary, outline-danger
    - children: any element can be passed here
    - onClick (optional): a function to be called when the button is clicked
    - onSubmit (optional): a function to be called when the button is submitted
*/
import type { ReactNode } from "react";

interface ButtonProps {
  // Defining the colors
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "outline-primary"
    | "outline-success"
    | "outline-secondary"
    | "outline-danger";

  children: ReactNode;

  // Optional event handlers
  onClick?: () => void;
  onSubmit?: () => void;
}

const Button = ({
  color = "primary",
  children,
  onClick,
  onSubmit,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`btn btn-${color}`}
      onClick={onClick}
      onSubmit={onSubmit}
    >
      {children}
    </button>
  );
};

export default Button;
