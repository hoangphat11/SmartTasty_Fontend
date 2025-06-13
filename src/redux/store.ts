import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSide";
import emailReducer from "./slices/emailSlide"; // <== thêm dòng này

export const store = configureStore({
  reducer: {
    user: userReducer,
    email: emailReducer, // <== thêm dòng này
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
