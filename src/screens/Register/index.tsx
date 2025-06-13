"use client";

import { Form, Input, Button, Card, Typography, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/axios/axiosInstance";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

const { Title } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const checkEmailExists = async (email: string) => {
    try {
      const res = await axiosInstance.get("/api/User");
      const users = res.data || [];
      return users.some((user: any) => user.email === email);
    } catch (error) {
      console.error("Lỗi khi kiểm tra email:", error);
      return false;
    }
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;

    // Xóa lỗi trước đó (nếu có)
    form.setFields([
      {
        name: "email",
        errors: [],
      },
    ]);

    // Kiểm tra định dạng email hợp lệ trước
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;

    const exists = await checkEmailExists(email);
    if (exists) {
      form.setFields([
        {
          name: "email",
          errors: ["Email đã tồn tại"],
        },
      ]);
      message.error("Email đã tồn tại, vui lòng dùng email khác!");
    }
  };

  const handleRegister = async (values: {
    userName: string;
    userPassword: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    setLoading(true);

    try {
      const emailExists = await checkEmailExists(values.email);
      if (emailExists) {
        form.setFields([
          {
            name: "email",
            errors: ["Email đã tồn tại"],
          },
        ]);
        message.error("Email đã tồn tại, không thể đăng ký!");
        return;
      }

      const response = await axiosInstance.post("/api/User", {
        ...values,
        Role: "user",
      });

      if (response.data?.errCode === 0) {
        toast.success("Đăng ký thành công!");
        router.push("/");
      } else {
        toast.error(response.data?.errMessage || "Đăng ký thất bại!");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi đăng ký.");
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
        <Form layout="vertical" form={form} onFinish={handleRegister}>
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
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
                message: "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
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
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              placeholder="Nhập email"
              onBlur={handleEmailChange}
              onChange={handleEmailChange}
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^(03|05|07|08|09)\d{8}$/,
                message: "Số điện thoại không hợp lệ!",
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

      <div className={styles.formbusiness}>
        <a
          onClick={() => router.push("/business")}
          style={{ color: "#1890ff", cursor: "pointer" }}
        >
          Đăng ký cho doanh nghiệp
        </a>
      </div>
    </div>
  );
};

export default RegisterPage;
