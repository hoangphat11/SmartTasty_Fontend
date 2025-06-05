"use client";

import { Form, Input, Button, Typography } from "antd";
import axiosInstance from "@/axios/axiosInstance";
import { toast } from "react-toastify";
import { useState } from "react";

const { Title } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/User/forgot-password", values);
      console.log("abc", res);

      if (res.data.errCode === 0) {
        toast.success(
          "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn."
        );
      } else {
        toast.error(
          res.data.errMessage || "Email không tồn tại trong hệ thống."
        );
      }
    } catch (err) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 32 }}>
      <Title level={3}>Quên mật khẩu</Title>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Gửi liên kết đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPasswordPage;
