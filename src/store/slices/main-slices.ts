"use client";
import { IMainState } from "@/src/interfaces/intf-store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IMainState = {
  peringatan: {
    show: false,
    message: "",
    type: "success",
  },
  loading: false,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setPeringatan: (state, action: PayloadAction<IMainState["peringatan"]>) => {
      state.peringatan = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading, setPeringatan } = mainSlice.actions;

export const mainReducer = mainSlice.reducer;
