"use client";

import { useEffect, useState } from "react";
import { Card, Typography, Button, Input, Form } from "antd";
import axiosInstance from "@/lib/axios/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

const { Title, Paragraph } = Typography;

const InformationsPage = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurant = async () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const token = userData?.token;
      const role = userData?.user?.role;
      const userId = userData?.user?.userId;

      if (!token || role !== "business") return;

      try {
        const res = await axiosInstance.get("/api/Restaurant", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const myRestaurants = res.data?.data.filter(
          (restaurant: any) => restaurant.ownerId === Number(userId)
        );
        console.log("✅ Nhà hàng của user:", myRestaurants);
        if (myRestaurants.length > 0) {
          setRestaurant(myRestaurants[0]);
        } else {
          toast.warning("Bạn chưa có nhà hàng.");
          router.push("/createrestaurant");
        }
      } catch (err) {
        toast.error("Không thể tải thông tin.");
        console.error(err);
      }
    };

    fetchRestaurant();
  }, []);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Bạn chắc chắn muốn xóa nhà hàng?");
    if (!confirmDelete) return;

    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

      await axiosInstance.delete(`/api/Restaurant/${restaurant.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Đã xóa nhà hàng.");
      setRestaurant(null);
      router.push("/");
    } catch (error) {
      toast.error("Xóa thất bại.");
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

      await axiosInstance.put(`/api/Restaurant`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Cập nhật thành công!");
      setRestaurant(formData);
      setIsEditing(false);
    } catch (error) {
      toast.error("Cập nhật thất bại.");
      console.error(error);
    }
  };

  if (!restaurant) return null;

  return (
    <div className={styles.informationsContainer}>
      <Card className={styles.informationCard}>
        <Title level={2}>Thông tin nhà hàng</Title>

        {isEditing ? (
          <>
            <Form layout="vertical">
              <Form.Item label="Tên">
                <Input
                  value={formData?.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Form.Item>

              <Form.Item label="Địa chỉ">
                <Input
                  value={formData?.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </Form.Item>

              <Form.Item label="Danh mục">
                <Input
                  value={formData?.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </Form.Item>

              <Form.Item label="Mô tả">
                <Input.TextArea
                  value={formData?.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Form.Item>

              <Form.Item label="Giờ mở cửa">
                <Input
                  value={formData?.openTime}
                  onChange={(e) =>
                    setFormData({ ...formData, openTime: e.target.value })
                  }
                />
              </Form.Item>

              <Form.Item label="Giờ đóng cửa">
                <Input
                  value={formData?.closeTime}
                  onChange={(e) =>
                    setFormData({ ...formData, closeTime: e.target.value })
                  }
                />
              </Form.Item>

              <div style={{ display: "flex", gap: "10px", marginTop: 20 }}>
                <Button type="primary" onClick={handleSave}>
                  Lưu
                </Button>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
              </div>
            </Form>
          </>
        ) : (
          <>
            <Paragraph>
              <strong>Tên:</strong> {restaurant.name}
            </Paragraph>
            <Paragraph>
              <strong>Địa chỉ:</strong> {restaurant.address}
            </Paragraph>
            <Paragraph>
              <strong>Danh mục:</strong> {restaurant.category}
            </Paragraph>
            <Paragraph>
              <strong>Mô tả:</strong> {restaurant.description}
            </Paragraph>
            <Paragraph>
              <strong>Giờ mở cửa:</strong> {restaurant.openTime}
            </Paragraph>
            <Paragraph>
              <strong>Giờ đóng cửa:</strong> {restaurant.closeTime}
            </Paragraph>

            <div style={{ display: "flex", gap: "10px", marginTop: 20 }}>
              <Button
                type="primary"
                onClick={() => {
                  setFormData({ ...restaurant });
                  setIsEditing(true);
                }}
              >
                Sửa
              </Button>
              <Button danger onClick={handleDelete}>
                Xóa
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default InformationsPage;
