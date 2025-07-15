"use client";

import Image from "next/image";
import Link from "next/link";
import BpHeading3 from "@/components/commons/Headings/BpHeading3";
import BpHeading4 from "@/components/commons/Headings/BpHeading4";
import { useLocale } from "@/context/Locale";
import { useAppConfigStore } from "@/store/config/useAppConfigStore";

export default function CustomerManagementPage() {
  const { messages } = useLocale();
  const t = (key: string) => messages[key] || key;

  const { featT0Limit } = useAppConfigStore();

  return (
    <div>
      <BpHeading3
        title={t("account_header_title")}
        bold={true}
        className="text-[var(--text-title-color)]"
      />

      <div className="relative mt-4 grid grid-cols-2 gap-4 md:mt-6 lg:mt-8 lg:grid-cols-3">
        {/* Force Sell Card */}
        <Link href="/account/force-sell">
          <div className="card relative h-full cursor-pointer rounded-lg border border-border bg-background px-6 py-6 text-center transition-all duration-300 hover:border-green-600 hover:bg-[#F4F9F1] hover:drop-shadow-lg dark:hover:bg-slate-700">
            <Image
              src="/img/commons/account.svg"
              alt="account"
              width={91}
              height={91}
              className="mx-auto mb-2"
            />
            <BpHeading4
              title={t("account_force_sell_list")}
              color="font-semibold"
              bold={true}
              className="text-[var(--text-title-color)]"
            />
            <div className="absolute top-0 left-0">
              <Image
                src="/img/commons/vector.png"
                alt="vector"
                width={76}
                height={76}
              />
            </div>
          </div>
        </Link>

        {/* T0 Limit Card */}
        {featT0Limit && (
          <Link href="/account/t0-limit">
            <div className="card relative h-full cursor-pointer rounded-lg border border-border bg-background px-6 py-6 text-center transition-all duration-300 hover:border-green-600 hover:bg-[#F4F9F1] hover:drop-shadow-lg dark:hover:bg-slate-700">
              <Image
                src="/img/commons/account.svg"
                alt="t0"
                width={91}
                height={91}
                className="mx-auto mb-2"
              />
              <BpHeading4
                title={t("account_t0_limit")}
                color="font-semibold"
                bold={true}
                className="text-[var(--text-title-color)]"
              />
              <div className="absolute top-0 left-0">
                <Image
                  src="/img/commons/vector.png"
                  alt="vector"
                  width={76}
                  height={76}
                />
              </div>
            </div>
          </Link>
        )}

        {/* Empty Card */}
        <div className="card h-full rounded-lg border border-border bg-background p-3.5" />
      </div>
    </div>
  );
}
