import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Tabs } from "antd";
import SolveTests from "./SolveTests";
import type { IQuestion } from "../../assets/parseMoodleText";
import { ERRORS_STORAGE_KEY, STORAGE_KEY } from "../../assets/saveAnswers";

type TActiveKey = "1" | "2" | "3";

const getTestQuestions = (length?: number) => {
  const allQuestions: IQuestion[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) ?? "[]"
  );
  if (!length) return allQuestions;
  const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
  return shuffledQuestions.slice(0, length);
};

const Tests: React.FC = () => {
  const [active, setActive] = useState<TActiveKey>("1");
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  useEffect(() => {
    switch (active) {
      case "1":
        setQuestions(getTestQuestions(100));
        break;
      case "2":
        setQuestions(getTestQuestions());
        break;
      case "3":
        const allQuestions: IQuestion[] = JSON.parse(
          localStorage.getItem(STORAGE_KEY) ?? "[]"
        );
        const errors: string[] = JSON.parse(
          localStorage.getItem(ERRORS_STORAGE_KEY) ?? "[]"
        );
        setQuestions(allQuestions.filter((e) => errors.includes(e.question)));
    }
  }, [active]);

  return (
    <div className={styles.root}>
      <Tabs
        className={styles.root}
        activeKey={active}
        onChange={(key) => setActive(key as TActiveKey)}
        destroyOnHidden
        items={[
          {
            label: "Просто тест",
            key: "1",
            children: <SolveTests questions={questions} />,
          },
          {
            label: "Решаем все",
            key: "2",
            children: <SolveTests questions={questions} />,
          },
          {
            label: "Решаем неправильные",
            key: "3",
            children: <SolveTests questions={questions} />,
            // disabled: true,
          },
        ]}
      />
    </div>
  );
};

export default Tests;
