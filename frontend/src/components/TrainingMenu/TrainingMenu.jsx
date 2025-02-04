import React, { useState } from "react";

const TrainingMenu = () => {
  const [gender, setGender] = useState("");
  const [gymType, setGymType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [volume, setVolume] = useState("");
  const [menu, setMenu] = useState(null);

  // **トレーニングメニューを決定する関数**
  const getTrainingMenu = (gender, gymType, frequency, volume) => {
    let suggestedMenu = `提案されたトレーニングメニュー:\n\n`;
    suggestedMenu += `性別: ${gender}\n`;
    suggestedMenu += `ジムタイプ: ${gymType}\n`;
    suggestedMenu += `トレーニング頻度: ${frequency}\n`;
    suggestedMenu += `トレーニングボリューム: ${volume}\n\n`;

    // **条件ごとに適切なメニューを決定**
    if (gymType === "ジムに通っている") {
      if (frequency === "6回/週") {
        if (volume === "多いのがいい！") {
          suggestedMenu += "\n**ジム通い6回/週のハードメニュー**\n";
          suggestedMenu += "月: ベンチプレス 12回×5セット, ダンベルフライ 12回×5セット\n";
          suggestedMenu += "火: デッドリフト 12回×5セット, バーベルロー 12回×5セット\n";
          suggestedMenu += "水: スクワット 12回×5セット, レッグプレス 12回×5セット\n";
          suggestedMenu += "木: ショルダープレス 12回×5セット, サイドレイズ 12回×5セット\n";
          suggestedMenu += "金: 懸垂 12回×5セット, アームカール 12回×5セット\n";
          suggestedMenu += "土: 腹筋強化 20回×5セット, サイドクランチ 20回×5セット\n";
          suggestedMenu += "日: 休み\n";
        } else if (volume === "普通がいいかな〜") {
          suggestedMenu += "\n**ジム通い6回/週の標準メニュー**\n";
          suggestedMenu += "月: ベンチプレス 10回×4セット, ダンベルフライ 10回×4セット\n";
          suggestedMenu += "火: デッドリフト 10回×4セット, バーベルロー 10回×4セット\n";
          suggestedMenu += "水: スクワット 10回×4セット, レッグプレス 10回×4セット\n";
          suggestedMenu += "木: ショルダープレス 10回×4セット, サイドレイズ 10回×4セット\n";
          suggestedMenu += "金: 懸垂 10回×4セット, アームカール 10回×4セット\n";
          suggestedMenu += "土: 腹筋強化 15回×4セット, サイドクランチ 15回×4セット\n";
          suggestedMenu += "日: 休み\n";
        } else {
          suggestedMenu += "\n**ジム通い6回/週の軽めメニュー**\n";
          suggestedMenu += "月: ベンチプレス 8回×3セット, ダンベルフライ 8回×3セット\n";
          suggestedMenu += "火: デッドリフト 8回×3セット, バーベルロー 8回×3セット\n";
          suggestedMenu += "水: スクワット 8回×3セット, レッグプレス 8回×3セット\n";
          suggestedMenu += "木: ショルダープレス 8回×3セット, サイドレイズ 8回×3セット\n";
          suggestedMenu += "金: 懸垂 8回×3セット, アームカール 8回×3セット\n";
          suggestedMenu += "土: 腹筋強化 12回×3セット, サイドクランチ 12回×3セット\n";
          suggestedMenu += "日: 休み\n";
        }
      } else if (frequency === "5回/週") {
        if (volume === "多いのがいい！") {
          suggestedMenu += "\n**ジム通い5回/週のハードメニュー**\n";
          suggestedMenu += "月: ベンチプレス 12回×5セット, ダンベルフライ 12回×5セット\n";
          suggestedMenu += "火: デッドリフト 12回×5セット, バーベルロー 12回×5セット\n";
          suggestedMenu += "水: スクワット 12回×5セット, レッグプレス 12回×5セット\n";
          suggestedMenu += "木: ショルダープレス 12回×5セット, サイドレイズ 12回×5セット\n";
          suggestedMenu += "金: 懸垂 12回×5セット, アームカール 12回×5セット\n";
          suggestedMenu += "土日: 休み\n";
          } else if (volume === "普通がいいかな〜") {
            suggestedMenu += "\n**ジム通い5回/週の標準メニュー**\n";
            suggestedMenu += "月: ベンチプレス 10回×4セット, ダンベルフライ 10回×4セット\n";
            suggestedMenu += "火: デッドリフト 10回×4セット, バーベルロー 10回×4セット\n";
            suggestedMenu += "水: スクワット 10回×4セット, レッグプレス 10回×4セット\n";
            suggestedMenu += "木: ショルダープレス 10回×4セット, サイドレイズ 10回×4セット\n";
            suggestedMenu += "金: 懸垂 10回×4セット, アームカール 10回×4セット\n";
            suggestedMenu += "土日: 休み\n";
          } else {
            suggestedMenu += "\n**ジム通い5回/週の軽めメニュー**\n";
            suggestedMenu += "月: ベンチプレス 8回×3セット, ダンベルフライ 8回×3セット\n";
            suggestedMenu += "火: デッドリフト 8回×3セット, バーベルロー 8回×3セット\n";
            suggestedMenu += "水: スクワット 8回×3セット, レッグプレス 8回×3セット\n";
            suggestedMenu += "木: ショルダープレス 8回×3セット, サイドレイズ 8回×3セット\n";
            suggestedMenu += "金: 懸垂 8回×3セット, アームカール 8回×3セット\n";
            suggestedMenu += "土日: 休み\n";
          }
        } else if (frequency === "4回/週") {
          if (volume === "多いのがいい！") {
            suggestedMenu += "\n**ジム通い4回/週のハードメニュー**\n";
            suggestedMenu += "月: ベンチプレス 12回×5セット, ダンベルフライ 12回×5セット\n";
            suggestedMenu += "火: デッドリフト 12回×5セット, バーベルロー 12回×5セット\n";
            suggestedMenu += "木: スクワット 12回×5セット, レッグプレス 12回×5セット\n";
            suggestedMenu += "金: ショルダープレス 12回×5セット, サイドレイズ 12回×5セット\n";
            suggestedMenu += "水土日: 休み\n";
          } else if (volume === "普通がいいかな〜") {
            suggestedMenu += "\n**ジム通い4回/週の標準メニュー**\n";
            suggestedMenu += "月: ベンチプレス 10回×4セット, ダンベルフライ 10回×4セット\n";
            suggestedMenu += "火: デッドリフト 10回×4セット, バーベルロー 10回×4セット\n";
            suggestedMenu += "木: スクワット 10回×4セット, レッグプレス 10回×4セット\n";
            suggestedMenu += "金: ショルダープレス 10回×4セット, サイドレイズ 10回×4セット\n";
            suggestedMenu += "水土日: 休み\n";
          } else {
            suggestedMenu += "\n**ジム通い4回/週の軽めメニュー**\n";
            suggestedMenu += "月: ベンチプレス 8回×3セット, ダンベルフライ 8回×3セット\n";
            suggestedMenu += "火: デッドリフト 8回×3セット, バーベルロー 8回×3セット\n";
            suggestedMenu += "木: スクワット 8回×3セット, レッグプレス 8回×3セット\n";
            suggestedMenu += "金: ショルダープレス 8回×3セット, サイドレイズ 8回×3セット\n";
            suggestedMenu += "水土日: 休み\n";
          }
        } else if (frequency === "3回/週") {
          if (volume === "多いのがいい！") {
            suggestedMenu += "\n**ジム通い3回/週のハードメニュー**\n";
            suggestedMenu += "月: ベンチプレス 12回×5セット, ダンベルフライ 12回×5セット\n";
            suggestedMenu += "水: デッドリフト 12回×5セット, バーベルロー 12回×5セット\n";
            suggestedMenu += "金: スクワット 12回×5セット, レッグプレス 12回×5セット\n";
            suggestedMenu += "火木土日: 休み\n";
          } else if (volume === "普通がいいかな〜") {
            suggestedMenu += "\n**ジム通い3回/週の標準メニュー**\n";
            suggestedMenu += "月: ベンチプレス 10回×4セット, ダンベルフライ 10回×4セット\n";
            suggestedMenu += "水: デッドリフト 10回×4セット, バーベルロー 10回×4セット\n";
            suggestedMenu += "金: スクワット 10回×4セット, レッグプレス 10回×4セット\n";
            suggestedMenu += "火木土日: 休み\n";
          } else {
            suggestedMenu += "\n**ジム通い3回/週の軽めメニュー**\n";
            suggestedMenu += "月: ベンチプレス 8回×3セット, ダンベルフライ 8回×3セット\n";
            suggestedMenu += "水: デッドリフト 8回×3セット, バーベルロー 8回×3セット\n";
            suggestedMenu += "金: スクワット 8回×3セット, レッグプレス 8回×3セット\n";
            suggestedMenu += "火木土日: 休み\n";
          }
        }
      } else if (frequency === "5回/週") {
        suggestedMenu += "\n**ジム通い5回/週のメニュー**\n";
        suggestedMenu += "月: 胸・三頭筋\n火: 背中・二頭筋\n水: 休み\n木: 脚\n金: 肩・腹筋\n";
    } else if (gymType === "自重のみ") {
      suggestedMenu += "\n**自重トレーニング**\n";
      suggestedMenu += "月: プッシュアップ 15回×3セット, スクワット 20回×3セット\n";
      suggestedMenu += "火: 懸垂 10回×3セット, バーピー 15回×3セット\n";
      suggestedMenu += "水: 休み\n";
    }
    return suggestedMenu;
  };

  const handleSubmit = () => {
    const generatedMenu = getTrainingMenu(gender, gymType, frequency, volume);
    setMenu(generatedMenu);
  };

  return (
    <div>
      <h1>トレーニングメニュー提案</h1>
      <div>
        <label>性別:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">選択してください</option>
          <option value="男性">男性</option>
          <option value="女性">女性</option>
        </select>
      </div>
      <div>
        <label>ジムタイプ:</label>
        <select value={gymType} onChange={(e) => setGymType(e.target.value)}>
          <option value="">選択してください</option>
          <option value="ジムに通っている">ジムに通っている</option>
          <option value="ホームジム1">ホームジム1（バーベル、ダンベル、ベンチ、チンニング）</option>
          <option value="ホームジム2">ホームジム2（ダンベルとベンチ）</option>
          <option value="ホームジム3">ホームジム3（チンニング）</option>
          <option value="ホームジム4">ホームジム4（ダンベル、ベンチ、チンニング）</option>
          <option value="自重のみ">自重のみでやりたい！</option>
        </select>
      </div>
      <div>
        <label>トレーニング頻度:</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="">選択してください</option>
          <option value="6回/週">6回/週</option>
          <option value="5回/週">5回/週</option>
          <option value="4回/週">4回/週</option>
          <option value="3回/週">3回/週</option>
        </select>
      </div>
      <div>
        <label>トレーニングボリューム:</label>
        <select value={volume} onChange={(e) => setVolume(e.target.value)}>
          <option value="">選択してください</option>
          <option value="多いのがいい！">多いのがいい！</option>
          <option value="普通がいいかな〜">普通がいいかな〜</option>
          <option value="継続が目的なので、少なめで">継続が目的なので、少なめで</option>
        </select>
      </div>
      <button onClick={handleSubmit}>作成</button>
      {menu && (
        <div>
          <h2>トレーニングメニュー</h2>
          <pre>{menu}</pre>
        </div>
      )}
    </div>
  );
};

export default TrainingMenu;