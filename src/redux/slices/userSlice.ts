import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axiosInstance";
import { User } from "@/types/user";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Thunk: Đăng ký
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    data: Partial<User> & { userPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/api/User", {
        ...data,
        role: "user",
      });

      if (response.data.errCode === 0) {
        return response.data.user as User;
      } else {
        return rejectWithValue(response.data.errMessage || "Đăng ký thất bại");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errMessage || "Lỗi không xác định"
      );
    }
  }
);

// Thunk: Đăng nhập
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    data: { email: string; userPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/api/User/login", data);
      const { errMessage, data: resData } = response.data;

      if (errMessage === "OK" && resData?.user && resData?.token) {
        document.cookie = `token=${resData.token}; path=/; max-age=86400`;
        return resData.user as User;
      } else {
        return rejectWithValue("Email hoặc mật khẩu không chính xác!");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errMessage || "Lỗi đăng nhập"
      );
    }
  }
);

// ✅ Thunk: Sửa thông tin user
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data: Partial<User> & { userId: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/User/${data.userId}`,
        data
      );
      if (response.data.errCode === 0) {
        return response.data.user as User;
      } else {
        return rejectWithValue(response.data.errMessage || "Cập nhật thất bại");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errMessage || "Lỗi cập nhật"
      );
    }
  }
);

// ✅ Thunk: Xóa user
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/User/${userId}`);
      if (response.data.errCode === 0) {
        return userId;
      } else {
        return rejectWithValue(response.data.errMessage || "Xóa thất bại");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errMessage || "Lỗi xóa user"
      );
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      document.cookie = "token=; path=/; max-age=0";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user?.userId === action.payload) {
          state.user = null; // nếu user hiện tại bị xóa
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exports
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
