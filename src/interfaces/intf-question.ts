export interface IQuestionComp {
  selectedAnswer: Function;
  question: string | null;
  answer: Array<String>;
  category: String | null;
  index: number;
  result: IQuestionResult;
}

export interface IQuestionResult {
  selectedAnswer: String;
  trueAnswer: String;
}

export interface IShowAnswer {
  result: IQuestionResult;
  thisAnswer: String;
  userAnswer: String;
  type: String;
}

export interface ICustomGame {
  amount: number | undefined;
  category: number | undefined;
  difficulty: String | undefined;
  type: String | undefined;
}
