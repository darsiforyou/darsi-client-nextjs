import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./reducers/cartRedux";
import userReducer from "./reducers/userRedux";
import categoryReducer from "./reducers/categoryRedux";
import productReducer from "./reducers/productRedux";
import packagesReducer from "./reducers/packagesRedux";
import notificationReducer from "./reducers/notificationRedux";
import featuredProductReducer from "./reducers/featuredProductRedux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import popularProductRedux from "./reducers/popularProductRedux";
import searchProductRedux from "./reducers/searchProductRedux";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: [
    "searchProduct",
    "popularProduct",
    "product",
    "notification",
    "featuredProduct",
    "category",
  ],
};

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  category: categoryReducer,
  product: productReducer,
  package: packagesReducer,
  notification: notificationReducer,
  featuredProduct: featuredProductReducer,
  popularProduct: popularProductRedux,
  searchProduct: searchProductRedux,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
