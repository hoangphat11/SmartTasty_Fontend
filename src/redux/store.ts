import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/useThemeSlice";
import userReducer from "./slices/userSlide";
import dishReducer from "./slices/dishSlide";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    dish: dishReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
