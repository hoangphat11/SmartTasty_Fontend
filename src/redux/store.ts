import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSide";
import dishReducer from "./slices/dishSide";

export const store = configureStore({
  reducer: {
    user: userReducer,
    dish: dishReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
