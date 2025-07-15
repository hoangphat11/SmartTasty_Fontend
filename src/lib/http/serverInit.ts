"use server";

import { cookies } from "next/headers";

type Broker = {
  id: number;
  code: string;
  name: string;
  position: string;
  branch: {
    id: number;
    label: string;
  };
  status: number;
};

type InitResponse = {
  status: "success" | "error";
  data: {
    config: Record<string, unknown>;
    versions: Record<string, unknown>;
    nav_noti: {
      fs: boolean;
    };
    broker: Broker | false;
  };
};

export async function serverInit(lang: string = "vi") {
  const token = (await cookies()).get("fe_auth_token")?.value;

  const res = await fetch(`${process.env.API_BASE}/app/init?lang=${lang}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json: InitResponse = await res.json();
  const { config, broker, nav_noti } = json.data;

  return { config, broker, nav_noti };
}
