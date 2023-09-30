export interface IAuthState {
  isAuth: boolean;
  userData: {
    username?: String;
    password?: String;
  };
}

export interface IMainState {
  peringatan: {
    show: boolean;
    message: String;
    type: "success" | "error" | "warning" | "info";
  };
  loading: boolean;
}

export interface IQuestState {
  prevUrl: String;
  qTime: String | null;
  question: Array<{
    category: String | null;
    type: String | null;
    difficulty: String | null;
    question: string | null;
    correct_answer: String;
    incorrect_answers: Array<String>;
  }>;
  game: {
    qTrueAnswer: number;
    qIndex: number;
    qTotal: number;
  };
}
