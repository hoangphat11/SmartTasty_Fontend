import React from "react";
import clsx from "clsx";

type BpHeading6Props = {
  title: string;
  center?: boolean;
  color?: string;
  bold?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function BpHeading6({
  title,
  center = false,
  color = "text",
  bold = false,
  className = "",
  children,
}: BpHeading6Props) {
  return (
    <h6
      className={clsx(
        "text-base leading-7 sm:truncate",
        {
          "mx-auto": center,
          "font-bold": bold,
        },
        `text-[var(--${color})]`,
        className
      )}
    >
      {children ?? title}
    </h6>
  );
}
