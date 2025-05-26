import { create } from "zustand";
import type { IQuestion } from "../assets/parseMoodleText";
import { ERRORS_STORAGE_KEY, STORAGE_KEY } from "../assets/saveAnswers";

interface ITestStore {
  questions: IQuestion[];
  errorQuestions: string[];
}

interface ITestActions {
  initQuestions: () => void;
  getTestQuestions: (length?: number) => IQuestion[];
  getErrorTestQuestions: () => IQuestion[];
  updateQuestions: (newQuestions: IQuestion[]) => void;
  updateErrorQuestions: (newQuestions: IQuestion[]) => void;
}

type IUseTestStore = ITestStore & ITestActions;

export const useTestStore = create<IUseTestStore>((set, get) => ({
  questions: [],
  errorQuestions: [],
  initQuestions() {
    const allQuestions: IQuestion[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]"
    );
    const errors: string[] = JSON.parse(
      localStorage.getItem(ERRORS_STORAGE_KEY) ?? "[]"
    );

    set({ questions: allQuestions, errorQuestions: errors });
  },
  getTestQuestions(length) {
    const { questions } = get();
    if (!length) return questions;

    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    return shuffledQuestions.slice(0, length);
  },
  getErrorTestQuestions() {
    const { errorQuestions, questions } = get();

    return questions.filter((e) => errorQuestions.includes(e.question));
  },
  updateQuestions(newQuestions) {
    set({ questions: newQuestions });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newQuestions));
  },
  updateErrorQuestions(newQuestions) {
    localStorage.setItem(ERRORS_STORAGE_KEY, JSON.stringify(newQuestions));
  },
}));
