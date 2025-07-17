// components/layouts/TableCellCentered.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
};

export default function TableCellCentered({
  children,
  align = "center",
  className = "",
}: Props) {
  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
      ? "text-right"
      : "text-center";

  return (
    <td
      className={`px-2 py-1 text-[var(--text-color)] ${alignClass} ${className}`}
    >
      <div className="w-full truncate">{children}</div>
    </td>
  );
}
