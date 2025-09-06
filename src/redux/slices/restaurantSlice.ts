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
  ownerId: number;
  distanceKm?: number; // 👈 thêm để hiển thị khoảng cách
}

interface RestaurantState {
  restaurants: Restaurant[];
  current: Restaurant | null;
  nearby: Restaurant[]; // 👈 danh sách gần nhất
  loading: boolean;
  loadingNearby: boolean; // 👈 spinner cho nearby
  error: string | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  current: null,
  nearby: [],
  loading: false,
  loadingNearby: false,
  error: null,
};

// ➕ FETCH BY OWNER
export const fetchRestaurantByOwner = createAsyncThunk<
  Restaurant | null,
  { token: string },
  { rejectValue: string }
>("restaurant/fetchByOwner", async ({ token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/api/Restaurant/owner", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const apiData = response.data?.data;
    const restaurant =
      Array.isArray(apiData) && apiData.length > 0 ? apiData[0] : null;

    return restaurant;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Lỗi không xác định");
  }
});

// CREATE
export const createRestaurant = createAsyncThunk<
  Restaurant | null,
  { token: string; data: RestaurantForm },
  { rejectValue: string }
>("restaurant/create", async ({ token, data }, { rejectWithValue }) => {
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
    if (data.file) {
      formData.append("ImageFile", data.file);
    }

    const res = await axiosInstance.post("/api/Restaurant", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data?.data ?? null;
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
    return res.data?.data?.items ?? [];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Lỗi không xác định");
  }
});

// ➕ FETCH NEARBY
export const fetchNearbyRestaurants = createAsyncThunk<
  Restaurant[],
  { lat: number; lng: number },
  { rejectValue: string }
>("restaurant/fetchNearby", async ({ lat, lng }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(
      `/api/Restaurant/nearby?lat=${lat}&lng=${lng}`
    );
    return res.data?.data ?? [];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.errMessage || "Không lấy được nhà hàng gần bạn"
    );
  }
});
// FETCH BY ID
export const fetchRestaurantById = createAsyncThunk<
  Restaurant | null,
  number,
  { rejectValue: string }
>("restaurant/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/Restaurant/${id}`);
    return response.data?.data ?? null;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Không tìm thấy nhà hàng"
    );
  }
});

// UPDATE
export const updateRestaurant = createAsyncThunk<
  Restaurant | null,
  { token: string; id: number; data: RestaurantForm },
  { rejectValue: string }
>("restaurant/update", async ({ token, id, data }, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    // bắt buộc
    formData.append("id", id.toString());
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("address", data.address);
    formData.append("latitude", data.latitude.toString());
    formData.append("longitude", data.longitude.toString());
    formData.append("description", data.description);
    formData.append("openTime", data.openTime);
    formData.append("closeTime", data.closeTime);
    formData.append("isHidden", "false");

    // chỉ append file nếu có
    if (data.file instanceof File) {
      formData.append("ImageFile", data.file);
    }

    const response = await axiosInstance.put(`/api/Restaurant`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data?.data ?? null;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.errMessage || "Cập nhật thất bại"
    );
  }
});

// DELETE
export const deleteRestaurant = createAsyncThunk<
  number,
  { token: string; id: number },
  { rejectValue: string }
>("restaurant/delete", async ({ token, id }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/api/Restaurant/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Lỗi không xác định");
  }
});

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    clearCurrentRestaurant(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH BY OWNER
      .addCase(fetchRestaurantByOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRestaurantByOwner.fulfilled,
        (state, action: PayloadAction<Restaurant | null>) => {
          state.loading = false;
          state.current = action.payload;
        }
      )
      .addCase(
        fetchRestaurantByOwner.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Lỗi không xác định";
          state.current = null;
        }
      )

      // CREATE
      .addCase(createRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createRestaurant.fulfilled,
        (state, action: PayloadAction<Restaurant | null>) => {
          state.loading = false;
          if (action.payload) {
            state.restaurants.push(action.payload);
            state.current = action.payload;
          }
        }
      )
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

      // ➕ NEARBY
      .addCase(fetchNearbyRestaurants.pending, (state) => {
        state.loadingNearby = true;
        state.error = null;
      })
      .addCase(
        fetchNearbyRestaurants.fulfilled,
        (state, action: PayloadAction<Restaurant[]>) => {
          state.loadingNearby = false;
          state.nearby = action.payload;
        }
      )
      .addCase(
        fetchNearbyRestaurants.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loadingNearby = false;
          state.error = action.payload || "Không lấy được nhà hàng gần bạn";
        }
      )
      // FETCH BY ID
      .addCase(fetchRestaurantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRestaurantById.fulfilled,
        (state, action: PayloadAction<Restaurant | null>) => {
          state.loading = false;
          state.current = action.payload;
        }
      )
      .addCase(
        fetchRestaurantById.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Lỗi không xác định";
          state.current = null;
        }
      )
      // UPDATE
      .addCase(updateRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateRestaurant.fulfilled,
        (state, action: PayloadAction<Restaurant | null>) => {
          state.loading = false;
          if (action.payload) {
            state.current = action.payload;
            const index = state.restaurants.findIndex(
              (r) => r.id === action.payload!.id
            );
            if (index !== -1) {
              state.restaurants[index] = action.payload;
            }
          }
        }
      )
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
          if (state.current?.id === action.payload) {
            state.current = null;
          }
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

export const { clearCurrentRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
