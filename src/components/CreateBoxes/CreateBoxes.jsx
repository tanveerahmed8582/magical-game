import { useState } from "react";
import "./CreateBoxes.css";

const CreateBoxes = () => {
  const [gridSize, setGridSize] = useState("");
  const [error, setError] = useState(false);
  const [numbers, setNumbers] = useState([]);

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
    }
    const num = Number(value);
    if (num >= 2 && num <= 8) {
      setGridSize(value);
      setError(false);
      const newNumbers = generateShuffledNumbers(num);
      setNumbers(newNumbers);
    } else {
      setError(true);
      setGridSize(value);
      setNumbers([]);
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
            <div className="box" key={index}>
              {num}
            </div>
          );
        })}
      </div>
    </>
  );
};
export default CreateBoxes;
