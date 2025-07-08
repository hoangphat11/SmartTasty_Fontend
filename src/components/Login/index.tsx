"use client";

import { Form, Input, Button, Card, Typography } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/axios/axiosInstance";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSide";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (values: {
    email: string;
    userPassword: string;
  }) => {
    setLoading(true);
    console.log("🔐 Đang gửi thông tin login:", values);

    try {
      const response = await axiosInstance.post("/api/User/login", values);
      const { errMessage, data } = response.data;

      console.log("📥 Phản hồi từ server:", response.data);

      if (errMessage === "OK" && data?.token && data?.user) {
        // console.log("✅ Login thành công - user:", data.user);
        // console.log("✅ Token JWT:", data.token);

        // Redux
        dispatch(setUser(data.user));

        // Lưu localStorage
        localStorage.setItem("user", JSON.stringify(data));

        // Lưu token vào cookie (cho middleware)
        document.cookie = `token=${data.token}; path=/; max-age=86400`;

        // Debug cookie
        console.log("🍪 Cookie hiện tại:", document.cookie);

        toast.success("Đăng nhập thành công!");

        // Điều hướng theo role
        switch (data.user.role) {
          case "admin":
            //  console.log("➡️ Chuyển hướng đến /admin");
            router.push("/admin");
            break;
          case "business":
            //  console.log("➡️ Chuyển hướng đến /restaurant");
            router.push("/restaurant");
            break;
          default:
            // console.log("➡️ Chuyển hướng đến /");
            router.push("/");
        }
      } else {
        console.warn("❌ Login sai thông tin:", errMessage);
        toast.error("Email hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi login:", error);
      toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <Title level={2} style={{ textAlign: "center" }}>
          Đăng nhập
        </Title>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="userPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <div className={styles.forgotPassword}>
            <a
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => router.push("/forgotPassword")}
            >
              Quên mật khẩu?
            </a>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đăng nhập
            </Button>
          </Form.Item>
          <div className={styles.loginBottom}>
            Bạn mới biết đến Smarttasty?
            <a onClick={() => router.push("/register")}>Đăng ký</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
