"use client";
import QuestionContainer from "@/src/components/question-container";
import { IQuestionResult } from "@/src/interfaces/intf-question";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { setGame, setTime } from "@/src/store/slices/question-slices";
import {
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const Game = () => {
  const route = useRouter();
  const {
    question,
    game: { qTrueAnswer, qTotal, qIndex },
    qTime,
  } = useAppSelector((state) => state.question);
  const timerInit = 60 + qTotal * 30;
  const [counter, setCounter] = useState(timerInit);
  const [resultQuestion, setResultQuestion] = useState<IQuestionResult>({
    selectedAnswer: "",
    trueAnswer: "",
  });
  const dispatch = useAppDispatch();
  const isValid = useAppSelector((state) => state.auth.isAuth);
  const [exitDialog, setExitDialog] = useState<boolean>(false);

  useEffect(() => {
    if (!isValid) {
      route.replace("/login");
    }
    if (question.length <= 0) {
      route.replace("/");
    }
  }, [isValid, route]);

  useEffect(() => {
    if (qTime !== null && "00:00".includes(qTime.toString())) {
      route.push("/game/result");
    }
  }, [qTime, route, dispatch]);

  const shuffleAnswer = useMemo(() => {
    const answers = [
      question[qIndex]?.correct_answer,
      ...(question[qIndex]?.incorrect_answers ?? []),
    ];
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    return answers;
  }, [qIndex, question]);

  const checkAnswer = () => {
    let game: any = { qTrueAnswer, qTotal, qIndex };
    setResultQuestion((prev) => ({
      ...prev,
      trueAnswer: question[qIndex].correct_answer,
    }));
    var txt = document.createElement("textarea");
    txt.innerHTML = question[qIndex].correct_answer.toString();

    if (resultQuestion.selectedAnswer === txt.value) {
      game = { ...game, qTrueAnswer: qTrueAnswer + 1 };
    }

    setTimeout(() => {
      game = { ...game, qIndex: qIndex + 1 };
      if (qIndex + 1 >= qTotal) {
        return route.push("/game/result");
      }
      dispatch(setGame(game));

      setResultQuestion({
        trueAnswer: "",
        selectedAnswer: "",
      });
    }, 1500);
  };

  const startTimers = (e: number) => {
    const seconds = Math.floor(e % 60);
    const minutes = Math.floor((e / 60) % 60);

    if (e >= 0) {
      setCounter(e);
      dispatch(
        setTime(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        )
      );
    }
  };

  const clearTimers = () => {
    let time = counter;
    const historyTimer = localStorage.getItem("qTime");
    if (
      historyTimer === null ||
      historyTimer === undefined ||
      historyTimer === "00:00"
    ) {
      time = timerInit;
    } else {
      const timeComponents = historyTimer.split(":");
      const minutes = parseInt(timeComponents[0]);
      const seconds = parseInt(timeComponents[1]);
      const totalTimeInSeconds = minutes * 60 + seconds;
      time = totalTimeInSeconds;
    }
    startTimers(time - 1);
  };

  useEffect(() => {
    const timer =
      "/game" === window.location.pathname &&
      counter > 0 &&
      setTimeout(() => clearTimers(), 1000);
    return () => clearTimeout(timer as NodeJS.Timeout);
  }, [counter]);

  return (
    <div className="container mx-auto h-screen flex flex-col px-3">
      <div className="w-full flex justify-center gap-3 mt-5 text-base font-medium text-white uppercase">
        <div className="bg-gray-700 p-2 flex gap-3 items-center rounded-2xl">
          <p className="bg-blue-500 px-5 py-1 ml-1 rounded-md text-white">
            {question[qIndex]?.difficulty ?? "None"}
          </p>
          <p className="bg-blue-500 px-5 py-1 rounded-md text-white">{qTime}</p>
          <Popover handler={setExitDialog} open={exitDialog}>
            <PopoverHandler>
              <IconButton onClick={() => route.push("/")}>
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
              </IconButton>
            </PopoverHandler>
            <PopoverContent className="w-[200px] space-y-2">
              <h2 className="font-bold text-2xl">Keluar</h2>
              <p>Apakah kamu yakin ingin keluar dari permainan?</p>
              <div className="flex gap-2 justify-between">
                <Button
                  variant="text"
                  color="red"
                  onClick={() => {
                    setExitDialog(false);
                    route.push("/");
                  }}
                >
                  Ya
                </Button>
                <Button
                  variant="filled"
                  color="green"
                  onClick={() => setExitDialog(false)}
                >
                  Tidak
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grow mx-auto flex flex-col justify-center">
        {question.length > 0 && (
          <QuestionContainer
            index={qIndex + 1}
            answer={shuffleAnswer ?? [""]}
            question={question[qIndex].question}
            category={question[qIndex].category}
            selectedAnswer={(e: String) =>
              setResultQuestion((prev) => ({ ...prev, selectedAnswer: e }))
            }
            result={resultQuestion}
          />
        )}
        <div className="mt-5 flex w-full justify-end">
          <Button
            onClick={checkAnswer}
            disabled={
              resultQuestion.selectedAnswer === "" ||
              resultQuestion.trueAnswer !== ""
            }
            color="orange"
          >
            {qIndex + 1 === qTotal ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Game;
