export const getTrainingMenu3Woman = (gender, gymType, frequency, volume) => {
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
      "ヒップスラスト": {
        url: "https://qool.jp/200401"
      },
      "ブルガリアンスクワット": {
        url: "https://ufit.co.jp/blogs/training/bulgariansquats?srsltid=AfmBOoq6pdkF0l0kgLnCXVVCGXuE6rLe23E0hJZsaNlae0TRRE8IyXUA"
      },
      "ダンベルスクワット": {
        url: "https://ufit.co.jp/blogs/training/dumbbell-squat?srsltid=AfmBOoobvD3sKhLaObYYhx0zJnm5WS2pe3IQ3Il-HAH6e3BC4X9WrSSX"
      },
      "キックバック": {
        url: "https://evigym.com/howto-training/triceps-kick-back"
      },
      "ダンベルローイング": {
        url: "https://column.valx.jp/4147/"
      },
      "スクワット": {
        url: "https://www.shopjapan.co.jp/diet_labo/legs/article_018/"
      },
      "ダンベルショルダープレス": {
        url: "https://belegend.jp/article/communication/9594/"
      },
      "サイドレイズ": {
        url: "https://drtraining.jp/media/32488/"
      },
      "クランチ": {
        url: "https://fitrize.jp/crunch/"
      },
      "ロシアンツイスト": {
        url: "https://kekefit.com/russian-twist/"
      },
      "腕立て伏せ": {
        url: "https://nakayamakinnikun.com/blogs/blog/weighttraining-push-up?srsltid=AfmBOoqRZn__h_WqYU81J5wCgYWElmeg4cUDB6l43sqheeWuR4dUDI80"
      },
      "デットリフト": {
        url: "https://vrtxsports.co.jp/blogs/training/how-to-perform-right-form-of-dead-lift-with-vrtx?srsltid=AfmBOoqCv7S9kl4ST7M8_vIXirgcTvF-5b6c8_LTWHsgXhD8jNqN4--Q"
      },
      "ベントオーバーロウ": {
        url: "https://wellulu.com/moderate-exercise/16584/"
      },
      "ウォーキング": {
        url: "https://halmek.co.jp/beauty/c/healthr/2987"
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
  if (gender === "女性") {
    if (gymType === "ホームジム2") {
      if (frequency === "6回/週") {
        if (volume === "多いのがいい！") {
            createMenu("6回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 5, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 5, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 5, workout_id: 21 }] },
            { day: "水曜日", exercises: [{ name: "ダンベルスクワット", reps: 10, sets: 5, workout_id: 51 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 5, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ダンベルショルダープレス", reps: 15, sets: 5, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 5, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 5, workout_id: 63 }] },
            { day: "土曜日", exercises: [{ name: "ヒップスラスト", reps: 12, sets: 5, workout_id: 58 }, { name: "腕立て伏せ", reps: 10, sets: 5, workout_id: 16 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else if (volume === "普通がいいかな〜") {
            createMenu("6回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 3, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 3, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 3, workout_id: 21 }] },
            { day: "水曜日", exercises: [{ name: "ダンベルスクワット", reps: 10, sets: 3, workout_id: 51 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 3, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ダンベルショルダープレス", reps: 15, sets: 3, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 3, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 3, workout_id: 63 }] },
            { day: "土曜日", exercises: [{ name: "ヒップスラスト", reps: 12, sets: 3, workout_id: 58 }, { name: "腕立て伏せ", reps: 10, sets: 3, workout_id: 16 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else {
            createMenu("6回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 2, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 2, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 2, workout_id: 21 }] },
            { day: "水曜日", exercises: [{ name: "ダンベルスクワット", reps: 10, sets: 2, workout_id: 51 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 2, workout_id: 51 }] },
            { day: "木曜日", exercises: [{ name: "ダンベルショルダープレス", reps: 15, sets: 2, workout_id: 35 }, { name: "サイドレイズ", reps: 15, sets: 2, workout_id: 31 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 2, workout_id: 63 }] },
            { day: "土曜日", exercises: [{ name: "ヒップスラスト", reps: 12, sets: 2, workout_id: 58 }, { name: "腕立て伏せ", reps: 10, sets: 2, workout_id: 16 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
        }
      } else if (frequency === "5回/週") {
        if (volume === "多いのがいい！") {
            createMenu("5回/週のハードメニュー", [
          { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 5, workout_id: 51 }] },
          { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 5, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 5, workout_id: 21 }] },
          { day: "水曜日", exercises: [{ name: "ダンベルスクワット", reps: 10, sets: 5, workout_id: 51 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 5, workout_id: 51 }] },
          { day: "木曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 5, workout_id: 63 }] },
          { day: "金曜日", exercises: [{ name: "ヒップスラスト", reps: 12, sets: 5, workout_id: 58 }, { name: "腕立て伏せ", reps: 10, sets: 5, workout_id: 16 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
          } else if (volume === "普通がいいかな〜") {
            createMenu("5回/週の標準メニュー", [
          { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 3, workout_id: 51 }] },
          { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 3, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 3, workout_id: 21 }] },
          { day: "水曜日", exercises: [{ name: "ダンベルスクワット", reps: 10, sets: 3, workout_id: 51 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 3, workout_id: 51 }] },
          { day: "木曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 3, workout_id: 63 }] },
          { day: "金曜日", exercises: [{ name: "ヒップスラスト", reps: 12, sets: 3, workout_id: 58 }, { name: "腕立て伏せ", reps: 10, sets: 3, workout_id: 16 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
          } else {
            createMenu("5回/週の軽めメニュー", [
          { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 2, workout_id: 51 }] },
          { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 2, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 2, workout_id: 21 }] },
          { day: "水曜日", exercises: [{ name: "ダンベルスクワット", reps: 10, sets: 2, workout_id: 51 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 2, workout_id: 51 }] },
          { day: "木曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 2, workout_id: 63 }] },
          { day: "金曜日", exercises: [{ name: "ヒップスラスト", reps: 12, sets: 2, workout_id: 58 }, { name: "腕立て伏せ", reps: 10, sets: 2, workout_id: 16 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
        }
      } else if (frequency === "4回/週") {
        if (volume === "多いのがいい！") {
            createMenu("4回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 5, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 5, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 5, workout_id: 21 }] },
            { day: "木曜日", exercises: [{ name: "ダンベルスクワット", reps: 10, sets: 5, workout_id: 51 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 5, workout_id: 51 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 5, workout_id: 63 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else if (volume === "普通がいいかな〜") {
            createMenu("4回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 3, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 3, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 3, workout_id: 21 }] },
            { day: "木曜日", exercises: [{ name: "ダンベルスクワット", reps: 10, sets: 3, workout_id: 51 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 3, workout_id: 51 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 3, workout_id: 63 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
            } else {
            createMenu("4回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 2, workout_id: 51 }] },
            { day: "火曜日", exercises: [{ name: "キックバック", reps: 15, sets: 2, workout_id: 44 }, { name: "ダンベルローイング", reps: 12, sets: 2, workout_id: 21 }] },
            { day: "木曜日", exercises: [{ name: "ダンベルスクワット", reps: 10, sets: 2, workout_id: 51 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "スクワット", reps: 15, sets: 2, workout_id: 51 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 2, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 2, workout_id: 63 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
        }
      } else if (frequency === "3回/週") {
        if (volume === "多いのがいい！") {
            createMenu("3回/週のハードメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 5, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 5, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 5, workout_id: 51 }] },
            { day: "水曜日", exercises: [{ name: "デットリフト", reps: 12, sets: 5, workout_id: 18 }, { name: "ベントオーバーロウ", reps: 12, sets: 5, workout_id: 20 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 5, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 5, workout_id: 63 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
          } else if (volume === "普通がいいかな〜") {
            createMenu("3回/週の標準メニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 3, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 3, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 3, workout_id: 51 }] },
            { day: "水曜日", exercises: [{ name: "デットリフト", reps: 12, sets: 3, workout_id: 18 }, { name: "ベントオーバーロウ", reps: 12, sets: 3, workout_id: 20 }] },
            { day: "金曜日", exercises: [{ name: "クランチ", reps: 20, sets: 3, workout_id: 60 }, { name: "ロシアンツイスト", reps: 20, sets: 3, workout_id: 63 }, { name: "ウォーキング", duration: "20分", workout_id: 69 }] },
            ]);
          } else {
            createMenu("3回/週の軽めメニュー", [
            { day: "月曜日", exercises: [{ name: "ヒップスラスト", reps: 10, sets: 2, workout_id: 58 }, { name: "ブルガリアンスクワット", reps: 12, sets: 2, workout_id: 56 }, { name: "ダンベルスクワット", reps: 12, sets: 2, workout_id: 51 }] },
            { day: "水曜日", exercises: [{ name: "デットリフト", reps: 12, sets: 2, workout_id: 18 }, { name: "ベントオーバーロウ", reps: 12, sets: 2, workout_id: 20 }] },
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