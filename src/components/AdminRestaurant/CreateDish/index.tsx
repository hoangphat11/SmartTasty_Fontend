"use client";

import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Switch,
  message,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios/axiosInstance";

const { Option } = Select;

const CreateDish = () => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

  useEffect(() => {
    // Lấy restaurantId từ localStorage user đã login
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        const resId = parsed?.restaurant?.id;
        if (resId) {
          setRestaurantId(resId);
        }
      } catch (err) {
        console.error("Không parse được user", err);
      }
    }
  }, []);

  const handleImageChange = (info: any) => {
    const file = info.file.originFileObj;
    if (file) setImageFile(file);
  };

  const handleFinish = async (values: any) => {
    if (!restaurantId) {
      message.error("Không tìm thấy restaurantId");
      return;
    }

    try {
      // 1. Upload image lên BE
      const formData = new FormData();
      formData.append("image", imageFile as File);

      const uploadRes = await axiosInstance.post("/dishes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const image = uploadRes.data?.image; // Ví dụ: "dishes/xxxxxx"

      // 2. Tạo món ăn
      const payload = {
        ...values,
        restaurantId,
        image,
      };

      const createRes = await axiosInstance.post("/Dishes", payload);

      message.success("Tạo món ăn thành công");
      form.resetFields();
      setImageFile(null);
    } catch (err: any) {
      console.error(err);
      message.error("Tạo món ăn thất bại");
    }
  };

  return (
    <Card title="Tạo Món Ăn Mới" style={{ maxWidth: 600, margin: "auto" }}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="name" label="Tên món ăn" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          name="category"
          label="Loại món ăn"
          rules={[{ required: true }]}
        >
          <Select placeholder="Chọn loại">
            <Option value="ThucAn">Thức ăn</Option>
            <Option value="NuocUong">Nước uống</Option>
            <Option value="ThucAnThem">Thức ăn thêm</Option>
          </Select>
        </Form.Item>

        <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
          <Switch defaultChecked />
        </Form.Item>

        <Form.Item label="Ảnh món ăn" required>
          <Upload
            listType="picture"
            beforeUpload={() => false} // Ngăn auto upload
            onChange={handleImageChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Tạo món ăn
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateDish;
