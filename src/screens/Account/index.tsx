"use client";

import { Card, Typography, Button, Input, Form, message } from "antd";
import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const AccountPage = () => {
  const [user, setUser] = useState<{
    userName?: string;
    email?: string;
    phone?: string;
    address?: string;
  } | null>(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        // Kiểm tra xem user lưu có nằm trong parsed.user hay là root
        if (parsed.userName || parsed.email || parsed.phone || parsed.address) {
          setUser(parsed);
        } else if (parsed.user) {
          setUser(parsed.user);
        } else {
          console.warn("Dữ liệu user không hợp lệ:", parsed);
        }

      } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("user");
    router.push("/api/User");
  };

  const onFinishChangePassword = (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }
    setLoading(true);
    // TODO: Gọi API đổi mật khẩu ở đây
    setTimeout(() => {
      setLoading(false);
      message.success("Đổi mật khẩu thành công");
      setIsChangingPassword(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className={styles.accountContainer}>
        <Card>
          <Title level={3}>Bạn chưa đăng nhập</Title>
          <Button type="primary" onClick={() => router.push("/login")}>
            Đăng nhập
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.accountContainer}>
      <Card
        title="Thông tin tài khoản"
        style={{ maxWidth: 400, margin: "0 auto" }}
        extra={
          <Button danger onClick={handleLogout}>
            Đăng xuất
          </Button>
        }
      >
        <p>
          <Text strong>Tên người dùng: </Text>
          {user.userName || "Chưa cập nhật"}
        </p>
        <p>
          <Text strong>Email: </Text>
          {user.email || "Chưa cập nhật"}
        </p>
        <p>
          <Text strong>Số điện thoại: </Text>
          {user.phone || "Chưa cập nhật"}
        </p>
        <p>
          <Text strong>Địa chỉ: </Text>
          {user.address || "Chưa cập nhật"}
        </p>

        {!isChangingPassword ? (
          <Button
            type="primary"
            style={{ marginTop: 20 }}
            onClick={() => setIsChangingPassword(true)}
          >
            Đổi mật khẩu
          </Button>
        ) : (
          <Form
            layout="vertical"
            style={{ marginTop: 20 }}
            onFinish={onFinishChangePassword}
          >
            <Form.Item
              label="Mật khẩu hiện tại"
              name="currentPassword"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu mới" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Xác nhận
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => setIsChangingPassword(false)}
                disabled={loading}
              >
                Hủy
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default AccountPage;
