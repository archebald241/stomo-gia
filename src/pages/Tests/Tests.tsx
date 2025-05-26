import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Tabs } from "antd";
import SolveTests from "./SolveTests";
import type { IQuestion } from "../../assets/parseMoodleText";
import { useTestStore } from "../../store/useTestStore";

type TActiveKey = "1" | "2" | "3";

const Tests: React.FC = () => {
  const [active, setActive] = useState<TActiveKey>("1");
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const { getTestQuestions, getErrorTestQuestions } = useTestStore();

  useEffect(() => {
    switch (active) {
      case "1":
        setQuestions(getTestQuestions(100));
        break;
      case "2":
        setQuestions(getTestQuestions());
        break;
      case "3":
        setQuestions(getErrorTestQuestions());
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
