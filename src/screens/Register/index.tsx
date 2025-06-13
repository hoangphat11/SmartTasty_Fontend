"use client";

import { Form, Input, Button, Card, Typography } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/axios/axiosInstance";
import axios from "axios"; 
import styles from "./styles.module.scss";
import { toast } from "react-toastify";

const { Title } = Typography;

const Index = () => {
 const [loading, setLoading] = useState(false);
const router = useRouter();

const handleRegister = async (values: {
  userName: string;
  userPassword: string;
  email: string;
  phone: string;
  address: string;
}) => {
  setLoading(true);
  try {
    const response = await axiosInstance.post("/api/User", {
      ...values,
      Role: "user",
    });

    const { errCode, errMessage } = response.data;

    if (errCode === 0) {
      toast.success(errMessage || "Đăng ký thành công!");
      router.push("/");
    } else {
      toast.error(errMessage || "Đăng ký thất bại!");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.errMessage) {
      toast.error(error.response.data.errMessage);
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.registerContainer}>
      <Card className={styles.registerCard}>
        <Title level={2} style={{ textAlign: "center" }}>
          Đăng ký
        </Title>
        <Form layout="vertical" onFinish={handleRegister}>
  <Form.Item
    label="Tài khoản"
    name="userName"
    rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
  >
    <Input placeholder="Nhập tên người dùng" />
  </Form.Item>

  <Form.Item
    label="Mật khẩu"
    name="userPassword"
    rules={[
      { required: true, message: "Vui lòng nhập mật khẩu!" },
      {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
        message:
          "Mật khẩu phải chứa chữ hoa, chữ thường, số, ký tự đặc biệt và dài hơn 5 ký tự.",
      },
    ]}
  >
    <Input.Password placeholder="Nhập mật khẩu" />
  </Form.Item>

  <Form.Item
    label="Email"
    name="email"
    rules={[
      { required: true, message: "Vui lòng nhập Email!" },
      {
        pattern:
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: "Email không hợp lệ.",
      },
    ]}
  >
    <Input placeholder="Nhập email" />
  </Form.Item>

  <Form.Item
    label="Số điện thoại"
    name="phone"
    rules={[
      { required: true, message: "Vui lòng nhập số điện thoại!" },
      {
        pattern: /^(03|05|07|08|09)\d{8}$/,
        message:
          "Số điện thoại không hợp lệ (phải là số Việt Nam bắt đầu bằng 03, 05, 07, 08, 09 và có 10 chữ số).",
      },
    ]}
  >
    <Input placeholder="Nhập số điện thoại" />
  </Form.Item>

  <Form.Item
    label="Địa chỉ"
    name="address"
    rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
  >
    <Input placeholder="Nhập địa chỉ" />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit" loading={loading} block>
      Đăng ký
    </Button>
  </Form.Item>
</Form>
      </Card>
    </div>
  );
};

export default Index;
