"use client";

import { Form, Input, Button, Card, Typography } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/axios/axiosInstance";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";

const { Title } = Typography;

const ChangePasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    const { currentPassword, newPassword, confirmNewPassword } = values;

    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/User/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      const { errCode, errMessage } = response.data;

      if (errCode === 0) {
        toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        toast.error(errMessage || "Đổi mật khẩu thất bại!");
      }
    } catch (error: any) {
      toast.error(error?.errMessage || " lỗi .");
      console.error("Change password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <Title level={2} style={{ textAlign: "center" }}>
          Đổi mật khẩu
        </Title>
        <Form layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
                message:
                  "Mật khẩu phải chứa chữ hoa, chữ thường, số, ký tự đặc biệt và dài hơn 5 ký tự.",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmNewPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
