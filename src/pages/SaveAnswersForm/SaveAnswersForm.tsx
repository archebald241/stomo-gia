import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Button, Checkbox, Divider, Form, Input } from "antd";
import { parseMoodleText, type IAnswer } from "../../assets/parseMoodleText";
import { onSaveAnswers } from "../../assets/saveAnsvers";
import AnswersList from "../../components/AnswersList";

const SaveAnswersForm: React.FC = () => {
  const [answers, setAnswers] = useState<IAnswer[]>([]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const parseAnswers = parseMoodleText(e.target.value);

    if (parseAnswers) {
      setAnswers(parseAnswers);
    }
  };

  return (
    <div className={styles.root}>
      <Form
        className={styles.form}
        onFinish={({ save }) => onSaveAnswers(answers, save)}
      >
        <div className={styles.items}>
          <Form.Item>
            <Input.TextArea onChange={onChangeHandler} rows={10} />
          </Form.Item>
          <AnswersList answers={answers} />
        </div>
        <div>
          <Divider />
          <div className={styles.subm}>
            <Button htmlType="submit">Сохранить</Button>
            <Form.Item
              name={"save"}
              valuePropName="checked"
              initialValue={true}
            >
              <Checkbox>Сохранять файл</Checkbox>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SaveAnswersForm;
