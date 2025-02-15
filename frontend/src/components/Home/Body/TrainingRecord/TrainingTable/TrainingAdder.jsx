import React from "react";
import './styles/training-adder.css';

const TrainingAdder = ({ addTraining }) => {
return (
    <div className="training-adder">
        <button className="add-training-button" onClick={addTraining}>トレーニング追加</button>
    </div>
);
};

export default TrainingAdder;