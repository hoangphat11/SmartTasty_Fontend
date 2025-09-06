"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchRestaurantById } from "@/redux/slices/restaurantSlice";
import { fetchDishes } from "@/redux/slices/dishSlide";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const {
    current: restaurant,
    loading: restaurantLoading,
    error: restaurantError,
  } = useAppSelector((state) => state.restaurant);
  const {
    items: dishes,
    loading: dishesLoading,
    error: dishesError,
  } = useAppSelector((state) => state.dishes);

  useEffect(() => {
    if (!id) return;

    // Lấy chi tiết nhà hàng
    dispatch(fetchRestaurantById(Number(id)));
    // Lấy danh sách món ăn
    dispatch(fetchDishes(id)); // dùng fetchDishes từ dishSlice
  }, [dispatch, id]);

  if (restaurantLoading || dishesLoading)
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );

  if (restaurantError || !restaurant)
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <Typography variant="h5">
          {restaurantError || "Không tìm thấy nhà hàng"}
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      {/* Thông tin nhà hàng */}
      <Paper elevation={3} sx={{ display: "flex", gap: 4, p: 3, mb: 4 }}>
        <Box>
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            style={{
              width: 300,
              height: 200,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </Box>

        <Box flex={1}>
          <Typography variant="h4">{restaurant.name}</Typography>
          <Typography>
            <strong>Địa chỉ:</strong> {restaurant.address}
          </Typography>
          <Typography>
            <strong>Giờ hoạt động:</strong> {restaurant.openTime} -{" "}
            {restaurant.closeTime}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => alert("Chức năng đặt chỗ")}
          >
            Đặt chỗ ngay
          </Button>
        </Box>
      </Paper>

      {/* Thực đơn */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Thực đơn
        </Typography>
        {dishes.length === 0 ? (
          <Typography>Chưa có món ăn nào.</Typography>
        ) : (
          <Grid container spacing={2}>
            {dishes.map((dish) => (
              <Grid
                item
                key={dish.id}
                sx={{
                  flex: "0 0 15%", // Mỗi món chiếm 20% chiều ngang
                  maxWidth: "20%",
                }}
              >
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
                          sx={{ ml: 1 }}
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

export default RestaurantDetailPage;
