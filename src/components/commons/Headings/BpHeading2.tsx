import React from "react";
import clsx from "clsx";

type BpHeading2Props = {
  title: string;
  center?: boolean;
  color?: string;
  bold?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function BpHeading2({
  title,
  center = false,
  color = "text",
  bold = false,
  className = "",
  children,
}: BpHeading2Props) {
  return (
    <h2
      className={clsx(
        "text-xl leading-7 sm:truncate md:text-2xl lg:text-3xl",
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
    </h2>
  );
}
