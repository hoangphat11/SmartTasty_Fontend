// @/redux/slices/dishSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDishes = createAsyncThunk(
  "dishes/fetchDishes",
  async (restaurantId: number, thunkAPI) => {
    try {
      const res = await axios.get(
        `https://smarttasty-backend.onrender.com/api/Dishes/restaurant/${restaurantId}`
      );
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi fetch dishes"
      );
    }
  }
);

export const createDish = createAsyncThunk(
  "dishes/createDish",
  async ({ values, restaurantId, token }: any, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("Name", values.name);
      formData.append("Price", values.price.toString());
      formData.append("Description", values.description || "");
      formData.append("Category", values.category);
      formData.append("IsActive", values.isActive ? "true" : "false");
      formData.append("RestaurantId", restaurantId.toString());

      const file = values.image?.file?.originFileObj;
      if (!file) throw new Error("Không có hình ảnh");

      formData.append("file", file);

      const res = await axios.post(
        "https://smarttasty-backend.onrender.com/api/Dishes",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi thêm món ăn"
      );
    }
  }
);

export const deleteDish = createAsyncThunk(
  "dishes/deleteDish",
  async ({ id, token }: { id: number; token: string }, thunkAPI) => {
    try {
      await axios.delete(
        `https://smarttasty-backend.onrender.com/api/Dishes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Xoá món ăn thất bại");
    }
  }
);

const dishSlice = createSlice({
  name: "dishes",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDishes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(createDish.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteDish.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item: any) => item.id !== action.payload
        );
      });
  },
});

export default dishSlice.reducer;
