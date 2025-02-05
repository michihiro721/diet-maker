export const getTrainingMenu6 = (gender, gymType, frequency, volume) => {
    let suggestedMenu = ``;
    suggestedMenu += `性別: ${gender}\n`;
    suggestedMenu += `ジムタイプ: ${gymType}\n`;
    suggestedMenu += `トレーニング頻度: ${frequency}\n`;
    suggestedMenu += `トレーニングボリューム: ${volume}\n\n`;
  
    // **条件ごとに適切なメニューを決定**
    if (gender === "男性") {
      if (gymType === "自重のみ") {
        if (frequency === "6回/週") {
          if (volume === "多いのがいい！") {
            suggestedMenu += "\n**6回/週のハードメニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×5セット, 腕立て伏せ 20回×5セット\n";
            suggestedMenu += "火: ブルガリアンスクワット 10回×5セット, スクワット 20回×5セット\n";
            suggestedMenu += "水: クランチ 20回×5セット, レッグレイズ 20回×5セット\n";
            suggestedMenu += "木: ディップス（椅子） 20回×5セット, 腕立て伏せ 20回×5セット\n";
            suggestedMenu += "金: ブルガリアンスクワット 10回×5セット, スクワット 20回×5セット\n";
            suggestedMenu += "土: クランチ 20回×5セット, レッグレイズ 20回×5セット\n";
            suggestedMenu += "日: 休み\n";
          } else if (volume === "普通がいいかな〜") {
            suggestedMenu += "\n**6回/週の標準メニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×3セット, 腕立て伏せ 20回×3セット\n";
            suggestedMenu += "火: ブルガリアンスクワット 10回×3セット, スクワット 20回×3セット\n";
            suggestedMenu += "水: クランチ 20回×3セット, レッグレイズ 20回×3セット\n";
            suggestedMenu += "木: ディップス（椅子） 20回×3セット, 腕立て伏せ 20回×3セット\n";
            suggestedMenu += "金: ブルガリアンスクワット 10回×3セット, スクワット 20回×3セット\n";
            suggestedMenu += "土: クランチ 20回×3セット, レッグレイズ 20回×3セット\n";
            suggestedMenu += "日: 休み\n";
          } else {
            suggestedMenu += "\n**6回/週の軽めメニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×2セット, 腕立て伏せ 20回×2セット\n";
            suggestedMenu += "火: ブルガリアンスクワット 10回×2セット, スクワット 20回×2セット\n";
            suggestedMenu += "水: クランチ 20回×2セット, レッグレイズ 20回×2セット\n";
            suggestedMenu += "木: ディップス（椅子） 20回×2セット, 腕立て伏せ 20回×2セット\n";
            suggestedMenu += "金: ブルガリアンスクワット 10回×2セット, スクワット 20回×2セット\n";
            suggestedMenu += "土: クランチ 20回×2セット, レッグレイズ 20回×2セット\n";
            suggestedMenu += "日: 休み\n";
          }
        } else if (frequency === "5回/週") {
          if (volume === "多いのがいい！") {
            suggestedMenu += "\n**5回/週のハードメニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×5セット, 腕立て伏せ 20回×5セット\n";
            suggestedMenu += "火: ブルガリアンスクワット 10回×5セット, スクワット 20回×5セット\n";
            suggestedMenu += "水: クランチ 20回×5セット, レッグレイズ 20回×5セット\n";
            suggestedMenu += "木: ディップス（椅子） 20回×5セット, 腕立て伏せ 20回×5セット\n";
            suggestedMenu += "金: ブルガリアンスクワット 10回×5セット, スクワット 20回×5セット\n";
            suggestedMenu += "土日: 休み\n";
          } else if (volume === "普通がいいかな〜") {
            suggestedMenu += "\n**5回/週の標準メニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×3セット, 腕立て伏せ 20回×3セット\n";
            suggestedMenu += "火: ブルガリアンスクワット 10回×3セット, スクワット 20回×3セット\n";
            suggestedMenu += "水: クランチ 20回×3セット, レッグレイズ 20回×3セット\n";
            suggestedMenu += "木: ディップス（椅子） 20回×3セット, 腕立て伏せ 20回×3セット\n";
            suggestedMenu += "金: ブルガリアンスクワット 10回×3セット, スクワット 20回×3セット\n";
            suggestedMenu += "土日: 休み\n";
          } else {
            suggestedMenu += "\n**5回/週の軽めメニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×2セット, 腕立て伏せ 20回×2セット\n";
            suggestedMenu += "火: ブルガリアンスクワット 10回×2セット, スクワット 20回×2セット\n";
            suggestedMenu += "水: クランチ 20回×2セット, レッグレイズ 20回×2セット\n";
            suggestedMenu += "木: ディップス（椅子） 20回×2セット, 腕立て伏せ 20回×2セット\n";
            suggestedMenu += "金: ブルガリアンスクワット 10回×2セット, スクワット 20回×2セット\n";
            suggestedMenu += "土日: 休み\n";
          }
        } else if (frequency === "4回/週") {
          if (volume === "多いのがいい！") {
            suggestedMenu += "\n**4回/週のハードメニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×5セット, 腕立て伏せ 20回×5セット\n";
            suggestedMenu += "火: ブルガリアンスクワット 10回×5セット, スクワット 20回×5セット\n";
            suggestedMenu += "木: クランチ 20回×5セット, レッグレイズ 20回×5セット\n";
            suggestedMenu += "金: ディップス（椅子） 20回×5セット, 腕立て伏せ 20回×5セット\n";
            suggestedMenu += "水土日: 休み\n";
          } else if (volume === "普通がいいかな〜") {
            suggestedMenu += "\n**4回/週の標準メニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×3セット, 腕立て伏せ 20回×3セット\n";
            suggestedMenu += "火: ブルガリアンスクワット 10回×3セット, スクワット 20回×3セット\n";
            suggestedMenu += "木: クランチ 20回×3セット, レッグレイズ 20回×3セット\n";
            suggestedMenu += "金: ディップス（椅子） 20回×3セット, 腕立て伏せ 20回×3セット\n";
            suggestedMenu += "水土日: 休み\n";
          } else {
            suggestedMenu += "\n**4回/週の軽めメニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×2セット, 腕立て伏せ 20回×2セット\n";
            suggestedMenu += "火: ブルガリアンスクワット 10回×2セット, スクワット 20回×2セット\n";
            suggestedMenu += "木: クランチ 20回×2セット, レッグレイズ 20回×2セット\n";
            suggestedMenu += "金: ディップス（椅子） 20回×2セット, 腕立て伏せ 20回×2セット\n";
            suggestedMenu += "水土日: 休み\n";
          }
        } else if (frequency === "3回/週") {
          if (volume === "多いのがいい！") {
            suggestedMenu += "\n**3回/週のハードメニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×5セット, 腕立て伏せ 20回×5セット\n";
            suggestedMenu += "水: ブルガリアンスクワット 10回×5セット, スクワット 20回×5セット\n";
            suggestedMenu += "金: クランチ 20回×5セット, レッグレイズ 20回×5セット\n";
            suggestedMenu += "火木土日: 休み\n";
          } else if (volume === "普通がいいかな〜") {
            suggestedMenu += "\n**3回/週の標準メニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×3セット, 腕立て伏せ 20回×3セット\n";
            suggestedMenu += "水: ブルガリアンスクワット 10回×3セット, スクワット 20回×3セット\n";
            suggestedMenu += "金: クランチ 20回×3セット, レッグレイズ 20回×3セット\n";
            suggestedMenu += "火木土日: 休み\n";
          } else {
            suggestedMenu += "\n**3回/週の軽めメニュー**\n";
            suggestedMenu += "月: ディップス（椅子） 20回×2セット, 腕立て伏せ 20回×2セット\n";
            suggestedMenu += "水: ブルガリアンスクワット 10回×2セット, スクワット 20回×2セット\n";
            suggestedMenu += "金: クランチ 20回×2セット, レッグレイズ 20回×2セット\n";
            suggestedMenu += "火木土日: 休み\n";
          }
        }
      }
    } else {
      suggestedMenu = "";
    }
  
    return suggestedMenu;
  };