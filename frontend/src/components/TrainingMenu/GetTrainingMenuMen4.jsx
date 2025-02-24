export const getTrainingMenu4 = (gender, gymType, frequency, volume) => {
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
  if (gender === "男性") {
    if (gymType === "ホームジム3") {
      if (frequency === "6回/週") {
        if (volume === "多いのがいい！") {
            createMenu("6回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ディップス", reps: 10, sets: 5 }, { name: "腕立て伏せ", reps: 20, sets: 5 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 10, sets: 10 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 5 }, { name: "スクワット", reps: 20, sets: 5 }] },
            { day: "木曜日", exercises: [{ name: "ディップス", reps: 10, sets: 5 }, { name: "腕立て伏せ", reps: 20, sets: 5 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 10 }] },
            { day: "土曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5 }, { name: "レッグレイズ", reps: 20, sets: 5 }] },

            ]);
          } else if (volume === "普通がいいかな〜") {
            createMenu("6回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ディップス", reps: 10, sets: 3 }, { name: "腕立て伏せ", reps: 20, sets: 3 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 10, sets: 5 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 3 }, { name: "スクワット", reps: 20, sets: 3 }] },
            { day: "木曜日", exercises: [{ name: "ディップス", reps: 10, sets: 3 }, { name: "腕立て伏せ", reps: 20, sets: 3 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 5 }] },
            { day: "土曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3 }, { name: "レッグレイズ", reps: 20, sets: 3 }] },

            ]);
          } else {
            createMenu("6回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ディップス", reps: 10, sets: 2 }, { name: "腕立て伏せ", reps: 20, sets: 2 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 10, sets: 3 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 2 }, { name: "スクワット", reps: 20, sets: 2 }] },
            { day: "木曜日", exercises: [{ name: "ディップス", reps: 10, sets: 2 }, { name: "腕立て伏せ", reps: 20, sets: 2 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 3 }] },
            { day: "土曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2 }, { name: "レッグレイズ", reps: 20, sets: 2 }] },

            ]);
        }
      } else if (frequency === "5回/週") {
        if (volume === "多いのがいい！") {
            createMenu("5回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ディップス", reps: 10, sets: 5 }, { name: "腕立て伏せ", reps: 20, sets: 5 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 10, sets: 10 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 5 }, { name: "スクワット", reps: 20, sets: 5 }] },
            { day: "木曜日", exercises: [{ name: "ディップス", reps: 10, sets: 5 }, { name: "腕立て伏せ", reps: 20, sets: 5 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 10 }] },

            ]);
          } else if (volume === "普通がいいかな〜") {
            createMenu("5回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ディップス", reps: 10, sets: 3 }, { name: "腕立て伏せ", reps: 20, sets: 3 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 10, sets: 5 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 3 }, { name: "スクワット", reps: 20, sets: 3 }] },
            { day: "木曜日", exercises: [{ name: "ディップス", reps: 10, sets: 3 }, { name: "腕立て伏せ", reps: 20, sets: 3 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 5 }] },

            ]);
          } else {
            createMenu("5回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ディップス", reps: 10, sets: 2 }, { name: "腕立て伏せ", reps: 20, sets: 2 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 10, sets: 3 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 2 }, { name: "スクワット", reps: 20, sets: 2 }] },
            { day: "木曜日", exercises: [{ name: "ディップス", reps: 10, sets: 2 }, { name: "腕立て伏せ", reps: 20, sets: 2 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 3 }] },

            ]);
        }
      } else if (frequency === "4回/週") {
        if (volume === "多いのがいい！") {
            createMenu("4回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ディップス", reps: 10, sets: 5 }, { name: "腕立て伏せ", reps: 20, sets: 5 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 10, sets: 10 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 5 }, { name: "スクワット", reps: 20, sets: 5 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 5 }, { name: "ディップス", reps: 10, sets: 5 }] },

            ]);
          } else if (volume === "普通がいいかな〜") {
            createMenu("4回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ディップス", reps: 10, sets: 3 }, { name: "腕立て伏せ", reps: 20, sets: 3 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 10, sets: 5 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 3 }, { name: "スクワット", reps: 20, sets: 3 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 3 }, { name: "ディップス", reps: 10, sets: 3 }] },

            ]);
          } else {
            createMenu("4回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ディップス", reps: 10, sets: 2 }, { name: "腕立て伏せ", reps: 20, sets: 2 }] },
            { day: "火曜日", exercises: [{ name: "懸垂", reps: 10, sets: 2 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 2 }, { name: "スクワット", reps: 20, sets: 2 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 2 }, { name: "ディップス", reps: 10, sets: 2 }] },

            ]);
        }
      } else if (frequency === "3回/週") {
        if (volume === "多いのがいい！") {
            createMenu("3回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "懸垂", reps: 10, sets: 5 }, { name: "ディップス", reps: 10, sets: 5 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 5 }, { name: "スクワット", reps: 20, sets: 5 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 5 }, { name: "ディップス", reps: 10, sets: 5 }] },

            ]);
          } else if (volume === "普通がいいかな〜") {
            createMenu("3回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "懸垂", reps: 10, sets: 3 }, { name: "ディップス", reps: 10, sets: 3 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 3 }, { name: "スクワット", reps: 20, sets: 3 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 3 }, { name: "ディップス", reps: 10, sets: 3 }] },

            ]);
          } else {
            createMenu("3回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "懸垂", reps: 10, sets: 2 }, { name: "ディップス", reps: 10, sets: 2 }] },
            { day: "水曜日", exercises: [{ name: "ブルガリアンスクワット", reps: 10, sets: 2 }, { name: "スクワット", reps: 20, sets: 2 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 10, sets: 2 }, { name: "ディップス", reps: 10, sets: 2 }] },

            ]);
        }
      }
    }
  } else {
    suggestedMenu = [];
  }

  return suggestedMenu;
};