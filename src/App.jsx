import "./App.css";
import { useState } from "react";
import CreateBoxes from "./components/CreateBoxes/CreateBoxes";
import Header from "./components/Header/Header";
import ResetButton from "./components/ResetButton/ResetButton";

function App() {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <Header />
      <CreateBoxes key={resetKey} />
      <ResetButton onResetKey={handleReset} />
    </div>
  );
}

export default App;
