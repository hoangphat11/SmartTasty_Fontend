import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { maxQuotaLimit, creditlineT0 } = body;

  const creditLine = Number(creditlineT0) || 0;
  const estimatedRealRatio = Math.min(65 + creditLine / 1_000_000, 100); // max 100%
  const realRatio = Math.min(60 + creditLine / 2_000_000, 100);

  const mockData = {
    margin_limit: 100_000_000,
    p_outs: 25_000_000,
    cash: 50_000_000,
    pOuts_net_cash: 10_000_000,
    p_p0: 5_000_000,
    total_assets: 200_000_000,
    nav: 180_000_000,
    real_ratio: Math.round(realRatio),
    max_quote_limit: maxQuotaLimit,
    estimated_realratio: Math.round(estimatedRealRatio),
  };

  return NextResponse.json(mockData);
}
