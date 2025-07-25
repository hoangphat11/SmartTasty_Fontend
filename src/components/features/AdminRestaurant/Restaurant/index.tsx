"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

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
  imageUrl?: string;
}

interface RestaurantInfo {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
}

const RestaurantPage = () => {
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(
    null
  );
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
          const restaurant = ownedRestaurants[0];
          setRestaurantId(restaurant.id);
          setRestaurantInfo({
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            imageUrl: restaurant.imageUrl,
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
      .then((res) => {
        const enhancedDishes = (res.data || []).map((dish: Dish) => ({
          ...dish,
          imageUrl: `https://res.cloudinary.com/djcur1ymq/image/upload/${dish.image}`,
        }));
        setDishes(enhancedDishes);
      })
      .catch(() => toast.error("Không thể lấy danh sách món ăn."))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  if (!restaurantId || !restaurantInfo) {
    return (
      <Box className={styles.loginContainer}>
        <Paper elevation={3} className={styles.loginCard}>
          <Typography variant="h5" gutterBottom>
            Bạn chưa có nhà hàng
          </Typography>
          <Typography paragraph>
            Vui lòng tạo nhà hàng để bắt đầu quản lý.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/createrestaurant")}
          >
            Tạo nhà hàng
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className={styles.pageContainer}>
      <Paper elevation={3} className={styles.restaurantCard}>
        <Box className={styles.restaurantContent}>
          <Box className={styles.restaurantImageWrapper}>
            <img
              src={restaurantInfo.imageUrl}
              alt="Ảnh nhà hàng"
              className={styles.restaurantImage}
            />
          </Box>
          <Box className={styles.restaurantInfo}>
            <Typography variant="h4">{restaurantInfo.name}</Typography>
            <Typography>
              <strong>Địa chỉ:</strong> {restaurantInfo.address}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box className={styles.menuContainer}>
        <Typography variant="h5" gutterBottom>
          Thực đơn
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : dishes.length === 0 ? (
          <Typography>Chưa có món ăn nào trong nhà hàng.</Typography>
        ) : (
          <Grid container spacing={2}>
            {dishes.map((dish) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dish.id}>
                <Paper elevation={2}>
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                  />
                  <Box p={2}>
                    <Typography variant="h6">
                      {dish.name}
                      {!dish.isActive && (
                        <Chip
                          label="Ngưng bán"
                          color="error"
                          size="small"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </Typography>
                    <Typography fontWeight="bold" color="primary">
                      {dish.price.toLocaleString()}đ
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default RestaurantPage;
