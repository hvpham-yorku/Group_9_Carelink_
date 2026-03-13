/*
    This component is a reusable customizable button, can be used across the application
    
    Props:
    - color: defines the color of the button
        primary, secondary, success, danger
        outline-primary, outline-success, outline-secondary, outline-danger

    - children: button content (text or elements)

    - icon (optional): an icon element to display inside the button

    - iconPosition (optional): position of the icon
        "left" (default) | "right"

    - onClick (optional): function triggered when button is clicked
    - onSubmit (optional): function triggered when button is submitted

    Syntax:
    <Button color="primary" onClick={handleClick}>
      Click Me
    </Button>

    With icon:
    <Button color="primary" icon={<Plus size={16} />}>
      Add Medication
    </Button>
*/

import type {
  ReactNode,
  MouseEventHandler,
  FormEventHandler,
} from "react";

interface ButtonProps {
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
  icon?: ReactNode;
  iconPosition?: "left" | "right";

  onClick?: MouseEventHandler<HTMLButtonElement>;
  onSubmit?: FormEventHandler<HTMLButtonElement>;
}

const Button = ({
  color = "primary",
  children,
  icon,
  iconPosition = "left",
  onClick,
  onSubmit,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`btn btn-${color} d-inline-flex align-items-center gap-2`}
      onClick={onClick}
      onSubmit={onSubmit}
    >
      {icon && iconPosition === "left" && icon}
      <span>{children}</span>
      {icon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;