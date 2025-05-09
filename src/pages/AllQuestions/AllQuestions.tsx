import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { STORAGE_KEY } from "../../assets/saveAnsvers";
import AnswersList from "../../components/AnswersList";
import type { IAnswer } from "../../assets/parseMoodleText";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[сc]/g, "c") // Replace both Russian and English 'c'
    .replace(/[аa]/g, "a") // Replace both Russian and English 'a'
    .replace(/[еe]/g, "e") // Replace both Russian and English 'e'
    .replace(/[оo]/g, "o") // Replace both Russian and English 'o'
    .replace(/[рp]/g, "p") // Replace both Russian and English 'p'
    .replace(/[уy]/g, "y") // Replace both Russian and English 'y'
    .replace(/[хx]/g, "x") // Replace both Russian and English 'x'
    .replace(/[кk]/g, "k") // Replace both Russian and English 'k'
    .replace(/[мm]/g, "m") // Replace both Russian and English 'm'
    .replace(/[тt]/g, "t"); // Replace both Russian and English 't'
};

const AllQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<IAnswer[]>([]);

  const onSearch = (search: string) => {
    const q: IAnswer[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    const normalizedSearch = normalizeText(search);
    const searchedQ = q.filter((e) =>
      normalizeText(e.question).includes(normalizedSearch.toLowerCase())
    );
    setQuestions(searchedQ);
  };

  useEffect(() => {
    const q = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    setQuestions(q);
  }, []);

  return (
    <div className={styles.root}>
      <div>
        <Input
          onChange={(e) => onSearch(e.target.value)}
          prefix={<SearchOutlined />}
          placeholder="Поиск"
          suffix={questions.length}
        />
      </div>
      <div className={styles.list}>
        <AnswersList answers={questions} />
      </div>
    </div>
  );
};

export default AllQuestions;
