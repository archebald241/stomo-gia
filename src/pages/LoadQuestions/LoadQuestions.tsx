import React from "react";
import styles from "./styles.module.scss";
import type { UploadChangeParam } from "antd/es/upload";
import { loadAnswersFromFile, onSaveAnswers } from "../../assets/saveAnsvers";
import { Button, Form, notification, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

interface IPokakal {
  file: UploadChangeParam;
}

const LoadQuestions: React.FC = () => {
  const [api, context] = notification.useNotification();

  const onFinish = (values: IPokakal) => {
    const file = values.file.fileList[0]?.originFileObj;
    if (!file) {
      return;
    }
    loadAnswersFromFile(file).then((e) => {
      onSaveAnswers(e, false);
      api.success({
        message: "Дело сделано!",
        description: "Чего прикажешь, начальник?",
        placement: "bottomRight",
      });
    });
  };

  return (
    <div className={styles.root}>
      <Form onFinish={onFinish} className={styles.form}>
        <Form.Item name={"file"} rules={[{ required: true }]}>
          <Upload.Dragger beforeUpload={() => false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Pick me</p>
          </Upload.Dragger>
        </Form.Item>
        <Button htmlType="submit">Загрузить</Button>
      </Form>
      {context}
    </div>
  );
};

export default LoadQuestions;
