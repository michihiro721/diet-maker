export const getTrainingMenu2 = (gender, gymType, frequency, volume) => {
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
            const exerciseInfo = getExerciseInfo(exercise.name, exercise.workout_id);
            return {
              key: `${itemIndex}-${exerciseIndex}`,
              name: exercise.name,
              duration: exercise.duration,
              workout_id: exercise.workout_id,
              icon: exerciseInfo.icon,
              tutorialUrl: exerciseInfo.url
            };
          } else {
            const exerciseInfo = getExerciseInfo(exercise.name, exercise.workout_id);
            return {
              key: `${itemIndex}-${exerciseIndex}`,
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: 0, // 重量は0で初期化
              workout_id: exercise.workout_id,
              icon: exerciseInfo.icon,
              tutorialUrl: exerciseInfo.url
            };
          }
        })
      });
    });
  };

  // 種目ごとにやり方が載っているサイトのURLを設定
  const getExerciseInfo = (exerciseName, workoutId) => {
    const exerciseConfig = {
      "ベンチプレス": {
        url: "https://realworkout.jp/column/training/correctform-benchpress/"
      },
      "インクラインダンベルプレス": {
        url: "https://belegend.jp/training/free_weight/dumbbell/10430/"
      },
      "ダンベルフライ": {
        url: "https://ufit.co.jp/blogs/training/dumbbell-fly?srsltid=AfmBOoraUuRdf7uUTDCk0m5UPCWDNgR0-Yhvg3j7LwiyiZ1KlpXEyzu5"
      },
      "デットリフト": {
        url: "https://vrtxsports.co.jp/blogs/training/how-to-perform-right-form-of-dead-lift-with-vrtx?srsltid=AfmBOoqCv7S9kl4ST7M8_vIXirgcTvF-5b6c8_LTWHsgXhD8jNqN4--Q"
      },
      "ダンベルローイング": {
        url: "https://column.valx.jp/4147/"
      },
      "懸垂": {
        url: "https://melos.media/training/42236/"
      },
      "バーベルスクワット": {
        url: "https://ufit.co.jp/blogs/training/barbell-squat?srsltid=AfmBOopNbef7SRgy48K1GHvZ88XfjtFmiX51CYspQHAkOLiYT3MaaNXt"
      },
      "ブルガリアンスクワット": {
        url: "https://ufit.co.jp/blogs/training/bulgariansquats?srsltid=AfmBOoq6pdkF0l0kgLnCXVVCGXuE6rLe23E0hJZsaNlae0TRRE8IyXUA"
      },
      "スクワット": {
        url: "https://www.shopjapan.co.jp/diet_labo/legs/article_018/"
      },
      "ミリタリープレス": {
        url: "https://belegend.jp/article/communication/13620/"
      },
      "ダンベルショルダープレス": {
        url: "https://belegend.jp/article/communication/9594/"
      },
      "サイドレイズ": {
        url: "https://drtraining.jp/media/32488/"
      },
      "バーベルカール": {
        url: "https://charisfit.net/wp/barbell-curl"
      },
      "インクラインダンベルカール": {
        url: "https://ufit.co.jp/blogs/training/incline_dumbbell_curl?srsltid=AfmBOopf2UmjdmXjMaMw_PdWe847b3Gg6PTqFqz9Hwz38b9eS-pRLOSc"
      },
      "ディップス": {
        url: "https://ufit.co.jp/blogs/training/dips?srsltid=AfmBOop8ZQWS0uT7Ie39wvMbz8PaJQ1qQsT5TLlnyDWW9Ys8eVClrapK"
      },
      "クランチ": {
        url: "https://fitrize.jp/crunch/"
      },
      "レッグレイズ": {
        url: "https://melos.media/training/117150/"
      }
    };

    const config = exerciseConfig[exerciseName] || {
      url: `https://example.com/exercise-tutorial/${workoutId}`
    };

    return {
      icon: "FaQuestionCircle",
      url: config.url
    };
  };

  // **条件ごとに適切なメニューを決定**
  if (gender === "男性") {
    if (gymType === "ホームジム1") {
      if (frequency === "6回/週") {
        if (volume === "多いのがいい！") {
            createMenu("6回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 5, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 5, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 5, workout_id: 5 }] },
            { day: "火曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 5, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 5, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 5, workout_id: 19 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 5, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 5, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 5, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ミリタリープレス", reps: 10, sets: 5, workout_id: 30 }, { name: "ダンベルショルダープレス", reps: 10, sets: 5, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 5, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "バーベルカール", reps: 10, sets: 5, workout_id: 37 }, { name: "インクラインダンベルカール", reps: 10, sets: 5, workout_id: 48 }, { name: "ディップス", reps: 15, sets: 5, workout_id: 9 }] },
            { day: "土曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5, workout_id: 60 }, { name: "レッグレイズ", reps: 20, sets: 5, workout_id: 61 }] },
            ]);
            } else if (volume === "普通がいいかな〜") {
            createMenu("6回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 3, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 3, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 3, workout_id: 5 }] },
            { day: "火曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 3, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 3, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 3, workout_id: 19 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 3, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 3, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 3, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ミリタリープレス", reps: 10, sets: 3, workout_id: 30 }, { name: "ダンベルショルダープレス", reps: 10, sets: 3, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 3, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "バーベルカール", reps: 10, sets: 3, workout_id: 37 }, { name: "インクラインダンベルカール", reps: 10, sets: 3, workout_id: 48 }, { name: "ディップス", reps: 15, sets: 3, workout_id: 9 }] },
            { day: "土曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3, workout_id: 60 }, { name: "レッグレイズ", reps: 20, sets: 3, workout_id: 61 }] },
            ]);
            } else {
            createMenu("6回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 2, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 2, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 2, workout_id: 5 }] },
            { day: "火曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 2, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 2, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 2, workout_id: 19 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 2, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 2, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 2, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ミリタリープレス", reps: 10, sets: 2, workout_id: 30 }, { name: "ダンベルショルダープレス", reps: 10, sets: 2, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 2, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "バーベルカール", reps: 10, sets: 2, workout_id: 37 }, { name: "インクラインダンベルカール", reps: 10, sets: 2, workout_id: 48 }, { name: "ディップス", reps: 15, sets: 2, workout_id: 9 }] },
            { day: "土曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2, workout_id: 60 }, { name: "レッグレイズ", reps: 20, sets: 2, workout_id: 61 }] },
            ]);
        }
      } else if (frequency === "5回/週") {
        if (volume === "多いのがいい！") {
            createMenu("5回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 5, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 5, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 5, workout_id: 5 }] },
            { day: "火曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 5, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 5, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 5, workout_id: 19 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 5, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 5, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 5, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ミリタリープレス", reps: 10, sets: 5, workout_id: 30 }, { name: "ダンベルショルダープレス", reps: 10, sets: 5, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 5, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "バーベルカール", reps: 10, sets: 5, workout_id: 37 }, { name: "インクラインダンベルカール", reps: 10, sets: 5, workout_id: 48 }, { name: "ディップス", reps: 15, sets: 5, workout_id: 9 }] },
            ]);
            } else if (volume === "普通がいいかな〜") {
            createMenu("5回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 3, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 3, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 3, workout_id: 5 }] },
            { day: "火曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 3, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 3, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 3, workout_id: 19 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 3, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 3, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 3, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ミリタリープレス", reps: 10, sets: 3, workout_id: 30 }, { name: "ダンベルショルダープレス", reps: 10, sets: 3, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 3, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "バーベルカール", reps: 10, sets: 3, workout_id: 37 }, { name: "インクラインダンベルカール", reps: 10, sets: 3, workout_id: 48 }, { name: "ディップス", reps: 15, sets: 3, workout_id: 9 }] },
            ]);
            } else {
            createMenu("5回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 2, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 2, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 2, workout_id: 5 }] },
            { day: "火曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 2, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 2, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 2, workout_id: 19 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 2, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 2, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 2, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ミリタリープレス", reps: 10, sets: 2, workout_id: 30 }, { name: "ダンベルショルダープレス", reps: 10, sets: 2, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 2, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "バーベルカール", reps: 10, sets: 2, workout_id: 37 }, { name: "インクラインダンベルカール", reps: 10, sets: 2, workout_id: 48 }, { name: "ディップス", reps: 15, sets: 2, workout_id: 9 }] },
            ]);
        }
      } else if (frequency === "4回/週") {
        if (volume === "多いのがいい！") {
            createMenu("4回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 5, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 5, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 5, workout_id: 5 }] },
            { day: "火曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 5, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 5, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 5, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 5, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 5, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 5, workout_id: 19 }] },
            { day: "金曜日", exercises: [{ name: "ミリタリープレス", reps: 10, sets: 5, workout_id: 30 }, { name: "ダンベルショルダープレス", reps: 10, sets: 5, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 5, workout_id: 31 }] },
            ]);
            } else if (volume === "普通がいいかな〜") {
            createMenu("4回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 3, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 3, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 3, workout_id: 5 }] },
            { day: "火曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 3, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 3, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 3, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 3, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 3, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 3, workout_id: 19 }] },
            { day: "金曜日", exercises: [{ name: "ミリタリープレス", reps: 10, sets: 3, workout_id: 30 }, { name: "ダンベルショルダープレス", reps: 10, sets: 3, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 3, workout_id: 31 }] },
            ]);
            } else {
            createMenu("4回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 2, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 2, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 2, workout_id: 5 }] },
            { day: "火曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 2, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 2, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 2, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 2, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 2, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 2, workout_id: 19 }] },
            { day: "金曜日", exercises: [{ name: "ミリタリープレス", reps: 10, sets: 2, workout_id: 30 }, { name: "ダンベルショルダープレス", reps: 10, sets: 2, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 2, workout_id: 31 }] },
            ]);
        }
      } else if (frequency === "3回/週") {
        if (volume === "多いのがいい！") {
            createMenu("3回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 5, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 5, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 5, workout_id: 5 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 5, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 5, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 5, workout_id: 51 }] },
            { day: "金曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 5, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 5, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 5, workout_id: 19 }] },
            ]);
            } else if (volume === "普通がいいかな〜") {
            createMenu("3回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 3, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 3, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 3, workout_id: 5 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 3, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 3, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 3, workout_id: 51 }] },
            { day: "金曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 3, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 3, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 3, workout_id: 19 }] },
            ]);
            } else {
            createMenu("3回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ベンチプレス", reps: 10, sets: 2, workout_id: 1 }, { name: "インクラインダンベルプレス", reps: 10, sets: 2, workout_id: 4 }, { name: "ダンベルフライ", reps: 10, sets: 2, workout_id: 5 }] },
            { day: "水曜日", exercises: [{ name: "バーベルスクワット", reps: 10, sets: 2, workout_id: 50 }, { name: "ブルガリアンスクワット", reps: 10, sets: 2, workout_id: 56 }, { name: "スクワット", reps: 10, sets: 2, workout_id: 51 }] },
            { day: "金曜日", exercises: [{ name: "デットリフト", reps: 10, sets: 2, workout_id: 18 }, { name: "ダンベルローイング", reps: 10, sets: 2, workout_id: 21 }, { name: "懸垂", reps: 10, sets: 2, workout_id: 19 }] },
            ]);
        }
      }
    }
  } else {
    suggestedMenu = [];
  }

  return suggestedMenu;
};