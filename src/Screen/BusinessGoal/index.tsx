"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import BpCard from "@/components/commons/card/bpCard";
import BpHeading3 from "@/components/commons/headings/bpHeading3";
import BpHeading4 from "@/components/commons/headings/bpHeading4";
import { useLocale } from "@/context/locale";
import { useBrokerStore } from "@/store/auth/useBrokerStore";

const lmAllowList = [
  "0218",
  "0234",
  "0244",
  "0924",
  "0074",
  "0107",
  "1019",
  "1044",
  "1535",
];

export default function BusinessGoalPage() {
  const { broker } = useBrokerStore();
  const code = broker?.code;
  const { messages } = useLocale();
  const t = (key: string) => messages[key] || key;

  const lmDashBoardAvailable = code && lmAllowList.includes(code);
  const powerBiLink =
    code === "2363"
      ? "https://report.phs.vn/reports/powerbi/BMD/Dashboard/Truc/Demo/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20th%C3%A0nh%20t%C3%ADch%20kinh%20doanh%20-%20Demo"
      : "https://report.phs.vn/reports/powerbi/BMD/Dashboard/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20th%C3%A0nh%20t%C3%ADch%20kinh%20doanh";

  const CardItem = ({
    href,
    imgSrc,
    title,
  }: {
    href: string;
    imgSrc: string;
    title: string;
  }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <BpCard
        contentClass={clsx(
          "relative text-center pt-2 pb-6 px-4",
          "hover:border-green-600 hover:drop-shadow-lg dark:hover:bg-slate-700 cursor-pointer"
        )}
      >
        <Image
          src={imgSrc}
          alt="goal"
          width={116}
          height={116}
          className="mx-auto mb-2"
        />
        <BpHeading4
          title={title}
          bold
          className="text-[var(--text-title-color)] text-lg"
        />
        <div className="absolute top-0 left-0">
          <Image
            src="/img/commons/vector.png"
            alt="vector"
            width={76}
            height={76}
          />
        </div>
      </BpCard>
    </Link>
  );

  return (
    <div>
      <BpHeading3
        title={t("business_goal_header_title")}
        bold={true}
        className="mb-4 text-2xl text-[var(--text-title-color)]"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Thành tích kinh doanh */}
        <CardItem
          href={powerBiLink}
          imgSrc="/img/commons/goal.svg"
          title={t("business_goal_dashboard_lm")}
        />

        {/* Card 2: Dashboard LM nếu được phép */}
        {lmDashBoardAvailable ? (
          <CardItem
            href="https://report.phs.vn/reports/report/BMD/Dashboard/Dashboard%20LM"
            imgSrc="/img/commons/goal-lm.svg"
            title={t("business_goal_dashboard_lm")}
          />
        ) : (
          <BpCard contentClass="h-full px-4 py-6 dark:bg-slate-800 dark:border-slate-600" />
        )}

        {/* Card 3: Placeholder nếu muốn thêm mục khác */}
        {/* <BpCard contentClass="h-full px-4 py-6 dark:bg-slate-800 dark:border-slate-600" /> */}
      </div>
    </div>
  );
}
