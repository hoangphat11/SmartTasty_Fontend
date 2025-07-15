"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAlertStore } from "@/store/notification/useAlertStore";
import { useBrokerStore } from "@/store/auth/useBrokerStore";
import { useLocale } from "@/context/Locale";

export default function LoginPage() {
  const { messages } = useLocale();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showError } = useAlertStore();
  const { loginAction } = useBrokerStore();

  const t = (key: string) => messages[key] || key;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (result.status === "error") {
        const msg = t("login_unauthorized_error");
        setError(msg);
        showError(msg);
        return;
      }

      await loginAction(result.data, result.token, "/business-goal");
      router.push("/business-goal");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      const msg = t("login_unexpected_error");
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 h-screen bg-[url('/img/commons/background.png')] bg-no-repeat dark:bg-slate-900">
      <div className="hidden md:flex justify-center items-center">
        <Image
          src="/img/commons/content.svg"
          alt="Login Illustration"
          width={550}
          height={500}
        />
      </div>

      <div className="flex flex-col justify-center px-10">
        <Image
          src="/img/commons/logo-md-right.png"
          alt="Logo"
          width={300}
          height={118}
          className="mx-auto"
        />

        <h1 className="text-center text-xl font-bold mt-5 dark:text-green-600">
          {t("login_broker_portal")}
        </h1>

        {error && (
          <div className="bg-red-500 text-white p-2 rounded mt-4">{error}</div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder={t("login_username_label")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border rounded text-black"
              required
              minLength={4}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("login_password_label")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded text-black"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-3 text-gray-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={!username || !password || loading}
            className="w-full bg-green-600 text-white py-3 rounded font-semibold"
          >
            {loading ? "..." : t("login_button")}
          </button>
        </form>
      </div>
    </div>
  );
}
