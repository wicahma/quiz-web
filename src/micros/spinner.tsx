"use client";
import { Spinner } from "@material-tailwind/react";
import React from "react";
import { useAppSelector } from "../store";

const LoadingSpin = () => {
  const active = useAppSelector((state) => state.main.loading);
  return active ? (
    <div className="fixed z-[1000] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner className="w-10 h-10" color="gray" />
    </div>
  ) : null;
};

export default LoadingSpin;
