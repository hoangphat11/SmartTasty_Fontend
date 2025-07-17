"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "@/context/locale";
import axios from "axios";
import LoadingOverlay from "@/components/commons/loadingOverlay";
import Pagination from "@/components/commons/pagination";
import ScrollableBox from "@/components/commons/scrollableBox";
import TableCellCentered from "@/components/commons/tableCellCentered";
import formatNumber from "@/lib/utils/formatNumber";
import toHourString from "@/lib/utils/toHourString";
import type { Account, HistoryData } from "@/types/forcesell";

export default function ForceSellHistory() {
  const { messages } = useLocale();
  const t = (key: string, params?: Record<string, string>) =>
    messages[key]?.replace(/{(\w+)}/g, (_, k) => params?.[k] || "") || key;

  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("pageH") || "1", 10)
  );

  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<Account[]>([]);
  const [history, setHistory] = useState<HistoryData>();
  const [totalPage, setTotalPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [ordinalId, setOrdinalId] = useState(0);

  const fetchData = useCallback(async () => {
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
  }, [fetchData, currentPage]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageH", newPage.toString());
    params.set("tab", "history");
    router.push(`?${params.toString()}`);
    setCurrentPage(newPage);
  };

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
                <TableCellCentered className="max-w-[240px]">
                  {data.note}
                </TableCellCentered>
                <TableCellCentered>{data.customer_name}</TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.mr_actual_rate, false, { precision: 2 })}
                </TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.dp_actual_rate, false, { precision: 2 })}
                </TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.deposit_cash_all, false, { precision: 0 })}
                </TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.deposit_cash_85, false, { precision: 0 })}
                </TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.cash_to_dp, false, { precision: 0 })}
                </TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.quota_loan, false, { precision: 0 })}
                </TableCellCentered>
                <TableCellCentered>
                  {formatNumber(data.overdue_debt, false, { precision: 0 })}
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
            t("time_request", {
              time: toHourString(history.processed_data_at, "HH:mm"),
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
