import type { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"button"> & {
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
