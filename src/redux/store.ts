import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/useThemeSlice";
import userReducer from "./slices/userSlice";
import dishReducer from "./slices/dishSlide";
import restaurantReducer from "./slices/restaurantSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    dishes: dishReducer,  
    restaurant: restaurantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
