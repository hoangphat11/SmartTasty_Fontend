import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { searchInput } = body;

  const mockCustomers = Array.from({ length: 5 }, (_, i) => ({
    targetAcc: `022C0000${i}`,
    fullName: `Nguyễn Văn ${String.fromCharCode(65 + i)}`,
  }));

  const filtered = mockCustomers.filter((c) =>
    c.targetAcc.includes(searchInput)
  );

  return NextResponse.json(filtered);
}
