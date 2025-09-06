"use client";

import { useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchRestaurants } from "@/redux/slices/restaurantSlice";
import StarIcon from "@mui/icons-material/Star";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";

const BodyPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { restaurants, loading, error } = useAppSelector(
    (state) => state.restaurant
  );

  // Load tất cả nhà hàng
  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const renderRestaurants = () => (
    <Grid container spacing={2}>
      {restaurants.map((restaurant) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.id}>
          <Card className={styles.card}>
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className={styles.image}
            />
            <CardContent className={styles.content}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                noWrap
                title={restaurant.name}
              >
                {restaurant.name}
              </Typography>

              {/* Rating */}
              <Box display="flex" alignItems="center" mb={1}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <StarIcon
                    key={idx}
                    fontSize="small"
                    color={
                      idx < (restaurant as any).rating ? "warning" : "disabled"
                    }
                  />
                ))}
              </Box>

              {/* Address */}
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                title={restaurant.address}
                mb={1}
              >
                {restaurant.address}
              </Typography>

              {/* Nút đặt chỗ */}
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
                onClick={() => router.push(`/Restaurants/${restaurant.id}`)}
              >
                Đặt chỗ ngay
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box p={2}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : restaurants.length === 0 ? (
        <Typography>Không có nhà hàng nào.</Typography>
      ) : (
        renderRestaurants()
      )}
    </Box>
  );
};

export default BodyPage;
