"use client";
import { Alert } from "@material-tailwind/react";
import { colors } from "@material-tailwind/react/types/generic";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setPeringatan } from "../store/slices/main-slices";

const Peringatan = () => {
  const [color, setColor] = React.useState<colors>();
  const dispatch = useAppDispatch();
  const peringatan = useAppSelector((state) => state.main.peringatan);

  useEffect(() => {
    switch (peringatan.type) {
      case "error":
        setColor("red");
        break;
      case "success":
        setColor("green");
        break;
      case "warning":
        setColor("yellow");
        break;
      case "info":
        setColor("blue");
        break;
      default:
        setColor("blue");
        break;
    }
  }, [peringatan.type]);

  useEffect(() => {
    console.log("ini di child");
    if (peringatan.show) {
      setTimeout(() => {
        dispatch(
          setPeringatan({
            show: false,
            message: "",
            type: "info",
          })
        );
      }, 1500);
    }
  }, [peringatan.show, dispatch]);

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2">
      <Alert
        open={peringatan.show}
        onClose={() =>
          dispatch(
            setPeringatan({
              show: false,
              message: "",
              type: "info",
            })
          )
        }
        animate={{
          mount: { y: 0 },
          unmount: { y: -100 },
        }}
        color={color}
      >
        {peringatan.message}
      </Alert>
    </div>
  );
};

export default Peringatan;
