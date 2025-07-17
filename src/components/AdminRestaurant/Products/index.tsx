"use client";

import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

interface Dish {
  id: number;
  name: string;
  category: number;
  price: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
  restaurantId: number;
}

const categoryMap: Record<number, string> = {
  0: "Buffet",
  1: "Thức ăn",
  2: "Nước uống",
  3: "Thức ăn thêm",
};

function getRestaurantIdFromToken(): number | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.restaurantId;
  } catch {
    return null;
  }
}

export default function ProductPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/dishes");
      setDishes(res.data);
    } catch {
      message.error("Lỗi khi tải danh sách món ăn");
    } finally {
      setLoading(false);
    }
  };

  const deleteDish = async (id: number) => {
    try {
      await axios.delete(`/api/dishes/${id}`);
      message.success("Xóa món ăn thành công");
      fetchDishes();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const restaurantId = getRestaurantIdFromToken();
      if (!restaurantId) {
        message.error("Không tìm thấy thông tin nhà hàng");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("price", values.price);
      formData.append("description", values.description || "");
      formData.append("isActive", values.isActive);
      formData.append("restaurantId", restaurantId.toString());

      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj); // bạn cần xử lý trên BE
      }

      await axios.post("/api/dishes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Tạo món ăn thành công");
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      fetchDishes();
    } catch (error) {
      message.error("Lỗi khi tạo món ăn");
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (c: number) => categoryMap[c],
    },
    { title: "Giá", dataIndex: "price", key: "price" },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (active: boolean) => (active ? "Hoạt động" : "Ẩn"),
    },
    {
      title: "Hành động",
      render: (_: any, record: Dish) => (
        <>
          <Button type="link" disabled>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => deleteDish(record.id)}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý món ăn</h2>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsModalOpen(true)}
      >
        + Thêm món ăn
      </Button>

      <Table
        dataSource={dishes}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="Tạo món ăn mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleCreate}
        okText="Tạo"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên món" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={0}>Buffet</Select.Option>
              <Select.Option value={1}>Thức ăn</Select.Option>
              <Select.Option value={2}>Nước uống</Select.Option>
              <Select.Option value={3}>Thức ăn thêm</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            name="image"
            rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
          >
            <Upload
              beforeUpload={() => false}
              listType="picture"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Hiển thị?"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
