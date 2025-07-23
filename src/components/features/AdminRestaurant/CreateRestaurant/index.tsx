"use client";

import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  TimePicker,
  Select,
  Upload,
} from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios/axiosInstance";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

const MapView = dynamic(() => import("@/components/layouts/MapView"), {
  ssr: false,
});

const { Title } = Typography;

const RestaurantCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState<number>(10.762622);
  const [longitude, setLongitude] = useState<number>(106.660172);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const router = useRouter();

  const handleCreate = async (values: any) => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;
      if (!token) {
        toast.error("Không tìm thấy token đăng nhập.");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("address", values.address);
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("description", values.description);
      formData.append("openTime", values.openTime.format("HH:mm"));
      formData.append("closeTime", values.closeTime.format("HH:mm"));
      formData.append("status", "APPROVED");

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj); // key BE yêu cầu
      }

      const response = await axiosInstance.post("/api/Restaurant", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const { errMessage } = response.data;
      if (errMessage === "Created") {
        toast.success("Tạo nhà hàng thành công!");
        router.push("/restaurant");
      } else {
        toast.error("Tạo thất bại, vui lòng kiểm tra lại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo nhà hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const address = e.target.value;
    form.setFieldsValue({ address });

    if (!address.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setLatitude(lat);
        setLongitude(lon);
        form.setFieldsValue({ latitude: lat, longitude: lon });
      } else {
        toast.error("Không tìm thấy tọa độ từ địa chỉ.");
      }
    } catch (err) {
      toast.error("Lỗi khi lấy tọa độ từ địa chỉ.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <Title level={2} style={{ textAlign: "center" }}>
          Tạo nhà hàng mới
        </Title>
        <Form layout="vertical" onFinish={handleCreate} form={form}>
          <Form.Item
            label="Tên nhà hàng"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn loại hình nhà hàng">
              <Select.Option value="Buffet">Buffet</Select.Option>
              <Select.Option value="NhaHang">Nhà hàng</Select.Option>
              <Select.Option value="AnVatViaHe">Ăn vặt/vỉa hè</Select.Option>
              <Select.Option value="AnChay">Ăn chay</Select.Option>
              <Select.Option value="CafeNuocuong">Cafe/Nuocuong</Select.Option>
              <Select.Option value="QuanAn">Quán ăn</Select.Option>
              <Select.Option value="Bar">Bar</Select.Option>
              <Select.Option value="QuanNhau">Quán nhậu</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true }]}
          >
            <Input onChange={handleAddressChange} />
          </Form.Item>

          <Form.Item label="Vị trí hiển thị trên bản đồ">
            <MapView
              initialLat={latitude}
              initialLng={longitude}
              isMarkerFixed={true}
              lat={latitude}
              lng={longitude}
            />
            <p>
              Vĩ độ: {latitude.toFixed(6)} | Kinh độ: {longitude.toFixed(6)}
            </p>
          </Form.Item>

          <Form.Item name="latitude" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="longitude" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Giờ mở cửa"
            name="openTime"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="Giờ đóng cửa"
            name="closeTime"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item label="Ảnh đại diện" required>
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              accept="image/*"
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Tạo nhà hàng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RestaurantCreatePage;
