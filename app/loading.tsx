"use client";
import { Spinner } from "@material-tailwind/react";
import React from "react";

const loading = () => {
  return (
    <main className="h-screen w-screen">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner className="w-10 h-10" color="gray" />
      </div>
    </main>
  );
};

export default loading;
