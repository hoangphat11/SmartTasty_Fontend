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
  Chip,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchRestaurants } from "@/redux/slices/restaurantSlice";
import StarIcon from "@mui/icons-material/Star";
import LabelIcon from "@mui/icons-material/Label";
import styles from "./styles.module.scss";

const BodyPage = () => {
  const dispatch = useAppDispatch();
  const { restaurants, loading, error } = useAppSelector(
    (state) => state.restaurant
  );

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" mb={2}></Typography>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && restaurants.length === 0 && (
        <Typography>Không có nhà hàng nào.</Typography>
      )}

      <Grid container spacing={2}>
        {restaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={restaurant.id}>
            <Card className={styles.card}>
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className={styles.image}
              />
              <CardContent className={styles.content}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <StarIcon fontSize="small" color="warning" />
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    noWrap
                    title={restaurant.name}
                  >
                    {restaurant.name}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  title={restaurant.address}
                >
                  {restaurant.address}
                </Typography>

                <Box mt={1}>
                  <Chip
                    icon={<LabelIcon fontSize="small" />}
                    label={restaurant.category}
                    size="small"
                    variant="outlined"
                    color="error"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BodyPage;
