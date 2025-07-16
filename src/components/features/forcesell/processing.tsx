"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "@/context/locale";
import axios from "axios";
import dayjs from "dayjs";
import LoadingOverlay from "@/components/layouts/loadingOverlay";
import Pagination from "@/components/layouts/pagination";
import ScrollableBox from "@/components/layouts/scrollableBox";
import TableCellCentered from "@/components/layouts/tableCellCentered";
import type { Account, HistoryData } from "@/types/forcesell";

export default function ForceSellAccounts() {
  const { messages } = useLocale();
  const t = (key: string) => messages[key] || key;

  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<Account[]>([]);
  const [history, setHistory] = useState<HistoryData>();
  const [totalPage, setTotalPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [ordinalId, setOrdinalId] = useState(0);

  const fetchData = useCallback(async () => {
    const pageA = parseInt(searchParams.get("pageA") || "1", 10);

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/fs/accounts/today`,
        {
          params: { page: pageA },
          withCredentials: true,
        }
      );

      const data = response.data.data;
      setRequest(data.account || []);
      setHistory(data.history || {});
      setTotalPage(data.pagination?.total || 1);
      setTotalItem(data.pagination?.total_item || 0);
      setOrdinalId(
        (data.pagination?.current_page - 1) * data.pagination?.per_page
      );
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const toHourString = (value: string, format = "HH:mm") => {
    return value ? dayjs(value).format(format) : "--";
  };

  const formatNumber = (value: number) => {
    return typeof value === "number" ? value.toLocaleString() : "--";
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageA", newPage.toString());
    params.set("tab", "process");
    router.push(`?${params.toString()}`);
  };

  const currentPage = parseInt(searchParams.get("pageA") || "1", 10);

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
                  className="p-2 py-6 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-color)] whitespace-nowrap"
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
                <TableCellCentered>{ordinalId + i + 1}</TableCellCentered>
                <TableCellCentered>{data.trading_code}</TableCellCentered>
                <TableCellCentered>{data.status_note}</TableCellCentered>
                <TableCellCentered>
                  {toHourString(data.call_time)}
                </TableCellCentered>
                <TableCellCentered>{data.customer_name}</TableCellCentered>
                <TableCellCentered>{data.mr_actual_rate}</TableCellCentered>
                <TableCellCentered>{data.dp_actual_rate}</TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.deposit_cash_all)}
                </TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.deposit_cash_85)}
                </TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.cash_to_dp)}
                </TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.quota_loan)}
                </TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.overdue_debt)}
                </TableCellCentered>
                <TableCellCentered>{data.broker_name}</TableCellCentered>
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
            t("time_request").replace(
              "{time}",
              toHourString(history.processed_data_at)
            )}
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
