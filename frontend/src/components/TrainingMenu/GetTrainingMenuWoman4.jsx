export const getTrainingMenu4Woman = (gender, gymType, frequency, volume) => {
  let suggestedMenu = [];

  const createMenu = (title, menuItems) => {
    suggestedMenu.push({
      title: title,
      items: menuItems.map((item, itemIndex) => ({
        day: item.day,
        exercises: item.exercises.map((exercise, exerciseIndex) => ({
          key: `${itemIndex}-${exerciseIndex}`,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: 0 // 重量は0で初期化
        }))
      }))
    });
  };

  // **条件ごとに適切なメニューを決定**
  if (gender === "女性") {
    if (gymType === "ホームジム3") {
      if (frequency === "6回/週") {
        if (volume === "多いのがいい！") {
            createMenu("6回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5 }, { name: "スクワット", reps: 15, sets: 5 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5 }, { name: "腕立て伏せ", reps: 20, sets: 5 }] },
            { day: "水曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5 }, { name: "ロシアンツイスト", reps: 20, sets: 5 }] },
            { day: "木曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5 }, { name: "スクワット", reps: 15, sets: 5 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5 }, { name: "ディップス（椅子）", reps: 20, sets: 5 }] },
            { day: "土曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5 }, { name: "ロシアンツイスト", reps: 20, sets: 5 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
          } else if (volume === "普通がいいかな〜") {
            createMenu("6回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3 }, { name: "スクワット", reps: 15, sets: 3 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3 }, { name: "腕立て伏せ", reps: 20, sets: 3 }] },
            { day: "水曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3 }, { name: "ロシアンツイスト", reps: 20, sets: 3 }] },
            { day: "木曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3 }, { name: "スクワット", reps: 15, sets: 3 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3 }, { name: "ディップス（椅子）", reps: 20, sets: 3 }] },
            { day: "土曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3 }, { name: "ロシアンツイスト", reps: 20, sets: 3 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
          } else {
            createMenu("6回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2 }, { name: "スクワット", reps: 15, sets: 2 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2 }, { name: "腕立て伏せ", reps: 20, sets: 2 }] },
            { day: "水曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2 }, { name: "ロシアンツイスト", reps: 20, sets: 2 }] },
            { day: "木曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2 }, { name: "スクワット", reps: 15, sets: 2 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2 }, { name: "ディップス（椅子）", reps: 20, sets: 2 }] },
            { day: "土曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2 }, { name: "ロシアンツイスト", reps: 20, sets: 2 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
        }
      } else if (frequency === "5回/週") {
        if (volume === "多いのがいい！") {
            createMenu("5回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5 }, { name: "スクワット", reps: 15, sets: 5 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5 }, { name: "腕立て伏せ", reps: 20, sets: 5 }] },
            { day: "水曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5 }, { name: "ロシアンツイスト", reps: 20, sets: 5 }] },
            { day: "木曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5 }, { name: "スクワット", reps: 15, sets: 5 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5 }, { name: "ディップス（椅子）", reps: 20, sets: 5 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
          } else if (volume === "普通がいいかな〜") {
            createMenu("5回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3 }, { name: "スクワット", reps: 15, sets: 3 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3 }, { name: "腕立て伏せ", reps: 20, sets: 3 }] },
            { day: "水曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3 }, { name: "ロシアンツイスト", reps: 20, sets: 3 }] },
            { day: "木曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3 }, { name: "スクワット", reps: 15, sets: 3 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3 }, { name: "ディップス（椅子）", reps: 20, sets: 3 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
          } else {
            createMenu("5回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2 }, { name: "スクワット", reps: 15, sets: 2 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2 }, { name: "腕立て伏せ", reps: 20, sets: 2 }] },
            { day: "水曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2 }, { name: "ロシアンツイスト", reps: 20, sets: 2 }] },
            { day: "木曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2 }, { name: "スクワット", reps: 15, sets: 2 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2 }, { name: "ディップス（椅子）", reps: 20, sets: 2 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
        }
      } else if (frequency === "4回/週") {
        if (volume === "多いのがいい！") {
            createMenu("4回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5 }, { name: "腕立て伏せ", reps: 20, sets: 5 }] },
            { day: "火曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5 }, { name: "スクワット", reps: 15, sets: 5 }] },
            { day: "木曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5 }, { name: "ロシアンツイスト", reps: 20, sets: 5 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5 }, { name: "ディップス（椅子）", reps: 20, sets: 5 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
          } else if (volume === "普通がいいかな〜") {
            createMenu("4回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3 }, { name: "腕立て伏せ", reps: 20, sets: 3 }] },
            { day: "火曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3 }, { name: "スクワット", reps: 15, sets: 3 }] },
            { day: "木曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3 }, { name: "ロシアンツイスト", reps: 20, sets: 3 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3 }, { name: "ディップス（椅子）", reps: 20, sets: 3 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
          } else {
            createMenu("4回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2 }, { name: "腕立て伏せ", reps: 20, sets: 2 }] },
            { day: "火曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2 }, { name: "スクワット", reps: 15, sets: 2 }] },
            { day: "木曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2 }, { name: "ロシアンツイスト", reps: 20, sets: 2 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2 }, { name: "ディップス（椅子）", reps: 20, sets: 2 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
        }
      } else if (frequency === "3回/週") {
        if (volume === "多いのがいい！") {
            createMenu("3回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5 }, { name: "スクワット", reps: 15, sets: 5 }] },
            { day: "水曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5 }, { name: "腕立て伏せ", reps: 20, sets: 5 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5 }, { name: "ロシアンツイスト", reps: 20, sets: 5 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
          } else if (volume === "普通がいいかな〜") {
            createMenu("3回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3 }, { name: "スクワット", reps: 15, sets: 3 }] },
            { day: "水曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3 }, { name: "腕立て伏せ", reps: 20, sets: 3 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3 }, { name: "ロシアンツイスト", reps: 20, sets: 3 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
          } else {
            createMenu("3回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2 }, { name: "スクワット", reps: 15, sets: 2 }] },
            { day: "水曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2 }, { name: "腕立て伏せ", reps: 20, sets: 2 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2 }, { name: "ロシアンツイスト", reps: 20, sets: 2 }, { name: "ウォーキング", duration: "20分" }] },

            ]);
        }
      }
    }
  } else {
    suggestedMenu = [];
  }

  return suggestedMenu;
};