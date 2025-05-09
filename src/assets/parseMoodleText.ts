export interface IAnswer {
  number: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export function parseMoodleText(rawText: string) {
  const lines = rawText.split("\n").map((line) => line.trim());
  const questions = [];

  let currentQuestion: IAnswer | null = null;
  let collectingOptions = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Поиск начала вопроса
    const questionMatch = line.match(/^Вопрос (\d+)/);
    if (questionMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        number: questionMatch[1],
        question: "",
        options: [],
        correctAnswer: "",
      };
      collectingOptions = false;
      continue;
    }

    if (currentQuestion) {
      if (line === "Текст вопроса") {
        currentQuestion.question = lines[i + 1] || "";
        collectingOptions = false;
        i++; // пропускаем строку с вопросом
        continue;
      }

      if (line.startsWith("Выберите один ответ:")) {
        collectingOptions = true;
        continue;
      }

      if (line.startsWith("Отзыв")) {
        collectingOptions = false;
        const correctLine = lines[i + 1] || "";
        const match = correctLine.match(/Правильный ответ: (.+)/);
        if (match) {
          currentQuestion.correctAnswer = match[1].trim();
        }
        i++; // пропустить строку с правильным ответом
        continue;
      }

      if (collectingOptions && line) {
        currentQuestion.options.push(line);
      }
    }
  }

  // Добавить последний вопрос
  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
}
