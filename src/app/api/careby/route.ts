import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "success",
    data: {
      careby: [
        { CAREBY: "Nguyễn Văn A", BROKERNAME: "Trần Thị B" },
        { CAREBY: "Phạm Văn C", BROKERNAME: "Lê Thị D" },
        { CAREBY: "Hoàng Văn E", BROKERNAME: "Đinh Thị F" },
      ],
    },
  });
}
