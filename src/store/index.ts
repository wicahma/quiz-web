import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { authReducer } from "./slices/auth-slices";
import logger from "redux-logger";
import { questionReducer } from "./slices/question-slices";
import { mainReducer } from "./slices/main-slices";
import { IQuestState } from "../interfaces/intf-store";

const combinedReducer = combineReducers({
  main: mainReducer,
  auth: authReducer,
  question: questionReducer,
});

const rootReducer = (state: IQuestState | any, action: any) => {
  switch (action.type) {
    case "user/logout":
      localStorage.clear();
      sessionStorage.clear();
      state = undefined;
      break;
    default:
      break;
  }

  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: false,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({ serializableCheck: false }).concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
