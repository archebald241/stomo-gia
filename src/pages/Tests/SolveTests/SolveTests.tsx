import React, { useState, useCallback } from "react";
import styles from "./styles.module.scss";
import type { IQuestion } from "../../../assets/parseMoodleText";
import { Button, Divider, Form, Popconfirm } from "antd";
import classNames from "classnames";
import { saveErrorsQuestions } from "../../../assets/saveAnswers";
import QuestionItem from "../QuestionItem";

export interface IForm {
  questions: {
    current: string;
    answer?: string;
    question: string;
  }[];
}

interface IProps {
  questions: IQuestion[];
}

const SolveTests: React.FC<IProps> = ({ questions }) => {
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const onFinish = useCallback((values: IForm) => {
    saveErrorsQuestions(values.questions);
    const newErrors = values.questions.reduce((acc: number[], e, i) => {
      if (e.answer !== e.current) acc.push(i);
      return acc;
    }, []);
    setErrors(newErrors);
    setFinished(true);
  }, []);

  return (
    <Form
      form={form}
      style={{ height: "100%" }}
      layout="vertical"
      onFinish={onFinish}
    >
      <div className={styles.root}>
        <div className={styles.question_mini_con}>
          <div className={styles.question_mini_cont}>
            <div className={styles.question_mini}>
              {questions.map((e, index) => (
                <div
                  key={e.number + index}
                  className={classNames(styles.question_mini_item, {
                    [styles.success]: finished && !errors.includes(index),
                    [styles.error]: finished && errors.includes(index),
                  })}
                  onClick={() => {
                    form.scrollToField(["questions", index, "answer"], {
                      behavior: "smooth",
                      inline: "nearest",
                    });
                  }}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            {finished && (
              <>
                <Divider />
                <div>
                  {Math.floor(
                    ((questions.length - errors.length) / questions.length) *
                      100
                  )}{" "}
                  %
                </div>
              </>
            )}
          </div>
          <div>
            <Popconfirm
              title={"Ты реально хочешь завершить?"}
              onConfirm={form.submit}
            >
              <Button disabled={finished} type={"primary"}>
                Закончить
              </Button>
            </Popconfirm>
          </div>
        </div>
        <Divider style={{ height: "100%" }} type="vertical" />
        <div className={styles.questions_list}>
          <Form.List name={"questions"}>
            {() => {
              return questions.map((question, index) => (
                <QuestionItem
                  key={question.number + "_" + index}
                  question={question}
                  index={index}
                  errors={errors}
                  finished={finished}
                />
              ));
            }}
          </Form.List>
        </div>
      </div>
    </Form>
  );
};

export default SolveTests;
