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
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  fetchRestaurantByOwner,
  clearCurrentRestaurant,
  updateRestaurant,
} from "@/redux/slices/restaurantSlice";
import { fetchDishes } from "@/redux/slices/dishSlide";

const RestaurantPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { current: restaurantInfo, loading: restaurantLoading } =
    useAppSelector((state) => state.restaurant);
  const { items: dishes, loading: dishLoading } = useAppSelector(
    (state) => state.dishes
  );

  const [isEditing, setIsEditing] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    address: "",
    openTime: "",
    closeTime: "",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData?.user?.userId;
    const role = userData?.user?.role;
    const token = userData?.token;

    if (!token || role !== "business") {
      toast.error("Bạn không có quyền truy cập.");
      return;
    }

    dispatch(fetchRestaurantByOwner({ token, userId }));

    return () => {
      dispatch(clearCurrentRestaurant());
    };
  }, [dispatch]);

  useEffect(() => {
    if (restaurantInfo?.id) {
      dispatch(fetchDishes(restaurantInfo.id.toString()));
      setFormState({
        name: restaurantInfo.name,
        address: restaurantInfo.address,
        openTime: restaurantInfo.openTime,
        closeTime: restaurantInfo.closeTime,
      });
    }
  }, [restaurantInfo, dispatch]);

  const handleUpdate = async () => {
    if (!restaurantInfo) return;

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const token = userData?.token;

    const formPayload = {
      ...restaurantInfo,
      name: formState.name,
      address: formState.address,
      openTime: formState.openTime,
      closeTime: formState.closeTime,
      file: new File([], ""), // giữ nguyên nếu không dùng ảnh
    };

    try {
      await dispatch(
        updateRestaurant({ id: restaurantInfo.id, data: formPayload })
      ).unwrap();
      toast.success("Cập nhật nhà hàng thành công!");
      dispatch(
        fetchRestaurantByOwner({ token, userId: restaurantInfo.ownerId })
      );
      setIsEditing(false);
    } catch (err) {
      toast.error("Cập nhật thất bại.");
    }
  };

  const handleCancelEdit = () => {
    if (!restaurantInfo) return;
    setFormState({
      name: restaurantInfo.name,
      address: restaurantInfo.address,
      openTime: restaurantInfo.openTime,
      closeTime: restaurantInfo.closeTime,
    });
    setIsEditing(false);
  };

  if (restaurantLoading || (!restaurantInfo && !restaurantLoading)) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!restaurantInfo) {
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
            {isEditing ? (
              <>
                <TextField
                  fullWidth
                  label="Tên nhà hàng"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={formState.address}
                  onChange={(e) =>
                    setFormState({ ...formState, address: e.target.value })
                  }
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Giờ mở cửa"
                  value={formState.openTime}
                  onChange={(e) =>
                    setFormState({ ...formState, openTime: e.target.value })
                  }
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Giờ đóng cửa"
                  value={formState.closeTime}
                  onChange={(e) =>
                    setFormState({ ...formState, closeTime: e.target.value })
                  }
                  margin="normal"
                />
                <Box display="flex" gap={2} mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                  >
                    Lưu thay đổi
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancelEdit}
                  >
                    Huỷ
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h4">{restaurantInfo.name}</Typography>
                <Typography>
                  <strong>Địa chỉ:</strong> {restaurantInfo.address}
                </Typography>
                <Typography>
                  <strong>Giờ hoạt động:</strong> {restaurantInfo.openTime} -{" "}
                  {restaurantInfo.closeTime}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(true)}
                  sx={{ mt: 2 }}
                >
                  Sửa
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      <Box className={styles.menuContainer}>
        <Typography variant="h5" gutterBottom>
          Thực đơn
        </Typography>

        {dishLoading ? (
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
