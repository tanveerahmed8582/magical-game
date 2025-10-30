import { useState, useEffect, useRef } from "react";
import "./CreateBoxes.css";

const CreateBoxes = ({ onAutoReset, isMuted }) => {
  const [gridSize, setGridSize] = useState("");
  const [error, setError] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [flipCounts, setFlipCounts] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [countDown, setCountDown] = useState(5);
  const bgMusicRef = useRef(null);

  useEffect(() => {
    //music element create kar rhe hai.
    bgMusicRef.current = new Audio("/music.mp3");
    bgMusicRef.current.loop = true; //repeat music continuously

    // Jab component mount ho aur game start ho — play music
    bgMusicRef.current.play().catch(() => {
      console.log("Autoplay blocked — will play after user interaction.");
    });

    // Cleanup: jab component unmount ho
    return () => {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    };
  }, []);

  // Jab mute toggle ho to music pause/play karna hai
  useEffect(() => {
    if (!bgMusicRef.current) return;

    if (isMuted) {
      bgMusicRef.current.pause();
    } else {
      bgMusicRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  //Jab game win ya lose ho jaye — stop music
  useEffect(() => {
    if (isWon || isLost) {
      bgMusicRef.current.pause();
      const endSound = new Audio(isWon ? "/gameover.wav" : "/gameover.wav");
      endSound.volume = 0.7;
      endSound.play();
    }
  }, [isWon, isLost, isMuted]);

  const generateShuffledNumbers = (size) => {
    const totalBoxes = size * size;
    const totalPairs = totalBoxes / 2;

    const baseNumbers = Array.from({ length: totalPairs }, (_, i) => i + 1);

    const pairedNumbers = [...baseNumbers, ...baseNumbers];

    for (let i = pairedNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairedNumbers[i], pairedNumbers[j]] = [
        pairedNumbers[j],
        pairedNumbers[i],
      ];
    }
    return pairedNumbers;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setGridSize("");
      setError(false);
      setNumbers([]);
      setFlipped([]);
      setMatched([]);
      setSelected([]);
      setIsWon(false);
      setIsLost(false);
      setFlipCounts([]);
      return;
    }
    const num = Number(value);
    if (num >= 2 && num <= 8) {
      setGridSize(value);
      setError(false);
      const newNumbers = generateShuffledNumbers(num);
      setNumbers(newNumbers);
      setFlipped(Array(newNumbers.length).fill(false));
      setMatched([]);
      setSelected([]);
      setIsWon(false);
      setIsLost(false);
      setFlipCounts(Array(newNumbers.length).fill(0));
    } else {
      setError(true);
      setGridSize(value);
      setNumbers([]);
      setFlipped([]);
      setMatched([]);
      setSelected([]);
      setIsWon(false);
      setIsLost(false);
      setFlipCounts([]);
    }

    if (bgMusicRef.current) {
      bgMusicRef.current.play();
    }
  };

  const handleFlipped = (index) => {
    if (isWon || isLost) return; //stop if game already over.

    //agar box already matched hai ignore click
    if (matched.includes(index)) return;

    //agar already flipped(visible) hai, ignore
    if (flipped[index]) return;

    // agar box ka flip count 4 ho gaya, toh game over
    if (flipCounts[index] >= 5) {
      setIsLost(true);
      return;
    }

    //Play flip sound
    if (!isMuted) {
      const sound = new Audio("/turn.wav");
      sound.play();
    }

    //flip count badhao
    const newFlipCounts = [...flipCounts];
    newFlipCounts[index] += 1;
    setFlipCounts(newFlipCounts);

    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);

    const newSelected = [...selected, index];
    setSelected(newSelected);

    //Agar 2 boxes select ho gaye
    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (numbers[first] === numbers[second]) {
        // ✅ Yaha sound play karenge
        if (!isMuted) {
          const matchAudio = new Audio("/matched.wav");
          matchAudio.play();
        }

        //Match mila — dono open hi rahenge
        setMatched((prev) => {
          const newMatched = [...prev, first, second];

          if (newMatched.length === numbers.length) {
            setIsWon(true);
          }
          return newMatched;
        });
        setSelected([]);
      } else {
        //Match nahi — 1 sec baad hide kar do
        setTimeout(() => {
          const resetFlipped = [...newFlipped];
          resetFlipped[first] = false;
          resetFlipped[second] = false;
          setFlipped(resetFlipped);
          setSelected([]);
        }, 800);
      }
    }
    // agar kisi box ka count 4 se zyada ho gaya → game over
    if (newFlipCounts[index] >= 5) {
      setIsLost(true);
    }
  };

  useEffect(() => {
    if (isWon || isLost) {
      setCountDown(5);

      let countDown = 5;
      const interval = setInterval(() => {
        countDown -= 1;
        setCountDown(countDown);
        if (countDown <= 0) clearInterval(interval);
      }, 1000);

      const timer = setTimeout(() => {
        clearInterval(interval);
        onAutoReset();
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isWon, isLost]);

  return (
    <>
      <input
        className={`grid-input ${error ? "error" : ""}`}
        type="number"
        max={8}
        min={2}
        value={gridSize}
        onChange={handleChange}
        placeholder="Enter grid size (2-8)"
      />
      {error && <p className="error-text">Please enter number between 2-8</p>}
      <div
        className={`box-container ${isWon || isLost ? "disabled" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {numbers.map((num, index) => {
          return (
            <div
              className={`box ${flipped[index] ? "flipped" : ""}`}
              key={index}
              onClick={() => handleFlipped(index)}
            >
              <div className="box-inner">
                <div className="box-front">
                  <span className="flip-counter">{flipCounts[index]}</span>
                </div>
                <div className="box-back">{num}</div>
              </div>
            </div>
          );
        })}
      </div>
      {(isWon || isLost) && (
        <div className="overlay-message">
          <p className={isWon ? "win-text" : "lose-text"}>
            {isWon ? "🎉 You Won!! 🎉" : "💀 You Lost!! 💀"}
          </p>
          <p className="restart-text">
            Restarting in {countDown} second{countDown !== 1 ? "s" : ""}...
          </p>
        </div>
      )}
    </>
  );
};
export default CreateBoxes;
