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
import {
  fetchDishPromotionsByDishId,
  createDishPromotion,
  deleteDishPromotion,
} from "@/redux/slices/dishPromotionSlice";
import { Dish } from "@/types/dish";
import { DishPromotion } from "@/types/dishpromotion";
import styles from "./styles.module.scss";

const getUserFromLocalStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    return { user, token };
  } catch {
    return { user: {}, token: null };
  }
};

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { items: dishes, loading } = useAppSelector((state) => state.dishes);
  const { items: dishPromotions } = useAppSelector(
    (state) => state.dishpromotion
  );

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

  const [openDiscountInput, setOpenDiscountInput] = useState<number | null>(
    null
  );
  const [discountInputValue, setDiscountInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  // lấy restaurantId + load dishes
  useEffect(() => {
    const { token, user } = getUserFromLocalStorage();
    const userId = user?.userId;
    if (!token || !userId) return;

    fetch(`https://smarttasty-backend.onrender.com/api/Restaurant/owner`, {
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

  // load promotions cho từng dish sau khi có dishes
  useEffect(() => {
    dishes.forEach((dish) => {
      dispatch(fetchDishPromotionsByDishId(dish.id));
    });
  }, [dishes, dispatch]);

  const handleVoucherApply = async (dishId: number) => {
    const value = parseFloat(discountInputValue);
    if (isNaN(value) || value <= 0 || value > 100) {
      alert("Vui lòng nhập % giảm giá hợp lệ (1-100)");
      return;
    }
    try {
      // ⚠️ ở đây cần chọn promotionId thật (ví dụ từ dropdown).
      // Tạm demo với promotionId = 1
      await dispatch(createDishPromotion({ dishId, promotionId: 1 })).unwrap();
      dispatch(fetchDishPromotionsByDishId(dishId));
      setOpenDiscountInput(null);
      setDiscountInputValue("");
    } catch {
      alert("Thêm voucher thất bại");
    }
  };

  const handleVoucherRemove = async (dishId: number, promotionId: number) => {
    try {
      await dispatch(deleteDishPromotion({ dishId, promotionId })).unwrap();
      dispatch(fetchDishPromotionsByDishId(dishId));
    } catch {
      alert("Huỷ voucher thất bại");
    }
  };

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

  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);

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
                    {paginatedDishes.map((dish) => {
                      const promotionsForDish = dishPromotions.filter(
                        (dp: DishPromotion) => dp.dishId === dish.id
                      );
                      const activePromotion = promotionsForDish[0]?.promotion;

                      return (
                        <TableRow key={dish.id}>
                          <TableCell>{dish.name}</TableCell>
                          <TableCell>
                            {activePromotion ? (
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
                                    (1 - activePromotion.discountPercent / 100)
                                  ).toLocaleString()}
                                  đ
                                </Typography>
                                <Typography className={styles.discountLabel}>
                                  -{activePromotion.discountPercent}%
                                </Typography>
                              </>
                            ) : (
                              <Typography>
                                {parseInt(
                                  dish.price.toString()
                                ).toLocaleString()}
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
                                  onClick={() => handleVoucherApply(dish.id)}
                                >
                                  Áp dụng
                                </Button>
                              </Box>
                            ) : activePromotion ? (
                              <Button
                                variant="text"
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleVoucherRemove(
                                    dish.id,
                                    activePromotion.id
                                  )
                                }
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
                      );
                    })}
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
    </Box>
  );
};

export default ProductPage;
