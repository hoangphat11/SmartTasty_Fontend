import { NextResponse } from "next/server";

export async function GET() {
  const mockData = {
    data: {
      account: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        trading_code: `HIST${String(i).padStart(3, "0")}`,
        status_note: i % 2 === 0 ? "Lịch sử bán" : "Khác",
        call_time: new Date().toISOString(),
        note: `Ghi chú dòng ${i + 1}`,
        customer_name: `Khách hàng ${i + 1}`,
        mr_actual_rate: (Math.random() * 100).toFixed(2),
        dp_actual_rate: (Math.random() * 100).toFixed(2),
        deposit_cash_all: Math.floor(Math.random() * 100_000_000),
        deposit_cash_85: Math.floor(Math.random() * 80_000_000),
        cash_to_dp: Math.floor(Math.random() * 50_000_000),
        quota_loan: Math.floor(Math.random() * 60_000_000),
        overdue_debt: Math.floor(Math.random() * 70_000_000),
        broker_name: `Môi giới ${i + 1}`,
        option: {
          highlight: i % 3 === 0 ? "*" : "",
        },
      })),
      history: {
        processed_data_at: new Date().toISOString(),
      },
      pagination: {
        current_page: 1,
        total: 2,
        total_item: 20,
        per_page: 10,
      },
    },
  };

  return NextResponse.json(mockData);
}
