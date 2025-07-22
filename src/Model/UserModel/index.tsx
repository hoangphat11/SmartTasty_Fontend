"use client";

import axiosInstance from "@/lib/axios/axiosInstance";
import { Button, Form, Input, Modal, Select } from "antd";
import { isEqual } from "lodash";
import React, { useState } from "react";
import { toast } from "react-toastify";

const { Option } = Select;

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserFormValues {
  UserName: string;
  UserPassword: string;
  Email: string;
  Phone: string;
  Role: "admin" | "user";
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<UserFormValues>();

  const handleSubmit = () => {
    form.submit();
  };

  const onFinish = async (values: UserFormValues) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("CreateNewUser", values);

      if (isEqual(response.data.errCode, 0)) {
        form.resetFields();
        onClose();
        toast.success("Thêm mới thành công!");
        onSuccess();
      } else {
        toast.error("Thêm mới thất bại!");
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      toast.error("Thêm mới thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        title="Thêm user"
        onOk={handleSubmit}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={onClose}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Thêm
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="add_user" onFinish={onFinish}>
          <Form.Item
            label="UserName"
            name="UserName"
            rules={[{ required: true, message: "Vui lòng nhập UserName!" }]}
          >
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>

          <Form.Item
            label="UserPassword"
            name="UserPassword"
            rules={[{ required: true, message: "Vui lòng nhập UserPassWord!" }]}
          >
            <Input placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="Email"
            rules={[
              { required: true, message: "Vui lòng nhập Email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="Phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="Role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserModal;
