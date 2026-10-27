import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "text";
};

export function Button({
  variant = "secondary",
  className = "",
  type = "button",
  ...props
}: Props) {
  return <button {...props} type={type} className={`button button-${variant} ${className}`} />;
}
