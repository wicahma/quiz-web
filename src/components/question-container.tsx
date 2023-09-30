import { Radio } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { IQuestionComp, IShowAnswer } from "../interfaces/intf-question";

const QuestionContainer = ({
  selectedAnswer,
  answer,
  question,
  category,
  index,
  result,
}: IQuestionComp) => {
  const [userAnswer, setUserAnswer] = useState<String>("");
  const questionDecoded = (question: string) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = question;
    return txt.value;
  };
  const answerDecoded = (answers: Array<String>) => {
    var txt = document.createElement("textarea");
    for (let i = 0; i < answers.length; i++) {
      txt.innerHTML = answers[i].toString();
      answers[i] = txt.value;
    }
    return answers;
  };
  useEffect(() => {
    const radios = document.getElementsByName("answer");
    for (let i = 0; i < radios.length; i++) {
      const element = radios[i] as HTMLInputElement;
      element.checked = false;
    }
  }, [answer]);

  const showAnswer = ({
    result,
    thisAnswer,
    userAnswer,
    type,
  }: IShowAnswer) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = result.trueAnswer.toString();

    if (txt.value === "") return "";
    switch (type) {
      case "color":
        if (thisAnswer === txt.value) return "border-green-500 text-green-500";
        if (thisAnswer === userAnswer && userAnswer !== txt.value)
          return "border-red-500 text-red-500";
      case "text":
        if (thisAnswer === txt.value) return "Correct";
        if (thisAnswer === userAnswer && userAnswer !== txt.value)
          return "Wrong";
    }
  };

  return (
    <div>
      <div className="relative">
        <h2 className="text-5xl font-extrabold">
          {index.toString().padStart(2, "0")}
        </h2>
        <p className="bg-blue-500 w-fit inline-block rounded-md px-3 py-0 text-base text-white">
          {category}
        </p>
      </div>
      <div className="mt-5">
        <fieldset className="border rounded-xl border-gray-700 text-base p-3">
          <legend className="text-3xl">
            {questionDecoded(question ?? "")}
          </legend>
          <div className="flex flex-col space-y-2">
            {answerDecoded(answer).map((a, index) => (
              <div
                key={index}
                className={`border-2 inline-block max-w-fit rounded-lg ${showAnswer(
                  { result, thisAnswer: a, userAnswer, type: "color" }
                )} flex items-center justify-between`}
              >
                <Radio
                  crossOrigin={""}
                  color="blue-gray"
                  defaultChecked={false}
                  onChange={() => {
                    setUserAnswer(a);
                    selectedAnswer(a);
                  }}
                  name="answer"
                  disabled={result.trueAnswer !== ""}
                  label={a.toString()}
                />
                <p className="mr-5">
                  {showAnswer({
                    result,
                    thisAnswer: a,
                    userAnswer,
                    type: "text",
                  })}
                </p>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default QuestionContainer;
