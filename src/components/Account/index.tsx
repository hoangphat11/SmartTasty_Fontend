"use client";

import { Typography, Button, message } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import ChangePasswordForm from "@/screens/ChangePassword";

const { Title, Text } = Typography;

const AccountPage = () => {
  const [user, setUser] = useState<{
    userName?: string;
    email?: string;
    phone?: string;
    address?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.userName || parsed.email || parsed.phone || parsed.address) {
          setUser(parsed);
        } else if (parsed.user) {
          setUser(parsed.user);
        }
      } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className={styles.accountContainer}>
        <div className={styles.contentArea}>
          <Title level={3}>Bạn chưa đăng nhập</Title>
          <Button type="primary" onClick={() => router.push("/login")}>
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.accountContainer}>
      {/* Sidebar bên trái */}
      <div className={styles.sidebar}>
        <div
          className={`${styles.navItem} ${
            activeTab === "info" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("info")}
        >
          Thông tin tài khoản
        </div>
        <div
          className={`${styles.navItem} ${
            activeTab === "password" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("password")}
        >
          Đổi mật khẩu
        </div>
        <div className={styles.navItem} onClick={handleLogout}>
          Đăng xuất
        </div>
      </div>

      {/* Nội dung bên phải */}
      <div className={styles.contentArea}>
        {activeTab === "info" && (
          <>
            <div className={styles.sectionTitle}>Thông tin tài khoản</div>
            <div className={styles.infoRow}>
              <span>Tên người dùng: </span>
              <strong>{user.userName || "Chưa cập nhật"}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Email: </span>
              <strong>{user.email || "Chưa cập nhật"}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Số điện thoại: </span>
              <strong>{user.phone || "Chưa cập nhật"}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Địa chỉ: </span>
              <strong>{user.address || "Chưa cập nhật"}</strong>
            </div>
          </>
        )}

        {activeTab === "password" && (
          <>
            <div className={styles.sectionTitle}>Đổi mật khẩu</div>
            <ChangePasswordForm
              onSuccess={() => {
                message.success("Đổi mật khẩu thành công");
                setActiveTab("info");
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
