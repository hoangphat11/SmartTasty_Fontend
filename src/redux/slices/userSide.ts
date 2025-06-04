import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const initialState: User = {
  _id: '',
  userName: '',
  email: '',
  phone: '',
  address: '',
  role: '',
  createdAt: '',
  updatedAt: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
   setUser: (state, action) => {
  state.userName = action.payload.userName;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, setUserName, clearUser } = userSlice.actions;
export default userSlice.reducer;
