import React from "react";
import styles from "./styles.module.scss";
import type { IAnswer } from "../../assets/parseMoodleText";

interface IProps {
  answers: IAnswer[];
}

const AnswersList: React.FC<IProps> = ({ answers }) => {
  return (
    <div className={styles.root}>
      {answers.map((e, i) => (
        <div key={e.number + "_" + i}>
          <h4>{e.question}</h4>
          <ul>
            {e.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
          <div className={styles.correct}>
            Правильный ответ: {e.correctAnswer}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnswersList;
