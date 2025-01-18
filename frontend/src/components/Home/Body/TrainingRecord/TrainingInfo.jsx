import React from "react";
import './styles/training-info.css';

const TrainingInfo = () => (
  <div className="training-info">
    <p>
      種目：<input type="text" defaultValue="ベンチプレス" readOnly />
    </p>
    <p>対象部位：胸</p>
    <p>MAX重量：95kg</p>
    <p>消費カロリー：xxxkcal</p>
  </div>
);

export default TrainingInfo;