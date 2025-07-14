
"use client";

import { useEffect, useState } from "react";
import { Card, Typography, Button, Popconfirm } from "antd";
import axiosInstance from "@/axios/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./informations.module.scss";

const { Title, Paragraph } = Typography;

const InformationsPage = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurant = async () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const token = userData?.token;
      const userId = userData?.user?.userId;
      const role = userData?.user?.role;

      if (!token || role !== "business") {
        toast.error("Bạn không có quyền truy cập.");
        return;
      }

      try {
        const res = await axiosInstance.get("/api/Restaurant", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allRestaurants = res.data?.data || [];
        const myRestaurant = allRestaurants.find(
          (r: any) => r.ownerId === Number(userId)
        );

        if (myRestaurant) {
          setRestaurant(myRestaurant);
        } else {
          toast.info("Bạn chưa có nhà hàng.");
        }
      } catch (error) {
        toast.error("Không thể lấy thông tin nhà hàng.");
        console.error("❌ Lỗi khi fetch nhà hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const handleDelete = async () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const token = userData?.token;

    try {
      await axiosInstance.delete(`/api/Restaurant/${restaurant.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Đã xoá nhà hàng thành công.");
      setRestaurant(null);
    } catch (error) {
      toast.error("Không thể xoá nhà hàng.");
      console.error("❌ Lỗi xoá nhà hàng:", error);
    }
  };

  if (loading) {
    return <div className={styles.container}>Đang tải dữ liệu...</div>;
  }

  if (!restaurant) {
    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={3}>Bạn chưa có nhà hàng</Title>
          <Button type="primary" onClick={() => router.push("/createrestaurant")}>
            Tạo nhà hàng
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={2}>{restaurant.name}</Title>
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

        <div className={styles.actions}>
          <Button type="primary" onClick={() => router.push(`/editrestaurant?id=${restaurant.id}`)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá nhà hàng không?"
            onConfirm={handleDelete}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </div>
      </Card>
    </div>
  );
};

export default InformationsPage;
