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
    try {
      const response = await axiosInstance.post("/api/User/login", values);
      const { errMessage, data } = response.data;

      if (errMessage === "OK" && data?.token && data?.user) {
        // Lưu token + user vào localStorage
        localStorage.setItem("user", JSON.stringify(data));

        // Lưu token vào cookie
        document.cookie = `token=${data.token}; path=/; max-age=86400`;

        // Đẩy user vào Redux
        dispatch(setUser(data.user));

        toast.success("Đăng nhập thành công!");
        router.push("/");
      } else {
        toast.error("Email hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
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
              onClick={() => router.push("/changePassword")}
            >
              Quên mật khẩu?
            </a>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
