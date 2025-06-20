"use client";

import { useEffect, useState } from "react";
import { Card, Typography, Button } from "antd";
import axiosInstance from "@/axios/axiosInstance";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";

const { Title, Paragraph } = Typography;

const RestaurantPage = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurant = async () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const token = userData?.token;
      const role = userData?.user?.role;

      if (!token || role !== "business") return;

      try {
        const res = await axiosInstance.get("/api/Restaurant", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.length === 0) {
          setRestaurant(null);
        } else {
          setRestaurant(res.data[0]); // chỉ lấy nhà hàng đầu tiên
        }
      } catch (err) {
        toast.error("Không thể lấy thông tin nhà hàng.");
      }
    };

    fetchRestaurant();
  }, []);

  if (!restaurant) {
    return (
      <div className={styles.loginContainer}>
        <Card className={styles.loginCard}>
          <Title level={3}>Bạn chưa có nhà hàng</Title>
          <Paragraph>Vui lòng tạo nhà hàng để bắt đầu quản lý.</Paragraph>
          <Button type="primary" onClick={() => router.push("/createrestaurant")}>
            Tạo nhà hàng
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <Title level={2}>{restaurant.name}</Title>
        <Paragraph><strong>Địa chỉ:</strong> {restaurant.address}</Paragraph>
        <Paragraph><strong>Danh mục:</strong> {restaurant.category}</Paragraph>
        <Paragraph><strong>Mô tả:</strong> {restaurant.description}</Paragraph>
        <Paragraph><strong>Giờ mở cửa:</strong> {restaurant.openTime}</Paragraph>
        <Paragraph><strong>Giờ đóng cửa:</strong> {restaurant.closeTime}</Paragraph>
      </Card>
    </div>
  );
};

export default RestaurantPage;
