import React from "react";

const TrainingAdder = ({ addTraining }) => {
  return (
    <div className="training-adder">
      <button onClick={addTraining}>トレーニング追加</button>
    </div>
  );
};

export default TrainingAdder;