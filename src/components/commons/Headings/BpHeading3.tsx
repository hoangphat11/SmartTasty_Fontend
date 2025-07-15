import React from "react";
import clsx from "clsx";

type BpHeading3Props = {
  title: string;
  center?: boolean;
  color?: string;
  bold?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function BpHeading3({
  title,
  center = false,
  color = "text",
  bold = false,
  className = "",
  children,
}: BpHeading3Props) {
  return (
    <h3
      className={clsx(
        "text-lg leading-7 sm:truncate md:text-xl lg:text-2xl",
        {
          "mx-auto": center,
          "font-bold": bold,
          "font-medium": !bold,
        },
        `text-[var(--${color})]`,
        className
      )}
    >
      {children ?? title}
    </h3>
  );
}
