import { useState } from "react";
import { Button, Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  RollbackOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import SaveAnswersForm from "../../pages/SaveAnswersForm";
import AllQuestions from "../../pages/AllQuestions";
import LoadQuestions from "../../pages/LoadQuestions";

const items = [
  {
    key: "",
    icon: <UserOutlined />,
    label: "Загрузить вопросики",
    element: <SaveAnswersForm />,
  },
  {
    key: "all",
    icon: <VideoCameraOutlined />,
    label: "Все вопросы",
    element: <AllQuestions />,
  },
  {
    key: "3",
    icon: <QuestionCircleOutlined />,
    label: "Порешать тест",
    element: <></>,
  },
  {
    key: "load",
    icon: <RollbackOutlined />,
    label: "Загрузить бэкап",
    element: <LoadQuestions />,
  },
];

const getActiveItem = (key: string) => {
  return items.find((v) => v.key === key)?.label ?? "";
};

const Main: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [activeKey, setActiveKey] = useState<string>(
    sessionStorage.getItem("_ap") ?? ""
  );

  const [activeItemLabel, setActiveItemLabel] = useState<string>(
    getActiveItem(activeKey)
  );

  return (
    <Layout style={{ height: "100%" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[activeKey]}
          items={items}
          onSelect={(e) => {
            sessionStorage.setItem("_ap", e.key);
            setActiveKey(e.key);
            setActiveItemLabel(getActiveItem(e.key));
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          {activeItemLabel}
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {items.find((e) => e.key === activeKey)?.element}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
