import { useEffect } from "react";
import Main from "./components/Main";
import { useTestStore } from "./store/useTestStore";

function App() {
  const { initQuestions } = useTestStore();

  useEffect(() => {
    initQuestions();
  }, []);

  return <Main />;
}

export default App;
