import React, { useMemo } from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";
import { Form, Radio } from "antd";
import type { IQuestion } from "../../../assets/parseMoodleText";

const style: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

interface IProps {
  question: IQuestion;
  index: number;
  errors: number[];
  finished: boolean;
}

const QuestionItem = React.memo(
  ({ question, index, errors, finished }: IProps) => {
    const isError = errors.includes(index);
    const isSuccess = finished && !isError;

    // Memoize options to avoid unnecessary re-renders
    const radioOptions = useMemo(
      () => question.options.map((val) => ({ value: val, label: val })),
      [question.options]
    );

    return (
      <div
        className={classNames(styles.question, {
          [styles.error]: isError,
          [styles.success]: isSuccess,
        })}
      >
        <h3>
          {index + 1}. {question.question}
        </h3>
        <div>
          <Form.Item
            name={[index, "answer"]}
            label={"Выберите ответ:"}
            initialValue={undefined}
          >
            <Radio.Group
              style={style}
              options={radioOptions} // Use memoized options
              disabled={finished}
            />
          </Form.Item>
          <Form.Item
            name={[index, "current"]}
            noStyle
            initialValue={question.correctAnswer}
            hidden={!finished}
          >
            <div className={styles.current}>
              <b>Правильный ответ:</b> {question.correctAnswer}
            </div>
          </Form.Item>
          <Form.Item
            name={[index, "question"]}
            noStyle
            initialValue={question.question}
          ></Form.Item>
        </div>
      </div>
    );
  }
);

export default QuestionItem;
