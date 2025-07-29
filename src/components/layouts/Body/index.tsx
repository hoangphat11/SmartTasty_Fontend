"use client";

import { useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchRestaurants } from "@/redux/slices/restaurantSlice";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { restaurants, loading, error } = useAppSelector(
    (state) => state.restaurant
  );

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Danh sách nhà hàng
      </Typography>

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

      <Grid container spacing={3}>
        {Array.isArray(restaurants) && restaurants.length > 0
          ? restaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={restaurant.imageUrl}
                    alt={restaurant.name}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {restaurant.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {restaurant.address}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : !loading && <Typography>Không có nhà hàng nào.</Typography>}
      </Grid>
    </Box>
  );
};

export default HomePage;
