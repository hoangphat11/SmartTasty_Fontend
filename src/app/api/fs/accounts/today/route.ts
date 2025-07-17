import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);

  const perPage = 10;
  const totalItem = 20;
  const total = Math.ceil(totalItem / perPage);

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const account = Array.from({ length: totalItem }, (_, i) => ({
    id: i + 1,
    trading_code: `022C${String(i).padStart(4, "0")}`,
    status_note: i % 2 === 0 ? "Cảnh báo" : "Bình thường",
    call_time: new Date().toISOString(),
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
  })).slice(start, end); // lấy trang hiện tại

  return NextResponse.json({
    data: {
      account,
      history: {
        processed_data_at: new Date().toISOString(),
      },
      pagination: {
        current_page: page,
        total,
        total_item: totalItem,
        per_page: perPage,
      },
    },
  });
}
