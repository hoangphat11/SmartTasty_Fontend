"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAlertStore } from "@/store/notification/useAlertStore";
import { useBrokerStore } from "@/store/auth/useBrokerStore";
import { useLocale } from "@/context/locale";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
        headers: { "Content-Type": "application/json" },
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
    <div className="grid md:grid-cols-2 h-screen bg-background transition-colors">
      {/* Left Image for md+ */}
      <div className="hidden md:flex items-center justify-center bg-[url('/img/commons/background.png')] bg-cover">
        <Image
          src="/img/commons/content.svg"
          alt="Login Illustration"
          width={500}
          height={500}
        />
      </div>

      {/* Login Form */}
      <div className="flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-10">
        <Image
          src="/img/commons/logo-md-right.png"
          alt="Logo"
          width={250}
          height={100}
          className="mb-4"
        />

        <h1 className="text-xl font-bold text-text-title mb-6 text-center">
          {t("login_broker_portal")}
        </h1>

        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded w-full text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
          <input
            type="text"
            name="username"
            placeholder={t("login_username_label")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded border border-border bg-button text-text placeholder:text-gray-500"
            required
            minLength={4}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("login_password_label")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded border border-border bg-button text-text placeholder:text-gray-500"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-lg text-gray-600 border-none hover:bg-transparent"
              title="Toggle Password"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!username || !password || loading}
            className="w-full bg-background-phs hover:bg-green-900 text-white font-semibold py-3 rounded transition-colors"
          >
            {loading ? "..." : t("login_button")}
          </button>
        </form>
      </div>
    </div>
  );
}
