import React from "react";
import clsx from "clsx";
import BpHeading3 from "@/components/commons/Headings/BpHeading3";

type BpPanelProps = {
  heading?: string;
  contentClass?: string;
  header?: React.ReactNode;
  headingButton?: React.ReactNode;
  content?: React.ReactNode;
};

export default function BpPanel({
  heading,
  contentClass,
  header,
  headingButton,
  content,
}: BpPanelProps) {
  return (
    <div className="overflow-hidden bg-background text border border-border shadow sm:rounded-lg">
      {header ??
        (heading && (
          <div
            className={clsx(
              "items-center border-b border-border px-4 py-5 text-left sm:px-6",
              headingButton && "md:flex"
            )}
          >
            <BpHeading3 title={heading} />
            {headingButton}
          </div>
        ))}

      <div className={clsx("px-4 py-5 sm:px-6", contentClass)}>{content}</div>
    </div>
  );
}
