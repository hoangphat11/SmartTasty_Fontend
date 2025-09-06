import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Dish } from "@/types/dish";

const API_URL = "https://smarttasty-backend.onrender.com/api";
const CLOUDINARY_PREFIX = "https://res.cloudinary.com/djcur1ymq/image/upload/";

const getToken = (): string | null => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}")?.token || null;
  } catch (error) {
    return null;
  }
};

interface DishState {
  items: Dish[];
  loading: boolean;
  error: string | null;
}

const initialState: DishState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchDishes = createAsyncThunk<
  Dish[],
  string,
  { rejectValue: string }
>("dishes/fetch", async (restaurantId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/Dishes/restaurant/${restaurantId}`);
    return res.data?.data || [];
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Lỗi khi tải danh sách món ăn"
    );
  }
});

export const addDish = createAsyncThunk<
  Dish,
  FormData,
  { rejectValue: string }
>("dishes/add", async (data, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("Không tìm thấy token đăng nhập");

    const res = await axios.post(`${API_URL}/Dishes`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Nếu API trả về { data: {...} }
    const dish: Dish = res.data.data || res.data;

    // Bổ sung imageUrl nếu backend chỉ trả về image
    if (!dish.imageUrl && dish.image) {
      dish.imageUrl = `${CLOUDINARY_PREFIX}${dish.image}`;
    }

    return dish;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Lỗi khi thêm món ăn"
    );
  }
});


export const updateDish = createAsyncThunk<
  Dish,
  { id: string; data: FormData },
  { rejectValue: string }
>("dishes/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    // ✅ Lấy token trực tiếp từ localStorage
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("Không tìm thấy token đăng nhập");

    const res = await axios.put(`${API_URL}/Dishes/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // gửi token vào headers
        "Content-Type": "multipart/form-data",
      },
    });

    const updatedDish: Dish = res.data?.data || res.data;

    // ✅ Nếu backend chỉ trả về "image" thì tự ghép link Cloudinary
    if (!updatedDish.imageUrl && updatedDish.image) {
      updatedDish.imageUrl = `${CLOUDINARY_PREFIX}${updatedDish.image}`;
    }

    return updatedDish;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Lỗi khi cập nhật món ăn"
    );
  }
});

export const deleteDish = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("dishes/delete", async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("Không tìm thấy token đăng nhập");

    await axios.delete(`${API_URL}/Dishes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Lỗi khi xóa món ăn"
    );
  }
});

const dishSlice = createSlice({
  name: "dishes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchDishes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.items = action.payload.map((dish) => ({
          ...dish,
          imageUrl:
            dish.imageUrl ||
            (dish.image ? `${CLOUDINARY_PREFIX}${dish.image}` : ""),
        }));
        state.loading = false;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi tải món ăn";
      })

      // ADD
      .addCase(addDish.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addDish.rejected, (state, action) => {
        state.error = action.payload || "Lỗi khi thêm món ăn";
      })

      // UPDATE
      .addCase(updateDish.fulfilled, (state, action) => {
        const idx = state.items.findIndex((d) => d.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateDish.rejected, (state, action) => {
        state.error = action.payload || "Lỗi khi cập nhật món ăn";
      })

      // DELETE
      .addCase(deleteDish.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteDish.rejected, (state, action) => {
        state.error = action.payload || "Lỗi khi xóa món ăn";
      });
  },
});

export default dishSlice.reducer;
