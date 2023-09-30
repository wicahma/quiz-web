"use client";
import Fetcher from "@/src/api";
import { ICustomGame } from "@/src/interfaces/intf-question";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { setLoading, setPeringatan } from "@/src/store/slices/main-slices";
import {
  setGame,
  setPrevUrl,
  setQuestion,
  setResetGame,
} from "@/src/store/slices/question-slices";
import {
  Button,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  Option,
  Popover,
  PopoverContent,
  PopoverHandler,
  Select,
  Tooltip,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const route = useRouter();
  const isValid = useAppSelector((state) => state.auth.isAuth);
  const [menuPopup, setMenuPopup] = useState(false);
  const dispatch = useAppDispatch();
  const {
    game: { qTotal, qIndex },
    qTime,
  } = useAppSelector((state) => state.question);
  const [categories, setCategories] = useState<Array<any>>([]);
  const [amount, setAmount] = useState<number>(10);
  const [category, setCategory] = useState<number>();
  const [difficulty, setDifficulty] = useState<string>("");
  const [type, setType] = useState<string>("");

  useEffect(() => {
    if (!isValid) {
      route.replace("/login");
    }
    getCategories();
  }, [isValid, route]);

  const getCategories = async () => {
    try {
      const f = new Fetcher();
      await f.getData({
        url: "/api_category.php",
      });
      if (!f.isOK) {
        return dispatch(
          setPeringatan({
            show: true,
            message: "Terjadi kesalahan saat ingin memulai quiz",
            type: "error",
          })
        );
      }
      setCategories(f.data.trivia_categories);
    } catch (e) {
      console.log(e);
    }
  };

  const handleStartGame = async () => {
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

  const handleStartCustomGame = async ({
    amount,
    category,
    difficulty,
    type,
  }: ICustomGame) => {
    dispatch(setResetGame());
    dispatch(setLoading(true));
    try {
      let params = "";
      if (amount) params += `amount=${amount}&`;
      if (category) params += `category=${category}&`;
      if (difficulty) params += `difficulty=${difficulty}&`;
      if (type) params += `type=${type}`;
      const f = new Fetcher();
      await f.getData({
        url: "/api.php",
        params: params,
      });
      if (!f.isOK)
        return dispatch(
          setPeringatan({
            show: true,
            message: `Terjadi kesalahan saat ingin memulai quiz - {rc0d-${f.data.response_code}}`,
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
      dispatch(setPrevUrl(params));
      dispatch(setQuestion(f.data.results));
      route.push("/game");
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <main className="container flex flex-col items-center justify-center h-screen mx-auto">
      <Button
        color="red"
        onClick={() => {
          dispatch({ type: "user/logout", payload: false });
          route.replace("/login");
        }}
        className="m-3 flex items-center gap-3 px-4 py-2 self-end"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
        Keluar
      </Button>
      <div className="grow flex items-center justify-center flex-col">
        <header className="text-start mb-20">
          <h1 className="text-6xl font-bold bg-black text-white">Kuisis.</h1>
          <h3>Let&apos;s test how smart are you</h3>
        </header>
        <div className="text-center space-y-4">
          <div className="flex gap-3 justify-center">
            <Button type="button" variant="outlined" onClick={handleStartGame}>
              Start new game
            </Button>
            {!(
              qTime === undefined ||
              qTime === null ||
              "00:00".includes(qTime?.toString()) ||
              qIndex + 1 === qTotal
            ) && (
              <Tooltip
                content={`${qTime?.split(":")[0]} minute ${
                  qTime?.split(":")[1]
                } second left, ${qIndex} answered from ${qTotal}`}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => {
                    route.push("/game");
                  }}
                >
                  Resume
                </Button>
              </Tooltip>
            )}
          </div>
          <p className="text-xs font-bold">OR</p>
          <Popover open={menuPopup} handler={setMenuPopup}>
            <PopoverHandler>
              <Button variant="outlined">Customize your level</Button>
            </PopoverHandler>
            <PopoverContent className="overflow-visible space-y-3">
              <h3 className="text-2xl text-black font-semibold">
                Set your own Quiz
              </h3>
              <Input
                crossOrigin={""}
                label="Number of question"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    parseInt("".includes(e.target.value) ? "0" : e.target.value)
                  )
                }
              />
              <Select
                label="Category"
                onChange={(e) => setCategory(parseInt(e ?? "0"))}
                selected={() => {
                  if (category === 0) return "None";
                  return category
                    ? categories.find((c) => c.id === category)?.name
                    : null;
                }}
              >
                <Option value={"0"}>None</Option>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <Option key={index} value={category.id.toString()}>
                      {category.name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>Loading...</Option>
                )}
              </Select>
              <Select
                label="Difficulty"
                onChange={(e) => setDifficulty(e !== undefined ? e : "none")}
              >
                <Option>None</Option>
                <Option value="easy">Easy</Option>
                <Option value="medium">Medium</Option>
                <Option value="hard">Hard</Option>
              </Select>
              <Select
                label="Type"
                onChange={(e) => setType(e !== undefined ? e : "none")}
              >
                <Option>None</Option>
                <Option value="boolean">True / False</Option>
                <Option value="multiple">Multiple Choice</Option>
              </Select>
              <Button
                className="w-full"
                onClick={() =>
                  handleStartCustomGame({
                    amount,
                    category,
                    difficulty,
                    type,
                  })
                }
              >
                Start
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </main>
  );
}
