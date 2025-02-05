export const getTrainingMenu3Woman = (gender, gymType, frequency, volume) => {
    let suggestedMenu = ``;
    suggestedMenu += `性別: ${gender}\n`;
    suggestedMenu += `ジムタイプ: ${gymType}\n`;
    suggestedMenu += `トレーニング頻度: ${frequency}\n`;
    suggestedMenu += `トレーニングボリューム: ${volume}\n\n`;
  
    // **条件ごとに適切なメニューを決定**
    if (gender === "女性") {
      if (gymType === "ホームジム2") {
        if (frequency === "6回/週") {
          if (volume === "多いのがいい！") {
            suggestedMenu += "\n**6回/週のハードメニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×5セット, ブルガリアンスクワット 12回×5セット, ダンベルスクワット 12回×5セット\n";
            suggestedMenu += "火: キックバック 15回×5セット, ダンベルローイング 12回×5セット\n";
            suggestedMenu += "水: ダンベルスクワット 10回×5セット, ブルガリアンスクワット 12回×5セット, スクワット 15回×5セット\n";
            suggestedMenu += "木: ダンベルショルダープレス 15回×5セット, サイドレイズ 15回×5セット\n";
            suggestedMenu += "金: クランチ 20回×5セット, ロシアンツイスト 20回×5セット\n";
            suggestedMenu += "土: ヒップスラスト 12回×5セット, 腕立て 10回×5セット, ウォーキング 20分\n";
            suggestedMenu += "日: 休み\n";
          } else if (volume === "普通がいいかな〜") {
            suggestedMenu += "\n**6回/週の標準メニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×3セット, ブルガリアンスクワット 12回×3セット, ダンベルスクワット 12回×3セット\n";
            suggestedMenu += "火: キックバック 15回×3セット, ダンベルローイング 12回×3セット\n";
            suggestedMenu += "水: ダンベルスクワット 10回×3セット, ブルガリアンスクワット 12回×3セット, スクワット 15回×3セット\n";
            suggestedMenu += "木: ダンベルショルダープレス 15回×3セット, サイドレイズ 15回×3セット\n";
            suggestedMenu += "金: クランチ 20回×3セット, ロシアンツイスト 20回×3セット\n";
            suggestedMenu += "土: ヒップスラスト 12回×3セット, 腕立て 10回×3セット, ウォーキング 20分\n";
            suggestedMenu += "日: 休み\n";
          } else {
            suggestedMenu += "\n**6回/週の軽めメニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×2セット, ブルガリアンスクワット 12回×2セット, ダンベルスクワット 12回×2セット\n";
            suggestedMenu += "火: キックバック 15回×2セット, ダンベルローイング 12回×2セット\n";
            suggestedMenu += "水: ダンベルスクワット 10回×2セット, ブルガリアンスクワット 12回×2セット, スクワット 15回×2セット\n";
            suggestedMenu += "木: ダンベルショルダープレス 15回×2セット, サイドレイズ 15回×2セット\n";
            suggestedMenu += "金: クランチ 20回×2セット, ロシアンツイスト 20回×2セット\n";
            suggestedMenu += "土: ヒップスラスト 12回×2セット, 腕立て 10回×2セット, ウォーキング 20分\n";
            suggestedMenu += "日: 休み\n";
          }
        } else if (frequency === "5回/週") {
          if (volume === "多いのがいい！") {
            suggestedMenu += "\n**5回/週のハードメニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×5セット, ブルガリアンスクワット 12回×5セット, ダンベルスクワット 12回×5セット\n";
            suggestedMenu += "火: キックバック 15回×5セット, ダンベルローイング 12回×5セット\n";
            suggestedMenu += "水: ダンベルスクワット 10回×5セット, ブルガリアンスクワット 12回×5セット, スクワット 15回×5セット\n";
            suggestedMenu += "木: クランチ 20回×5セット, ロシアンツイスト 20回×5セット\n";
            suggestedMenu += "金: ヒップスラスト 12回×5セット, 腕立て 10回×5セット, ウォーキング 20分\n";
            suggestedMenu += "土日: 休み\n";
          } else if (volume === "普通がいいかな〜") {
            suggestedMenu += "\n**5回/週の標準メニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×3セット, ブルガリアンスクワット 12回×3セット, ダンベルスクワット 12回×3セット\n";
            suggestedMenu += "火: キックバック 15回×3セット, ダンベルローイング 12回×3セット\n";
            suggestedMenu += "水: ダンベルスクワット 10回×3セット, ブルガリアンスクワット 12回×3セット, スクワット 15回×3セット\n";
            suggestedMenu += "木: クランチ 20回×3セット, ロシアンツイスト 20回×3セット\n";
            suggestedMenu += "金: ヒップスラスト 12回×3セット, 腕立て 10回×3セット, ウォーキング 20分\n";
            suggestedMenu += "土日: 休み\n";
          } else {
            suggestedMenu += "\n**5回/週の軽めメニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×2セット, ブルガリアンスクワット 12回×2セット, ダンベルスクワット 12回×2セット\n";
            suggestedMenu += "火: キックバック 15回×2セット, ダンベルローイング 12回×2セット\n";
            suggestedMenu += "水: ダンベルスクワット 10回×2セット, ブルガリアンスクワット 12回×2セット, スクワット 15回×2セット\n";
            suggestedMenu += "木: クランチ 20回×2セット, ロシアンツイスト 20回×2セット\n";
            suggestedMenu += "金: ヒップスラスト 12回×2セット, 腕立て 10回×2セット, ウォーキング 20分\n";
            suggestedMenu += "土日: 休み\n";
          }
        } else if (frequency === "4回/週") {
          if (volume === "多いのがいい！") {
            suggestedMenu += "\n**4回/週のハードメニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×5セット, ブルガリアンスクワット 12回×5セット, ダンベルスクワット 12回×5セット\n";
            suggestedMenu += "火: キックバック 15回×5セット, ダンベルローイング 12回×5セット\n";
            suggestedMenu += "木: ダンベルスクワット 10回×5セット, ブルガリアンスクワット 12回×5セット, スクワット 15回×5セット\n";
            suggestedMenu += "金: クランチ 20回×5セット, ロシアンツイスト 20回×5セット\, ウォーキング 20分n";
            suggestedMenu += "水土日: 休み\n";
          } else if (volume === "普通がいいかな〜") {
            suggestedMenu += "\n**4回/週の標準メニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×3セット, ブルガリアンスクワット 12回×3セット, ダンベルスクワット 12回×3セット\n";
            suggestedMenu += "火: キックバック 15回×3セット, ダンベルローイング 12回×3セット\n";
            suggestedMenu += "木: ダンベルスクワット 10回×3セット, ブルガリアンスクワット 12回×3セット, スクワット 15回×3セット\n";
            suggestedMenu += "金: クランチ 20回×3セット, ロシアンツイスト 20回×3セット, ウォーキング 20分\n";
            suggestedMenu += "水土日: 休み\n";
          } else {
            suggestedMenu += "\n**4回/週の軽めメニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×2セット, ブルガリアンスクワット 12回×2セット, ダンベルスクワット 12回×2セット\n";
            suggestedMenu += "火: キックバック 15回×2セット, ダンベルローイング 12回×2セット\n";
            suggestedMenu += "木: ダンベルスクワット 10回×2セット, ブルガリアンスクワット 12回×2セット, スクワット 15回×2セット\n";
            suggestedMenu += "金: クランチ 20回×2セット, ロシアンツイスト 20回×2セット, ウォーキング 20分\n";
            suggestedMenu += "水土日: 休み\n";
          }
        } else if (frequency === "3回/週") {
          if (volume === "多いのがいい！") {
            suggestedMenu += "\n**3回/週のハードメニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×5セット, ブルガリアンスクワット 12回×5セット, ダンベルスクワット 12回×5セット\n";
            suggestedMenu += "水: デッドリフト 12回×5セット, バーベルロー 12回×5セット\n";
            suggestedMenu += "金: クランチ 20回×5セット, ロシアンツイスト 20回×5セット\, ウォーキング 20分n";
            suggestedMenu += "火木土日: 休み\n";
          } else if (volume === "普通がいいかな〜") {
            suggestedMenu += "\n**3回/週の標準メニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×3セット, ブルガリアンスクワット 12回×3セット, ダンベルスクワット 12回×3セット\n";
            suggestedMenu += "水: デッドリフト 12回×3セット, バーベルロー 12回×3セット\n";
            suggestedMenu += "金: クランチ 20回×3セット, ロシアンツイスト 20回×3セット\, ウォーキング 20分n";
            suggestedMenu += "火木土日: 休み\n";
          } else {
            suggestedMenu += "\n**3回/週の軽めメニュー**\n";
            suggestedMenu += "月: ヒップスラスト 10回×2セット, ブルガリアンスクワット 12回×2セット, ダンベルスクワット 12回×2セット\n";
            suggestedMenu += "水: デッドリフト 12回×2セット, バーベルロー 12回×2セット\n";
            suggestedMenu += "金: クランチ 20回×2セット, ロシアンツイスト 20回×2セット\, ウォーキング 20分n";
            suggestedMenu += "火木土日: 休み\n";
          }
        }
      }
    } else {
      suggestedMenu = "";
    }
  
    return suggestedMenu;
  };