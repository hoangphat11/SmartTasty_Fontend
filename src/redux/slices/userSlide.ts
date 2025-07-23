import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

const initialState: User = {
  _id: '',
  userName: '',
  email: '',
  phone: '',
  role: '',
  address: '',
  createdAt: '',
  updatedAt: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload; // ghi đè toàn bộ state bằng user mới
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, setUserName, clearUser } = userSlice.actions;
export default userSlice.reducer;
