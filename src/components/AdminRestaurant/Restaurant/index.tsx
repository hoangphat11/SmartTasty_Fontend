"use client";

import { useEffect, useState } from "react";
import { Card, Typography, Button, Row, Col, Tag, Skeleton } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

const { Title, Paragraph } = Typography;

interface Dish {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  isActive: boolean;
  restaurant: {
    id: number;
    name: string;
    address: string;
  };
}

const RestaurantPage = () => {
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<
    Dish["restaurant"] | null
  >(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData?.user?.userId;
    const role = userData?.user?.role;
    const token = userData?.token;

    if (!token || role !== "business") {
      toast.error("Bạn không có quyền truy cập.");
      return;
    }

    // Gọi API lấy danh sách nhà hàng của user để lấy ID
    axios
      .get(`https://smarttasty-backend.onrender.com/api/Restaurant`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const ownedRestaurants = res.data?.data?.filter(
          (r: any) => r.ownerId === userId
        );

        if (ownedRestaurants.length === 0) {
          setRestaurantId(null);
          setRestaurantInfo(null);
        } else {
          setRestaurantId(ownedRestaurants[0].id);
          setRestaurantInfo({
            id: ownedRestaurants[0].id,
            name: ownedRestaurants[0].name,
            address: ownedRestaurants[0].address,
          });
        }
      })
      .catch(() => toast.error("Không thể lấy thông tin nhà hàng."));
  }, []);

  useEffect(() => {
    if (!restaurantId) return;

    setLoading(true);
    axios
      .get(
        `https://smarttasty-backend.onrender.com/api/Dishes/restaurant/${restaurantId}`
      )
      .then((res) => setDishes(res.data || []))
      .catch(() => toast.error("Không thể lấy danh sách món ăn."))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  if (!restaurantId || !restaurantInfo) {
    return (
      <div className={styles.loginContainer}>
        <Card className={styles.loginCard}>
          <Title level={3}>Bạn chưa có nhà hàng</Title>
          <Paragraph>Vui lòng tạo nhà hàng để bắt đầu quản lý.</Paragraph>
          <Button
            type="primary"
            onClick={() => router.push("/createrestaurant")}
          >
            Tạo nhà hàng
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.restaurantCard}>
        <Title level={2}>{restaurantInfo.name}</Title>
        <Paragraph>
          <strong>Địa chỉ:</strong> {restaurantInfo.address}
        </Paragraph>
      </Card>

      <div className={styles.menuContainer}>
        <Title level={3}>Thực đơn</Title>

        {loading ? (
          <Row gutter={[16, 16]}>
            {[...Array(4)].map((_, i) => (
              <Col key={i} xs={24} sm={12} md={8} lg={6}>
                <Card loading />
              </Col>
            ))}
          </Row>
        ) : dishes.length === 0 ? (
          <Paragraph>Chưa có món ăn nào trong nhà hàng.</Paragraph>
        ) : (
          <Row gutter={[16, 16]}>
            {dishes.map((dish) => (
              <Col key={dish.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={dish.name}
                      src={`https://smarttasty-backend.onrender.com/${dish.image}`}
                      style={{ height: 160, objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta
                    title={
                      <>
                        {dish.name}
                        {!dish.isActive && (
                          <Tag color="red" style={{ marginLeft: 8 }}>
                            Ngưng bán
                          </Tag>
                        )}
                      </>
                    }
                    description={
                      <p style={{ fontWeight: "bold", color: "#fa541c" }}>
                        {dish.price.toLocaleString()}đ
                      </p>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;
