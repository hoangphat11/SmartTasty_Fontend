"use client";

import React from "react";

type Column<T> = {
  key: keyof T | string;
  label: string;
  className?: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => string | number;
  className?: string;
  striped?: boolean;
  loading?: boolean;
  emptyText?: string;
  rowClassName?: (row: T, index: number) => string;
  stickyHeader?: boolean;
};

export default function Table<T>({
  columns,
  data,
  rowKey,
  className = "",
  striped = true,
  loading = false,
  emptyText = "No data",
  rowClassName,
  stickyHeader = false,
}: Props<T>) {
  return (
    <div className={`overflow-auto rounded-md border ${className}`}>
      <table className="min-w-full border-collapse">
        <thead
          className={`bg-[var(--button-bg)] ${
            stickyHeader ? "sticky top-0 z-10" : ""
          }`}
        >
          <tr>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className={`p-2 text-xs font-bold uppercase text-left text-[var(--text-color)] ${
                  col.className || ""
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--background)] divide-y">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                <span className="text-[var(--text-color)]">Đang tải...</span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                <span className="text-[var(--text-color)]">{emptyText}</span>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={rowKey ? rowKey(row, i) : i}
                className={`${
                  striped && i % 2 === 1 ? "bg-[var(--row-alt)]" : ""
                } ${rowClassName ? rowClassName(row, i) : ""}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key as string}
                    className={`p-2 text-sm text-[var(--text-color)] ${
                      col.className || ""
                    }`}
                  >
                    {(() => {
                      const value = row[col.key as keyof T];
                      return col.render
                        ? col.render(value, row, i)
                        : String(value);
                    })()}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
