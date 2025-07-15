import React from "react";
import clsx from "clsx";

type BpHeading4Props = {
  title: string;
  center?: boolean;
  color?: string;
  bold?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function BpHeading4({
  title,
  center = false,
  color = "text",
  bold = false,
  className = "",
  children,
}: BpHeading4Props) {
  return (
    <h4
      className={clsx(
        "text-base leading-7 sm:truncate md:text-lg lg:text-xl",
        {
          "mx-auto": center,
          "font-bold": bold,
        },
        `text-[var(--${color})]`,
        className
      )}
    >
      {children ?? title}
    </h4>
  );
}
