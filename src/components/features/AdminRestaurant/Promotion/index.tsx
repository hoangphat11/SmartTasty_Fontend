"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";

const getUserFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const PromotionPage = () => {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      const { token, user } = getUserFromLocalStorage();
      const userId = user?.userId;
      if (!token || !userId) return;

      try {
        const res = await axios.get(
          "https://smarttasty-backend.onrender.com/api/Restaurant",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const myRestaurant = res.data.data.find(
          (r: any) => r.ownerId === userId
        );
        if (!myRestaurant?.id) return alert("Tài khoản chưa có nhà hàng!");
        setRestaurantId(myRestaurant.id);
        fetchPromotions(myRestaurant.id);
      } catch {
        alert("Không thể lấy thông tin nhà hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const fetchPromotions = async (resId: string) => {
    const { token } = getUserFromLocalStorage();
    try {
      const res = await axios.get(
        `https://smarttasty-backend.onrender.com/api/Promotions/restaurant/${resId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPromotions(res.data || []);
    } catch {
      alert("Không thể lấy danh sách khuyến mãi");
    }
  };

  const handleOpenModal = (promo: any = null) => {
    if (promo) {
      setEditing(promo);
      setFormData({
        title: promo.title,
        description: promo.description,
        startDate: promo.startDate?.split("T")[0],
        endDate: promo.endDate?.split("T")[0],
      });
    } else {
      setEditing(null);
      setFormData({ title: "", description: "", startDate: "", endDate: "" });
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    const { token } = getUserFromLocalStorage();
    if (!token || !restaurantId) return;
    const payload = { ...formData, restaurantId };

    try {
      if (editing) {
        await axios.put(
          `https://smarttasty-backend.onrender.com/api/Promotions/${editing.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Cập nhật thành công");
      } else {
        await axios.post(
          "https://smarttasty-backend.onrender.com/api/Promotions",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Tạo thành công");
      }
      fetchPromotions(restaurantId);
      setOpen(false);
    } catch {
      alert("Thao tác thất bại");
    }
  };

  const handleDelete = async (id: number) => {
    const { token } = getUserFromLocalStorage();
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    try {
      await axios.delete(
        `https://smarttasty-backend.onrender.com/api/Promotions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Đã xóa thành công");
      if (restaurantId) fetchPromotions(restaurantId);
    } catch {
      alert("Không thể xóa");
    }
  };

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Quản lý khuyến mãi</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
            >
              Thêm khuyến mãi
            </Button>
          </Box>

          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Ngày áp dụng</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {promotions.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell>{promo.title}</TableCell>
                      <TableCell>{promo.description}</TableCell>
                      <TableCell>
                        {promo.startDate?.split("T")[0]} -{" "}
                        {promo.endDate?.split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenModal(promo)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(promo.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editing ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Ngày bắt đầu"
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Ngày kết thúc"
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editing ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromotionPage;
