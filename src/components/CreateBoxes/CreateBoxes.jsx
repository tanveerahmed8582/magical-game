import { useState } from "react";
import "./CreateBoxes.css";

const CreateBoxes = () => {
  const [gridSize, setGridSize] = useState("");
  const [error, setError] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isWon, setIsWon] = useState(false);

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

  // const boxes = !error
  //   ? Array.from({ length: gridSize ? gridSize * gridSize : 0 })
  //   : [];

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
    } else {
      setError(true);
      setGridSize(value);
      setNumbers([]);
      setFlipped([]);
      setMatched([]);
      setSelected([]);
      setIsWon(false);
    }
  };

  const handleFlipped = (index) => {
    //agar box already matched hai ignore click
    if (matched.includes(index)) return;

    //agar already flipped(visible) hai, ignore
    if (flipped[index]) return;

    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);

    const newSelected = [...selected, index];
    setSelected(newSelected);

    //Agar 2 boxes select ho gaye
    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (numbers[first] === numbers[second]) {
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
  };
  return (
    <>
      <input
        className={`grid-input ${error ? "error" : ""}`}
        type="number"
        max={8}
        min={2}
        value={gridSize}
        onChange={handleChange}
        placeholder="Entre grid size (2-8)"
      />
      {error && <p className="error-text">Please enter number between 2-8</p>}
      <div
        className="box-container"
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
                <div className="box-front"></div>
                <div className="box-back">{num}</div>
              </div>
            </div>
          );
        })}
      </div>
      {isWon && <p className="win-text">🎉 You Won!! 🎉</p>}
    </>
  );
};
export default CreateBoxes;
