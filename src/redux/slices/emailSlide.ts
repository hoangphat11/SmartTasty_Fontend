// store/slices/emailSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/axios/axiosInstance";

export const checkEmailExists = createAsyncThunk(
  "email/checkEmailExists",
  async (email: string) => {
    const res = await axiosInstance.get(`/api/User/?email=${email}`);
    return res.data.errCode === 1; // true nếu email đã tồn tại
  }
);

const emailSlice = createSlice({
  name: "email",
  initialState: {
    exists: false,
    loading: false,
    error: null,
  },
  reducers: {
    resetEmailState: (state) => {
      state.exists = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkEmailExists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkEmailExists.fulfilled, (state, action) => {
        state.loading = false;
        state.exists = action.payload;
      })
      .addCase(checkEmailExists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi kiểm tra email";
      });
  },
});

export const { resetEmailState } = emailSlice.actions;
export default emailSlice.reducer;
