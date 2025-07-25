import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axiosInstance";
import { RestaurantForm } from "@/types/restaurant";

interface Restaurant {
  id: number;
  name: string;
  category: string;
  address: string;
  description: string;
  openTime: string;
  closeTime: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

interface RestaurantState {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  loading: false,
  error: null,
};

// CREATE
export const createRestaurant = createAsyncThunk<
  any,
  RestaurantForm,
  { rejectValue: string }
>("restaurant/create", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("address", data.address);
    formData.append("latitude", data.latitude.toString());
    formData.append("longitude", data.longitude.toString());
    formData.append("description", data.description);
    formData.append("openTime", data.openTime);
    formData.append("closeTime", data.closeTime);
    formData.append("ImageFile", data.file);

    const res = await axiosInstance.post("/api/Restaurant", formData);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Lỗi không xác định");
  }
});

// READ ALL
export const fetchRestaurants = createAsyncThunk<
  Restaurant[],
  void,
  { rejectValue: string }
>("restaurant/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/api/Restaurant");
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Lỗi không xác định");
  }
});

// UPDATE
export const updateRestaurant = createAsyncThunk<
  any,
  { id: number; data: RestaurantForm },
  { rejectValue: string }
>("restaurant/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("address", data.address);
    formData.append("latitude", data.latitude.toString());
    formData.append("longitude", data.longitude.toString());
    formData.append("description", data.description);
    formData.append("openTime", data.openTime);
    formData.append("closeTime", data.closeTime);
    formData.append("ImageFile", data.file);

    const res = await axiosInstance.put(`/api/Restaurant/${id}`, formData);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Lỗi không xác định");
  }
});

// DELETE
export const deleteRestaurant = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("restaurant/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/api/Restaurant/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Lỗi không xác định");
  }
});

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRestaurant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(
        createRestaurant.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Lỗi không xác định";
        }
      )

      // READ ALL
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRestaurants.fulfilled,
        (state, action: PayloadAction<Restaurant[]>) => {
          state.loading = false;
          state.restaurants = action.payload;
        }
      )
      .addCase(
        fetchRestaurants.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Lỗi không xác định";
        }
      )

      // UPDATE
      .addCase(updateRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRestaurant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(
        updateRestaurant.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Lỗi không xác định";
        }
      )

      // DELETE
      .addCase(deleteRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteRestaurant.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.restaurants = state.restaurants.filter(
            (r) => r.id !== action.payload
          );
        }
      )
      .addCase(
        deleteRestaurant.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Lỗi không xác định";
        }
      );
  },
});

export default restaurantSlice.reducer;
