"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLocale } from "@/context/locale";
import axios from "axios";
import dayjs from "dayjs";
import LoadingOverlay from "@/components/commons/loadingOverlay";
import Pagination from "@/components/commons/pagination";
import ScrollableBox from "@/components/commons/scrollableBox";
import type { Account, HistoryData } from "@/types/forcesell";

export default function ForceSellHistory() {
  const { messages } = useLocale();
  const t = (key: string, params?: Record<string, string>) =>
    messages[key]?.replace(/{(\w+)}/g, (_, k) => params?.[k] || "") || key;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<Account[]>([]);
  const [history, setHistory] = useState<HistoryData>();
  const [totalPage, setTotalPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [ordinalId, setOrdinalId] = useState(0);

  // Đồng bộ currentPage với URL
  useEffect(() => {
    const pageFromURL = parseInt(searchParams.get("page") || "1", 10);
    console.log("[URL Sync] currentPage from URL:", pageFromURL);
    setCurrentPage(pageFromURL);
  }, [searchParams]);

  const fetchData = useCallback(async () => {
    console.log("[FetchData] Fetching data for page:", currentPage);
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/fs/accounts/history`,
        {
          params: { page: currentPage },
          withCredentials: true,
        }
      );

      const { account, history, pagination } = response.data.data;

      console.log("[FetchData] Data received:", response.data.data);

      setRequest(account || []);
      setHistory(history || {});
      setTotalPage(pagination?.total || 1);
      setTotalItem(pagination?.total_item || 0);
      setOrdinalId((pagination?.current_page - 1) * pagination?.per_page);
    } catch (e) {
      console.error("Error fetching force sell history:", e);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage: number) => {
    console.log("[PageChange] Clicked page:", newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const toHourString = (value: string, format = "HH:mm") =>
    value ? dayjs(value).format(format) : "--";

  const formatNumber = (value: number) =>
    typeof value === "number" ? value.toLocaleString() : "--";

  return (
    <div className="relative">
      {loading && <LoadingOverlay />}

      <ScrollableBox>
        <table className="min-w-full divide-y">
          <thead className="bg-[var(--button-bg)]">
            <tr>
              {[
                "id",
                "account_number",
                "force_sell_status",
                "force_sell_time",
                "note",
                "customer_name",
                "mr_actual_ratio",
                "dp_actual_ratio",
                "deposit_cash_100",
                "deposit_cash_80",
                "deposit_cash_rtt_dp",
                "quota_loan",
                "overdue_margin_debt_dp",
                "broker_name",
              ].map((key) => (
                <th
                  key={key}
                  className="p-2 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-color)] whitespace-nowrap"
                >
                  {t(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[var(--background)] divide-y">
            {request.map((data, i) => (
              <tr
                key={data.id}
                className={
                  data.option?.highlight?.includes("*")
                    ? "bg-primary text-[var(--text-color)]"
                    : ""
                }
              >
                <td className="px-2 py-1 text-center text-[var(--text-color)]">
                  {ordinalId + i + 1}
                </td>
                <td className="px-2 py-1 text-[var(--text-color)]">
                  {data.trading_code}
                </td>
                <td className="px-2 py-1 text-[var(--text-color)]">
                  {data.status_note}
                </td>
                <td className="px-2 py-1 text-[var(--text-color)]">
                  {toHourString(data.call_time)}
                </td>
                <td className="px-2 py-1 text-[var(--text-color)] truncate max-w-[100px] sm:max-w-[160px] md:max-w-[240px] lg:max-w-[320px]">
                  {data.note}
                </td>
                <td className="px-2 py-1 text-[var(--text-color)]">
                  {data.customer_name}
                </td>
                <td className="px-2 py-1 text-right text-[var(--text-color)]">
                  {data.mr_actual_rate}
                </td>
                <td className="px-2 py-1 text-right text-[var(--text-color)]">
                  {data.dp_actual_rate}
                </td>
                <td className="px-2 py-1 text-right text-[var(--text-color)]">
                  {formatNumber(data.deposit_cash_all)}
                </td>
                <td className="px-2 py-1 text-right text-[var(--text-color)]">
                  {formatNumber(data.deposit_cash_85)}
                </td>
                <td className="px-2 py-1 text-right text-[var(--text-color)]">
                  {formatNumber(data.cash_to_dp)}
                </td>
                <td className="px-2 py-1 text-right text-[var(--text-color)]">
                  {formatNumber(data.quota_loan)}
                </td>
                <td className="px-2 py-1 text-right text-[var(--text-color)]">
                  {formatNumber(data.overdue_debt)}
                </td>
                <td className="px-2 py-1 text-[var(--text-color)]">
                  {data.broker_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableBox>

      <div className="mt-4 text-center">
        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <div className="flex justify-between mt-4">
        <span className="text-[var(--text-color)] font-semibold">
          {history?.processed_data_at &&
            t("time_request", {
              time: toHourString(history.processed_data_at),
            })}
        </span>
        <span className="text-[var(--text-color)] font-semibold">
          {t("total_record")}: {totalItem}
        </span>
      </div>

      <div className="mt-4">
        <table className="text-sm">
          <tbody>
            <tr>
              <td className="w-5 h-5 bg-primary border border-black"></td>
              <td className="pl-2 text-[var(--text-color)]">{t("overdue")}</td>
            </tr>
            <tr>
              <td className="w-5 h-5 bg-transparent border border-black"></td>
              <td className="pl-2 text-[var(--text-color)]">
                {t("in_process")}
              </td>
            </tr>
            <tr>
              <td className="w-5 h-5 bg-secondary border border-black"></td>
              <td className="pl-2 text-[var(--text-color)]">{t("extend")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
