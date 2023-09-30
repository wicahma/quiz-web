"use client";
import Fetcher from "@/src/api";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { setLoading, setPeringatan } from "@/src/store/slices/main-slices";
import {
  setGame,
  setPrevUrl,
  setQuestion,
  setResetGame,
} from "@/src/store/slices/question-slices";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Result = () => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const {
    game: { qTrueAnswer, qTotal, qIndex },
    qTime,
  } = useAppSelector((state) => state.question);

  useEffect(() => {
    if (
      qTime === undefined ||
      qTime === null ||
      "00:00".includes(qTime?.toString()) ||
      qIndex + 1 >= qTotal
    ) {
      dispatch(setResetGame());
    } else {
      route.replace("/game");
    }
  }, [dispatch]);

  const handleTryAgain = async () => {
    dispatch(setResetGame());
    dispatch(setLoading(true));
    try {
      const f = new Fetcher();
      await f.getData({
        url: "/api.php",
        params: "amount=10",
      });
      if (!f.isOK)
        return dispatch(
          setPeringatan({
            show: true,
            message: "Terjadi kesalahan saat ingin memulai quiz",
            type: "error",
          })
        );
      dispatch(
        setGame({
          qTrueAnswer: 0,
          qIndex: 0,
          qTotal: f.data.results.length,
        })
      );
      dispatch(setPrevUrl("amount=10"));
      dispatch(setQuestion(f.data.results));
      route.push("/game");
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container mx-auto h-screen flex items-center justify-center">
      <div>
        <h2 className="text-5xl font-bold">Well Done.</h2>
        <p className="text-xl">
          You have {qTrueAnswer} true answer, from {qTotal} question.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={handleTryAgain}
            className="mt-10 flex items-center gap-3 px-3 py-1"
          >
            Try Again
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 aspect-square"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </Button>
          <Button
            onClick={() => {
              route.replace("/");
              dispatch(setPrevUrl(""));
            }}
            className="mt-10 flex items-center gap-3 px-3 py-1"
          >
            Home
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 aspect-square"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;
