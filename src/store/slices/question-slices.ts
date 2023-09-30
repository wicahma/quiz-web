"use client";
import { IQuestState } from "@/src/interfaces/intf-store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IQuestState = {
  prevUrl: localStorage.getItem("prevUrl") || "",
  question: JSON.parse(localStorage.getItem("question") || "[]"),
  game: JSON.parse(
    localStorage.getItem("game") || '{"qTrueAnswer": 0,"qIndex": 0,"qTotal": 0}'
  ),
  qTime: localStorage.getItem("qTime") || null,
};

export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setPrevUrl: (state, action: PayloadAction<IQuestState["prevUrl"]>) => {
      localStorage.setItem("prevUrl", action.payload.toString());
      state.prevUrl = action.payload;
    },
    setQuestion: (state, action: PayloadAction<IQuestState["question"]>) => {
      localStorage.setItem("question", JSON.stringify(action.payload));
      state.question = action.payload;
    },
    setGame: (state, action: PayloadAction<IQuestState["game"]>) => {
      localStorage.setItem("game", JSON.stringify(action.payload));
      state.game = action.payload;
    },
    setTime: (state, action: PayloadAction<string | null>) => {
      action.payload && localStorage.setItem("qTime", action.payload);
      state.qTime = action.payload;
    },
    setResetGame: (state) => {
      localStorage.removeItem("qAmount");
      localStorage.removeItem("qTime");
      localStorage.removeItem("qCategory");
      localStorage.removeItem("qDifficulty");
      localStorage.removeItem("qType");
      localStorage.removeItem("question");
      localStorage.removeItem("game");
      state.qTime = null;
      state.question = [];
    },
  },
});

export const { setGame, setQuestion, setTime, setResetGame, setPrevUrl } =
  questionSlice.actions;

export const questionReducer = questionSlice.reducer;
