import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export const Button: React.FC<ButtonProps> = ({ variant = "default", className = "", ...props }) => {
  const base =
    "px-3 py-2 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring";
  const styles =
    variant === "outline"
      ? "border border-gray-300 hover:bg-gray-100"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
};
