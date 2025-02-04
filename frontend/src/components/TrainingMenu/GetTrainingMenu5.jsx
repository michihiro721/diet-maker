export const getTrainingMenu5 = (gender, gymType, frequency, volume) => {
    let suggestedMenu = `提案されたトレーニングメニュー:\n\n`;
    suggestedMenu += `性別: ${gender}\n`;
    suggestedMenu += `ジムタイプ: ${gymType}\n`;
    suggestedMenu += `トレーニング頻度: ${frequency}\n`;
    suggestedMenu += `トレーニングボリューム: ${volume}\n\n`;
  
    // **条件ごとに適切なメニューを決定**
    if (gender === "男性") {
      if (gymType === "ホームジム4") {
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
      }
    } else {
      suggestedMenu = "";
    }
  
    return suggestedMenu;
  };