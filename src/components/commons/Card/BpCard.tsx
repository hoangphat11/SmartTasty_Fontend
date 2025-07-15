import React from "react";
import clsx from "clsx";
import BpHeading3 from "@/components/commons/Headings/BpHeading3";

type BpCardProps = {
  heading?: string;
  contentClass?: string;
  children?: React.ReactNode;
  headingButton?: React.ReactNode;
  headerSlot?: React.ReactNode;
  contentSlot?: React.ReactNode;
  headingCenter?: boolean;
  headingColor?: string;
  headingBold?: boolean;
};

export default function BpCard({
  heading,
  contentClass,
  children,
  headingButton,
  headerSlot,
  contentSlot,
  headingCenter = false,
  headingColor = "text",
  headingBold,
}: BpCardProps) {
  return (
    <div className="overflow-hidden bg-background shadow sm:rounded-lg border border-border">
      {headerSlot ? (
        headerSlot
      ) : heading ? (
        <div
          className={clsx(
            "items-center px-4 py-5 text-left sm:px-6",
            headingButton && "flex"
          )}
        >
          <BpHeading3
            title={heading}
            center={headingCenter}
            color={headingColor}
            bold={headingBold}
          />
          {headingButton}
        </div>
      ) : null}

      <div className={clsx("bg-background px-4 sm:px-6", contentClass)}>
        {contentSlot ?? children}
      </div>
    </div>
  );
}
