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
  MenuItem,
  Switch,
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
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  fetchDishes,
  addDish,
  updateDish,
  deleteDish,
} from "@/redux/slices/dishSlide";
import { Dish } from "@/types/dish";
import styles from "./styles.module.scss";

const getUserFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { items: dishes, loading } = useAppSelector((state) => state.dishes);

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "ThucAn",
    isActive: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [discounts, setDiscounts] = useState<{ [key: string]: number }>({});
  const [openDiscountInput, setOpenDiscountInput] = useState<string | null>(
    null
  );
  const [discountInputValue, setDiscountInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(
    dishes.filter((dish) => {
      const matchKeyword = dish.name
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || dish.category === selectedCategory;
      return matchKeyword && matchCategory;
    }).length / itemsPerPage
  );

  useEffect(() => {
    const { token, user } = getUserFromLocalStorage();
    const userId = user?.userId;
    if (!token || !userId) return;

    fetch(`https://smarttasty-backend.onrender.com/api/Restaurant`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        const myRestaurant = res.data?.find((r: any) => r.ownerId === userId);
        if (!myRestaurant?.id) return alert("Tài khoản chưa có nhà hàng!");
        setRestaurantId(myRestaurant.id);
        dispatch(fetchDishes(myRestaurant.id));
      })
      .catch(() => alert("Không thể lấy thông tin nhà hàng"));
  }, [dispatch]);

  const handleOpenModal = (dish: Dish | null = null) => {
    if (dish) {
      setEditingDish(dish);
      setFormData({
        name: dish.name,
        price: dish.price.toString(),
        description: dish.description,
        category: dish.category,
        isActive: dish.isActive,
      });
    } else {
      setEditingDish(null);
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "ThucAn",
        isActive: true,
      });
      setFile(null);
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    const { token } = getUserFromLocalStorage();
    if (!token || !restaurantId) return;

    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => form.append(key, val));
    form.append("RestaurantId", restaurantId);
    if (file) form.append("file", file);
    else if (!editingDish) return alert("Vui lòng tải ảnh món ăn");

    try {
      if (editingDish) {
        await dispatch(updateDish({ id: editingDish.id, data: form })).unwrap();
        alert("Cập nhật món ăn thành công");
      } else {
        await dispatch(addDish(form)).unwrap();
        alert("Thêm món ăn thành công");
      }
      setOpen(false);
    } catch {
      alert("Thao tác thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá món ăn này?")) return;
    try {
      await dispatch(deleteDish(id)).unwrap();
      alert("Đã xoá món ăn");
    } catch {
      alert("Xoá món ăn thất bại");
    }
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchKeyword = dish.name
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || dish.category === selectedCategory;
    return matchKeyword && matchCategory;
  });

  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box className={styles.productPage}>
      <Card className={styles.card}>
        <CardContent>
          <Box className={styles.header}>
            <Typography variant="h6">Quản lý món ăn</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              className={styles.addBtn}
            >
              Thêm món
            </Button>
          </Box>

          <Box className={styles.filter}>
            <TextField
              label="Tìm kiếm món ăn"
              variant="outlined"
              size="small"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className={styles.searchInput}
            />
            <TextField
              label="Danh mục"
              select
              size="small"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
            >
              <MenuItem value="All">Tất cả</MenuItem>
              <MenuItem value="ThucAn">Thức ăn</MenuItem>
              <MenuItem value="NuocUong">Nước uống</MenuItem>
              <MenuItem value="ThucAnThem">Thức ăn thêm</MenuItem>
            </TextField>
          </Box>

          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <TableContainer component={Paper} className={styles.table}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên món</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Danh mục</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Hình ảnh</TableCell>
                      <TableCell>Giảm giá</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedDishes.map((dish) => (
                      <TableRow key={dish.id}>
                        <TableCell>{dish.name}</TableCell>
                        <TableCell>
                          {discounts[dish.id] ? (
                            <>
                              <Typography
                                variant="body2"
                                className={styles.oldPrice}
                              >
                                {parseInt(
                                  dish.price.toString()
                                ).toLocaleString()}
                                đ
                              </Typography>
                              <Typography className={styles.discountedPrice}>
                                {(
                                  parseInt(dish.price.toString()) *
                                  (1 - discounts[dish.id] / 100)
                                ).toLocaleString()}
                                đ
                              </Typography>
                              <Typography className={styles.discountLabel}>
                                -{discounts[dish.id]}%
                              </Typography>
                            </>
                          ) : (
                            <Typography>
                              {parseInt(dish.price.toString()).toLocaleString()}
                              đ
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{dish.category}</TableCell>
                        <TableCell>
                          <Typography
                            className={
                              dish.isActive
                                ? styles.statusActive
                                : styles.statusInactive
                            }
                          >
                            {dish.isActive ? "Đang bán" : "Ngưng"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {dish.imageUrl ? (
                            <img
                              src={dish.imageUrl}
                              alt="dish"
                              className={styles.dishImage}
                            />
                          ) : (
                            <Typography>Không có ảnh</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {openDiscountInput === dish.id ? (
                            <Box className={styles.voucherBox}>
                              <TextField
                                size="small"
                                type="number"
                                label="% giảm"
                                value={discountInputValue}
                                onChange={(e) =>
                                  setDiscountInputValue(e.target.value)
                                }
                                InputProps={{
                                  inputProps: { min: 0, max: 100 },
                                }}
                                className={styles.voucherInput}
                              />
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  const value = parseFloat(discountInputValue);
                                  if (
                                    isNaN(value) ||
                                    value < 0 ||
                                    value > 100
                                  ) {
                                    alert("Vui lòng nhập giá trị từ 0 đến 100");
                                    return;
                                  }
                                  setDiscounts({
                                    ...discounts,
                                    [dish.id]: value,
                                  });
                                  setOpenDiscountInput(null);
                                  setDiscountInputValue("");
                                }}
                              >
                                Áp dụng
                              </Button>
                            </Box>
                          ) : discounts[dish.id] ? (
                            <Button
                              variant="text"
                              size="small"
                              color="error"
                              onClick={() => {
                                const newDiscounts = { ...discounts };
                                delete newDiscounts[dish.id];
                                setDiscounts(newDiscounts);
                              }}
                            >
                              Hủy voucher
                            </Button>
                          ) : (
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => setOpenDiscountInput(dish.id)}
                            >
                              Thêm voucher
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenModal(dish)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(dish.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingDish ? "Sửa món ăn" : "Thêm món ăn"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên món"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="number"
                fullWidth
                label="Giá"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
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
                select
                fullWidth
                label="Danh mục"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <MenuItem value="ThucAn">Thức ăn</MenuItem>
                <MenuItem value="NuocUong">Nước uống</MenuItem>
                <MenuItem value="ThucAnThem">Thức ăn thêm</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Typography mr={1}>Kinh doanh</Typography>
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                {file ? file.name : "Chọn ảnh"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) setFile(selectedFile);
                  }}
                />
              </Button>
              {editingDish && !file && editingDish.imageUrl && (
                <Box mt={1}>
                  <Typography variant="body2">Ảnh hiện tại:</Typography>
                  <img
                    src={editingDish.imageUrl}
                    alt="current"
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingDish ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductPage;
