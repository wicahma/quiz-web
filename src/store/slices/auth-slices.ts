"use client";
import { IAuthState } from "@/src/interfaces/intf-store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: IAuthState = {
  isAuth: localStorage.getItem("isAuth") ? true : false,
  userData: JSON.parse(localStorage.getItem("userData") || "{}"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      localStorage.setItem("isAuth", JSON.stringify(action.payload));
      state.isAuth = action.payload;
    },
    setUserData: (state, action: PayloadAction<IAuthState["userData"]>) => {
      localStorage.setItem("userData", JSON.stringify(action.payload));
      state.userData = action.payload;
    },
  },
});

export const { setAuth, setUserData } = authSlice.actions;

export const authReducer = authSlice.reducer;
