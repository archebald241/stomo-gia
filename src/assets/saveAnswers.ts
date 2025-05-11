import type { IForm } from "../pages/Tests/SolveTests/SolveTests";
import type { IQuestion } from "./parseMoodleText";

export const STORAGE_KEY = "saved_answers";
export const ERRORS_STORAGE_KEY = "errors_questions";

export const loadAnswersFromFile = (file: File): Promise<IQuestion[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const answers = JSON.parse(content) as IQuestion[];
        resolve(answers);
      } catch {
        reject(new Error("Failed to parse JSON file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

export const onSaveAnswers = (
  answers: IQuestion[],
  saveAsFile: boolean = true
) => {
  try {
    const existingAnswersJson = localStorage.getItem(STORAGE_KEY);
    const existingAnswers: IQuestion[] = existingAnswersJson
      ? JSON.parse(existingAnswersJson)
      : [];

    const existingQuestionsMap = new Map(
      existingAnswers.map((answer) => [answer.question, answer])
    );

    answers.forEach((newAnswer) => {
      if (
        existingQuestionsMap.get(newAnswer.question) &&
        !newAnswer.correctAnswer.length
      ) {
        return;
      }

      existingQuestionsMap.set(newAnswer.question, newAnswer);
    });

    const mergedAnswers = Array.from(existingQuestionsMap.values());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedAnswers));

    if (saveAsFile) {
      const jsonString = JSON.stringify(mergedAnswers, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "answers.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return mergedAnswers;
  } catch (error) {
    console.error("Error saving answers:", error);
    throw error;
  }
};

export const saveErrorsQuestions = (formQuestions: IForm["questions"]) => {
  const getQuestions = (formQuestions: any[], isCorrect: boolean) =>
    formQuestions
      .filter((e) => (e.answer === e.current) === isCorrect)
      .map((e) => e.question);

  const questions = getQuestions(formQuestions, false);
  const corrects = getQuestions(formQuestions, true);

  const savedErrors: string[] = JSON.parse(
    localStorage.getItem(ERRORS_STORAGE_KEY) ?? "[]"
  );

  const uniqueErrors = savedErrors.filter((q) => !corrects.includes(q));
  const result = [...new Set([...uniqueErrors, ...questions])];

  localStorage.setItem(ERRORS_STORAGE_KEY, JSON.stringify(result));
};
