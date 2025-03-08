export const getTrainingMenu5Woman = (gender, gymType, frequency, volume) => {
  let suggestedMenu = [];

  const createMenu = (title, menuItems) => {
    const dayIndexMap = {
      "月曜日": 0,
      "火曜日": 1,
      "水曜日": 2,
      "木曜日": 3,
      "金曜日": 4,
      "土曜日": 5,
      "日曜日": 6
    };

    menuItems.forEach((item, itemIndex) => {
      const dayIndex = dayIndexMap[item.day];
      if (!suggestedMenu[dayIndex]) {
        suggestedMenu[dayIndex] = {
          title: item.day,
          items: []
        };
      }
      suggestedMenu[dayIndex].items.push({
        day: item.day,
        exercises: item.exercises.map((exercise, exerciseIndex) => {
          // 有酸素運動（durationあり）とそれ以外で処理を分ける
          if (exercise.duration) {
            return {
              key: `${itemIndex}-${exerciseIndex}`,
              name: exercise.name,
              duration: exercise.duration,
              workout_id: exercise.workout_id
            };
          } else {
            return {
              key: `${itemIndex}-${exerciseIndex}`,
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: 0, // 重量は0で初期化
              workout_id: exercise.workout_id
            };
          }
        })
      });
    });
  };

  // **条件ごとに適切なメニューを決定**
  if (gender === "女性") {
    if (gymType === "ホームジム4") {
      if (frequency === "6回/週") {
        if (volume === "多いのがいい！") {
            createMenu("6回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 5, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 5, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 5, workout_id: 21 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 5, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 5, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ダンベルショルダープレス", reps: 15, sets: 5, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 5, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 5, workout_id: 63 }] },
            { day: "土曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5, workout_id: 19 }, { name: "レッグレイズ", reps: 10, sets: 5, workout_id: 61 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else if (volume === "普通がいいかな〜") {
            createMenu("6回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 3, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 3, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 3, workout_id: 21 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 3, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 3, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ダンベルショルダープレス", reps: 15, sets: 3, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 3, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 3, workout_id: 63 }] },
            { day: "土曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3, workout_id: 19 }, { name: "レッグレイズ", reps: 10, sets: 3, workout_id: 61 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else {
            createMenu("6回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 2, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 2, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 2, workout_id: 21 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 2, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 2, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ダンベルショルダープレス", reps: 15, sets: 2, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 2, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 2, workout_id: 63 }] },
            { day: "土曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2, workout_id: 19 }, { name: "レッグレイズ", reps: 10, sets: 2, workout_id: 61 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
        }
      } else if (frequency === "5回/週") {
        if (volume === "多いのがいい！") {
            createMenu("5回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 5, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 5, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 5, workout_id: 21 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 5, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 5, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5, workout_id: 19 }, { name: "レッグレイズ", reps: 10, sets: 5, workout_id: 61 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 5, workout_id: 63 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else if (volume === "普通がいいかな〜") {
            createMenu("5回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 3, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 3, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 3, workout_id: 21 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 3, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 3, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3, workout_id: 19 }, { name: "レッグレイズ", reps: 10, sets: 3, workout_id: 61 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 3, workout_id: 63 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else {
            createMenu("5回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 2, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 2, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 2, workout_id: 21 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 2, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 2, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2, workout_id: 19 }, { name: "レッグレイズ", reps: 10, sets: 2, workout_id: 61 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 2, workout_id: 63 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
        }
      } else if (frequency === "4回/週") {
        if (volume === "多いのがいい！") {
            createMenu("4回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5, workout_id: 19 }, { name: "腕立て伏せ", reps: 20, sets: 5, workout_id: 16 }] },
            { day: "火曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 5, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 5, workout_id: 63 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5, workout_id: 19 }, { name: "ディップス（椅子）", reps: 20, sets: 5, workout_id: 10 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else if (volume === "普通がいいかな〜") {
            createMenu("4回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3, workout_id: 19 }, { name: "腕立て伏せ", reps: 20, sets: 3, workout_id: 16 }] },
            { day: "火曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 3, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 3, workout_id: 63 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3, workout_id: 19 }, { name: "ディップス（椅子）", reps: 20, sets: 3, workout_id: 10 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else {
            createMenu("4回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2, workout_id: 19 }, { name: "腕立て伏せ", reps: 20, sets: 2, workout_id: 16 }] },
            { day: "火曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 2, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 2, workout_id: 63 }] },
            { day: "金曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2, workout_id: 19 }, { name: "ディップス（椅子）", reps: 20, sets: 2, workout_id: 10 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
        }
      } else if (frequency === "3回/週") {
        if (volume === "多いのがいい！") {
            createMenu("3回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 5, workout_id: 51 }] },
            { day: "水曜日", exercises: [{ name: "懸垂", reps: 5, sets: 5, workout_id: 19 }, { name: "腕立て伏せ", reps: 20, sets: 5, workout_id: 16 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 5, workout_id: 63 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else if (volume === "普通がいいかな〜") {
            createMenu("3回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 3, workout_id: 51 }] },
            { day: "水曜日", exercises: [{ name: "懸垂", reps: 5, sets: 3, workout_id: 19 }, { name: "腕立て伏せ", reps: 20, sets: 3, workout_id: 16 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 3, workout_id: 63 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else {
            createMenu("3回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 2, workout_id: 51 }] },
            { day: "水曜日", exercises: [{ name: "懸垂", reps: 5, sets: 2, workout_id: 19 }, { name: "腕立て伏せ", reps: 20, sets: 2, workout_id: 16 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 2, workout_id: 63 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
        }
      }
    }
  } else {
    suggestedMenu = [];
  }

  return suggestedMenu;
};