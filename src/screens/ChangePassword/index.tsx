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
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/User/change-password", {
        oldPassword,
        newPassword,
      });

      const { errCode, message } = response.data;

      if (errCode === 0) {
        toast.success("Đổi mật khẩu thành công!");
        router.push("/login");
      } else {
        toast.error(message || "Đổi mật khẩu thất bại!");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi đổi mật khẩu!");
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
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu cũ" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
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
