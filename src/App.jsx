import "./App.css";
import { useState } from "react";
import CreateBoxes from "./components/CreateBoxes/CreateBoxes";
import Header from "./components/Header/Header";
import ResetButton from "./components/ResetButton/ResetButton";
import { Volume2, VolumeX } from "lucide-react"; // ✅ Icon import

function App() {
  const [resetKey, setResetKey] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="app-container">
      <div
        className="volume-icon"
        onClick={toggleMute}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </div>
      <Header />
      <CreateBoxes key={resetKey} onAutoReset={handleReset} isMuted={isMuted} />
      <ResetButton onResetKey={handleReset} />
    </div>
  );
}

export default App;
