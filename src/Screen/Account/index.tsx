"use client";

import Image from "next/image";
import Link from "next/link";
import BpCard from "@/components/commons/card/bpCard";
import BpHeading3 from "@/components/commons/headings/bpHeading3";
import BpHeading4 from "@/components/commons/headings/bpHeading4";
import { useLocale } from "@/context/locale";
import { useAppConfigStore } from "@/store/config/useAppConfigStore";

export default function CustomerManagementPage() {
  const { messages } = useLocale();
  const t = (key: string) => messages[key] || key;
  const { featT0Limit } = useAppConfigStore();

  return (
    <div>
      <BpHeading3
        title={t("account_header_title")}
        bold
        className="text-[var(--text-title-color)] mb-4 md:mb-6"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Force Sell Card */}
        <Link href="/account/force-sell">
          <BpCard
            contentClass="relative h-full cursor-pointer text-center p-6 transition-all duration-300 hover:border-green-600 hover:bg-[#F4F9F1] hover:drop-shadow-lg dark:hover:bg-slate-700"
            contentSlot={
              <>
                <Image
                  src="/img/commons/account.svg"
                  alt="account"
                  width={91}
                  height={91}
                  className="mx-auto mb-2"
                />
                <BpHeading4
                  title={t("account_force_sell_list")}
                  bold
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
              </>
            }
          />
        </Link>

        {/* T0 Limit Card */}
        {featT0Limit && (
          <Link href="/account/t0-limit">
            <BpCard
              contentClass="relative h-full cursor-pointer text-center p-6 transition-all duration-300 hover:border-green-600 hover:bg-[#F4F9F1] hover:drop-shadow-lg dark:hover:bg-slate-700"
              contentSlot={
                <>
                  <Image
                    src="/img/commons/account.svg"
                    alt="t0"
                    width={91}
                    height={91}
                    className="mx-auto mb-2"
                  />
                  <BpHeading4
                    title={t("account_t0_limit")}
                    bold
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
                </>
              }
            />
          </Link>
        )}
      </div>
    </div>
  );
}
