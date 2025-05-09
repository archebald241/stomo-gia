import type { IAnswer } from "./parseMoodleText";

export const STORAGE_KEY = "saved_answers";

export const loadAnswersFromFile = (file: File): Promise<IAnswer[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const answers = JSON.parse(content) as IAnswer[];
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
  answers: IAnswer[],
  saveAsFile: boolean = true
) => {
  try {
    const existingAnswersJson = localStorage.getItem(STORAGE_KEY);
    const existingAnswers: IAnswer[] = existingAnswersJson
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
