"use client";

import { Form, Input, Button, Card, Typography, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios/axiosInstance";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSide";
//import { headers } from "next/headers";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  // Load email + password nếu có lưu
  useEffect(() => {
    const savedLogin = localStorage.getItem("rememberedLogin");
    if (savedLogin) {
      const { email, userPassword } = JSON.parse(savedLogin);
      form.setFieldsValue({
        email,
        userPassword,
        remember: true,
      });
    }
  }, []);

  const handleLogin = async (values: {
    email: string;
    userPassword: string;
    remember?: boolean;
  }) => {
    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/User/login", values);
      const { errMessage, data } = response.data;

      if (errMessage === "OK" && data?.token && data?.user) {
        dispatch(setUser(data.user));

        // Lưu user cho middleware
        document.cookie = `token=${data.token}; path=/; max-age=86400`;

        // Nếu remember thì lưu login vào localStorage
        if (values.remember) {
          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem(
            "rememberedLogin",
            JSON.stringify({
              email: values.email,
              userPassword: values.userPassword,
            })
          );
        } else {
          localStorage.removeItem("rememberedLogin");
        }

        toast.success("Đăng nhập thành công!");

        // Điều hướng theo role
        switch (data.user.role) {
          case "admin":
            router.push("/admin");
            break;
          case "business":
            router.push("/restaurant");
            break;
          default:
            router.push("/");
        }
      } else {
        toast.error("Email hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
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
        <Form layout="vertical" onFinish={handleLogin} form={form}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="userPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Lưu đăng nhập</Checkbox>
            </Form.Item>
            <a
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => router.push("/forgotPassword")}
            >
              Quên mật khẩu?
            </a>
          </div>

          <Form.Item>
            <Button
              //className={styles.Button}
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className={styles.loginBottom}>
            Bạn mới biết đến Smarttasty?{" "}
            <a onClick={() => router.push("/register")}>Đăng ký</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
