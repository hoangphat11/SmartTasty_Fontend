import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axiosInstance";
import { Promotion, PromotionForm } from "@/types/promotion";

interface PromotionState {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
}

const initialState: PromotionState = {
  promotions: [],
  loading: false,
  error: null,
};

export const fetchPromotions = createAsyncThunk(
  "promotions/fetch",
  async () => {
    const res = await axiosInstance.get("/promotion");
    return res.data as Promotion[];
  }
);

export const createPromotion = createAsyncThunk(
  "promotions/create",
  async (data: PromotionForm) => {
    const res = await axiosInstance.post("/promotion", data);
    return res.data as Promotion;
  }
);

const promotionSlice = createSlice({
  name: "promotions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch promotions";
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.promotions.push(action.payload);
      });
  },
});

export default promotionSlice.reducer;
