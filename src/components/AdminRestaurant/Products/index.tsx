"use client";

import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Switch,
  Select,
  message,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

const { Option } = Select;
const API_URL = "https://smarttasty-backend.onrender.com/api";

interface Dish {
  id: number;
  name: string;
  price: number;
  description?: string;
  category: string;
  isActive: boolean;
  imageUrl?: string;
  image?: string;
  restaurant: {
    id: number;
    name: string;
    address: string;
  };
}

const getUserFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const ProductPage = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const { token, user } = getUserFromLocalStorage();
    const userId = user?.userId;
    if (!token || !userId) return;

    axios
      .get(`${API_URL}/Restaurant`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const myRestaurant = res.data?.data?.find(
          (r: any) => r.ownerId === userId
        );
        if (!myRestaurant?.id) {
          message.error("Tài khoản chưa có nhà hàng!");
          return;
        }
        setRestaurantId(myRestaurant.id);
        fetchDishes(myRestaurant.id);
      })
      .catch(() => message.error("Không thể lấy thông tin nhà hàng"));
  }, []);

  const fetchDishes = async (id: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/Dishes/restaurant/${id}`);
      setDishes(res.data);
    } catch {
      message.error("Không thể lấy danh sách món ăn");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dish?: Dish) => {
    if (dish) {
      setEditingDish(dish);
      form.setFieldsValue({
        name: dish.name,
        price: dish.price,
        description: dish.description,
        category: dish.category,
        isActive: dish.isActive,
      });

      if (dish.imageUrl) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: dish.imageUrl,
          },
        ]);
      }
    } else {
      setEditingDish(null);
      form.resetFields();
      setFileList([]);
    }
    setOpen(true);
  };

  const handleFinish = async (values: any) => {
    const { token } = getUserFromLocalStorage();
    if (!token || !restaurantId) return;

    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("Price", values.price);
    formData.append("Description", values.description || "");
    formData.append("Category", values.category);
    formData.append("IsActive", values.isActive);
    formData.append("RestaurantId", restaurantId.toString());

    if (!fileList.length || !fileList[0].originFileObj) {
      return message.error("Vui lòng tải ảnh món ăn");
    }

    formData.append("Image", fileList[0].originFileObj);

    try {
      if (editingDish) {
        await axios.put(`${API_URL}/Dishes/${editingDish.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("✅ Cập nhật món ăn thành công");
      } else {
        await axios.post(`${API_URL}/Dishes`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("✅ Thêm món ăn thành công");
      }

      fetchDishes(restaurantId);
      form.resetFields();
      setFileList([]);
      setOpen(false);
    } catch (err) {
      console.error("❌ Lỗi khi lưu món ăn:", err);
      message.error("Thao tác thất bại");
    }
  };

  const handleDelete = (id: number) => {
    const { token } = getUserFromLocalStorage();
    Modal.confirm({
      title: "Bạn chắc chắn muốn xoá món ăn này?",
      onOk: async () => {
        try {
          await axios.delete(`${API_URL}/Dishes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("Đã xoá món ăn");
          if (restaurantId) fetchDishes(restaurantId);
        } catch {
          message.error("Xoá món ăn thất bại");
        }
      },
    });
  };

  const columns = [
    {
      title: "Tên món",
      dataIndex: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (price: number) => `${price.toLocaleString()}đ`,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      render: (active: boolean) =>
        active ? (
          <Tag color="green">Đang bán</Tag>
        ) : (
          <Tag color="red">Ngưng</Tag>
        ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      render: (url: string) =>
        url ? (
          <img
            src={url}
            alt="dish"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        ) : (
          <Tag>Không có ảnh</Tag>
        ),
    },
    {
      title: "Hành động",
      render: (_: any, record: Dish) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          >
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="Quản lý món ăn"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Thêm món
          </Button>
        }
      >
        <Table
          dataSource={dishes}
          rowKey="id"
          columns={columns}
          loading={loading}
        />
      </Card>

      <Modal
        title={editingDish ? "Sửa món ăn" : "Thêm món ăn"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingDish(null);
          form.resetFields();
          setFileList([]);
        }}
        onOk={() => form.submit()}
        okText={editingDish ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Tên món" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="ThucAn">Thức ăn</Option>
              <Option value="NuocUong">Nước uống</Option>
              <Option value="ThucAnThem">Thức ăn thêm</Option>
            </Select>
          </Form.Item>
          <Form.Item name="isActive" label="Kinh doanh" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item
            name="image"
            label="Hình ảnh"
            rules={[{ required: true, message: "Vui lòng tải ảnh món ăn" }]}
          >
            <Upload
              name="image"
              listType="picture"
              accept="image/*"
              fileList={fileList}
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
              onRemove={() => {
                setFileList([]);
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;
