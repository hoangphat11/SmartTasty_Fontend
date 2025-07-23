import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axiosInstance";
import { message } from "antd";

export const createRestaurant = createAsyncThunk(
  "restaurant/create",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/Restaurant", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi không xác định");
    }
  }
);

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: { loading: false, error: null, list: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRestaurant.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
        message.error("Tạo nhà hàng thất bại");
      });
  },
});

export default restaurantSlice.reducer;
