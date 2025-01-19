// このコードは、トレーニング記録の基本情報を表示するためのコンポーネントです。
// 種目、対象部位、MAX重量、消費カロリーなどの情報を表示します。

import React from "react";
import './styles/training-info.css';

const TrainingInfo = () => (
  <div className="training-info">
    {/* 種目の情報を表示します */}
    <p>
      種目：<input type="text" className="exercise-input" defaultValue="ベンチプレス" readOnly />
    </p>
    {/* 対象部位の情報を表示します */}
    <p>対象部位：胸</p>
    {/* MAX重量の情報を表示します */}
    <p>MAX重量：95kg</p>
    {/* 消費カロリーの情報を表示します */}
    <p>消費カロリー：xxxkcal</p>
  </div>
);

export default TrainingInfo;