"use client";

import { Form, Input, Button, Typography } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/axios/axiosInstance";
import { toast } from "react-toastify";
import { useState } from "react";

const { Title } = Typography;

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/User/reset-password", {
        token,
        newPassword: values.password,
      });

      if (res.data.errCode === 0) {
        toast.success("Đặt lại mật khẩu thành công!");
        router.push("/login");
      } else {
        toast.error(res.data.errMessage || "Token không hợp lệ hoặc đã hết hạn.");
      }
    } catch (err) {
      toast.error("Lỗi trong quá trình đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div>Liên kết không hợp lệ.</div>;
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 32 }}>
      <Title level={3}>Đặt lại mật khẩu</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Mật khẩu mới"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
