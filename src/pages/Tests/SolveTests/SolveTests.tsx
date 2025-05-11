import React, { useState } from "react";
import styles from "./styles.module.scss";
import type { IQuestion } from "../../../assets/parseMoodleText";
import { Button, Divider, Form, Popconfirm, Radio } from "antd";
import classNames from "classnames";
import { saveErrorsQuestions } from "../../../assets/saveAnswers";

const style: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

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

  const onFinish = (values: IForm) => {
    saveErrorsQuestions(values.questions);
    values.questions.map(
      (e, i) => e.answer !== e.current && setErrors((p) => [...p, i])
    );
    setFinished(true);
  };

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
                <div
                  key={question.number + "_" + index}
                  className={classNames(styles.question, {
                    [styles.error]: errors.includes(index),
                    [styles.success]: finished && !errors.includes(index),
                  })}
                >
                  <h3>
                    {index + 1}. {question.question}
                  </h3>
                  <div>
                    <Form.Item
                      name={[index, "answer"]}
                      label={"Выберите ответ:"}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Поле обязательно для заполнения",
                      //   },
                      // ]}
                      initialValue={undefined}
                    >
                      <Radio.Group
                        style={style}
                        options={question.options.map((val) => ({
                          value: val,
                          label: val,
                        }))}
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
              ));
            }}
          </Form.List>
        </div>
      </div>
    </Form>
  );
};

export default SolveTests;
