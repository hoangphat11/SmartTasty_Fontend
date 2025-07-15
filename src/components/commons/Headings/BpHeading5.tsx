import React from "react";
import clsx from "clsx";

type BpHeading5Props = {
  title: string;
  center?: boolean;
  color?: string;
  bold?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function BpHeading5({
  title,
  center = false,
  color = "text",
  bold = false,
  className = "",
  children,
}: BpHeading5Props) {
  return (
    <h5
      className={clsx(
        "text-base leading-7 sm:truncate md:text-base lg:text-lg",
        {
          "mx-auto": center,
          "font-bold": bold,
        },
        `text-[var(--${color})]`,
        className
      )}
    >
      {children ?? title}
    </h5>
  );
}
