import "./ResetButton.css";

const ResetButton = ({ onResetKey }) => {
  return (
    <>
      <button onClick={onResetKey}>Reset</button>
    </>
  );
};
export default ResetButton;
