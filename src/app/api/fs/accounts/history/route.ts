import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 10;
  const totalItem = 20;
  const totalPage = Math.ceil(totalItem / perPage);
  const offset = (page - 1) * perPage;

  const account = Array.from({ length: perPage }, (_, i) => {
    const index = offset + i;
    return {
      id: index + 1,
      trading_code: `HIST${String(index).padStart(3, "0")}`,
      status_note: index % 2 === 0 ? "Lịch sử bán" : "Khác",
      call_time: new Date().toISOString(),
      note: `Ghi chú dòng ${index + 1}`,
      customer_name: `Khách hàng ${index + 1}`,
      mr_actual_rate: (Math.random() * 100).toFixed(2),
      dp_actual_rate: (Math.random() * 100).toFixed(2),
      deposit_cash_all: Math.floor(Math.random() * 100_000_000),
      deposit_cash_85: Math.floor(Math.random() * 80_000_000),
      cash_to_dp: Math.floor(Math.random() * 50_000_000),
      quota_loan: Math.floor(Math.random() * 60_000_000),
      overdue_debt: Math.floor(Math.random() * 70_000_000),
      broker_name: `Môi giới ${index + 1}`,
      option: {
        highlight: index % 3 === 0 ? "*" : "",
      },
    };
  });

  const mockData = {
    data: {
      account,
      history: {
        processed_data_at: new Date().toISOString(),
      },
      pagination: {
        current_page: page,
        total: totalPage,
        total_item: totalItem,
        per_page: perPage,
      },
    },
  };

  return NextResponse.json(mockData);
}
