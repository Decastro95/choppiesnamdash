import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "metric" | "red-header";
}

export function Card({ children, className = "", variant = "default" }: CardProps) {
  const baseStyles = "bg-white rounded-xl shadow-md transition-shadow hover:shadow-lg";

  const variantStyles = {
    default: "p-6",
    metric: "p-6",
    "red-header": "overflow-hidden"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  growth?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, subtitle, growth, trend, icon }: MetricCardProps) {
  const trendColors = {
    up: "text-choppies-green",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <Card variant="metric" className="relative">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
        {icon && <div className="text-choppies-red">{icon}</div>}
      </div>

      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>

      <div className="flex items-center gap-2 text-sm">
        {growth && trend && (
          <span className={`font-semibold ${trendColors[trend]}`}>
            {trend === "up" ? "+" : ""}{growth}
          </span>
        )}
        {subtitle && <span className="text-gray-500">{subtitle}</span>}
      </div>
    </Card>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  variant?: "default" | "red";
  className?: string;
}

export function CardHeader({ children, variant = "default", className = "" }: CardHeaderProps) {
  const variants = {
    default: "border-b border-gray-200 pb-4 mb-4",
    red: "bg-gradient-to-r from-choppies-red to-red-700 text-white p-4 -mx-6 -mt-6 mb-6 rounded-t-xl"
  };

  return <div className={`${variants[variant]} ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}
