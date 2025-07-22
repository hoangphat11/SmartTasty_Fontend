"use client";

import { Typography, Button, message, Input, Form, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import ChangePasswordForm from "@/screens/ChangePassword";
import axiosInstance from "@/lib/axios/axiosInstance";

const { Title } = Typography;

const AccountPage = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [canEditUser, setCanEditUser] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPermissions = localStorage.getItem("userPermissions");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const u = parsed.user || parsed;
        setUser(u);
        setFormData(u);
      } catch (error) {
        console.error("Lỗi khi parse user:", error);
      }
    }

    if (storedPermissions) {
      try {
        const parsed = JSON.parse(storedPermissions);
        setCanEditUser(parsed.canEditUser || false);
      } catch (error) {
        console.error("Lỗi khi parse quyền:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

      await axiosInstance.put(
        `/api/User`,
        {
          userId: user?.userId,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = { ...user, ...formData };
      localStorage.setItem(
        "user",
        JSON.stringify({ user: updatedUser, token })
      );
      setUser(updatedUser);
      setIsEditing(false);
      message.success("Cập nhật thành công!");
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("email")) {
        message.error("Email đã được sử dụng.");
      } else {
        message.error("Cập nhật thất bại.");
      }
      console.error(error);
    }
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

      <div className={styles.contentArea}>
        {activeTab === "info" && (
          <>
            <div className={styles.sectionTitle}>Thông tin tài khoản</div>

            {isEditing ? (
              <Form layout="vertical">
                <Form.Item label="Tên người dùng">
                  <Input
                    value={formData?.userName}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item label="Email">
                  <Input
                    value={formData?.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item label="Số điện thoại">
                  <Input
                    value={formData?.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item label="Địa chỉ">
                  <Input
                    value={formData?.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </Form.Item>

                <div style={{ display: "flex", gap: 10 }}>
                  <Button type="primary" onClick={handleSave}>
                    Lưu
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                </div>
              </Form>
            ) : (
              <>
                <div className={styles.infoRow}>
                  <span>Tên người dùng:</span>
                  <strong>{user.userName || "Chưa cập nhật"}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Email:</span>
                  <strong>{user.email || "Chưa cập nhật"}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Số điện thoại:</span>
                  <strong>{user.phone || "Chưa cập nhật"}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Địa chỉ:</span>
                  <strong>{user.address || "Chưa cập nhật"}</strong>
                </div>

                <Tooltip title={!canEditUser ? "Bạn không có quyền sửa" : ""}>
                  <Button
                    type="primary"
                    disabled={!canEditUser}
                    onClick={() => setIsEditing(true)}
                    style={{
                      marginTop: 16,
                      opacity: canEditUser ? 1 : 0.5,
                      cursor: canEditUser ? "pointer" : "not-allowed",
                    }}
                  >
                    Sửa thông tin
                  </Button>
                </Tooltip>
              </>
            )}
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
