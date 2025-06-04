"use client";

import { Form, Input, Button, Card, Typography } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/axios/axiosInstance";
import styles from "./styles.module.scss";
import { isEqual } from "lodash";
import { toast } from "react-toastify";

const { Title } = Typography;

const Index = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: { email: string; userPassword: string }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/User/login", values);

      if (isEqual(response?.data?.errCode, 0)) {
        const { token, errCode, ...user } = response.data;

        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("user", JSON.stringify(user));
        document.cookie = `token=${token}; path=/; max-age=86400`;
        toast.success("Đăng nhập thành công!");

        // Chuyển hướng tới trang chủ
        router.push("/");
      } else {
        toast.error("Email hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
      toast.error("Email hoặc mật khẩu không đúng!");
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
            <a style={{ color: "#1890ff" }}>Quên mật khẩu?</a>
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

export default Index;
