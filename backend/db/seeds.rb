# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

workouts = [
  { name: "ベンチプレス", category: "胸" },
  { name: "インクラインベンチプレス", category: "胸" },
  { name: "ダンベルプレス", category: "胸" },
  { name: "インクラインダンベルプレス", category: "胸" },
  { name: "ダンベルフライ", category: "胸" },
  { name: "インクラインダンベルフライ", category: "胸" },
  { name: "ケーブルクロスオーバー", category: "胸" },
  { name: "ペックフライ", category: "胸" },
  { name: "ディップス", category: "胸" },
  { name: "ディップス（椅子）", category: "胸" },
  { name: "チェストプレス", category: "胸" },
  { name: "ダンベルプルオーバー", category: "胸" },
  { name: "ディクラインベンチプレス", category: "胸" },
  { name: "ディクラインダンベルプレス", category: "胸" },
  { name: "ディクラインダンベルフライ", category: "胸" },
  { name: "腕立て伏せ", category: "胸" },
  { name: "ラットプルダウン", category: "背中" },
  { name: "デットリフト", category: "背中" },
  { name: "懸垂", category: "背中" },
  { name: "ベントオーバーロウ", category: "背中" },
  { name: "ダンベルローイング", category: "背中" },
  { name: "シーテッドロー", category: "背中" },
  { name: "ワンハンドダンベルロウ", category: "背中" },
  { name: "Tバーロウ", category: "背中" },
  { name: "プルオーバー", category: "背中" },
  { name: "バックエクステンション", category: "背中" },
  { name: "フェイスプル", category: "背中" },
  { name: "シュラッグ", category: "背中" },
  { name: "ダンベルリアデルトフライ", category: "背中" },
  { name: "ミリタリープレス", category: "肩" },
  { name: "サイドレイズ", category: "肩" },
  { name: "リアレイズ", category: "肩" },
  { name: "アップライトロウ", category: "肩" },
  { name: "アーノルドプレス", category: "肩" },
  { name: "ダンベルショルダープレス", category: "肩" },
  { name: "フロントレイズ", category: "肩" },
  { name: "バーベルカール", category: "腕" },
  { name: "アームカール", category: "腕" },
  { name: "トライセプスエクステンション", category: "腕" },
  { name: "ダンベルカール", category: "腕" },
  { name: "プリーチャーカール", category: "腕" },
  { name: "ハンマーカール", category: "腕" },
  { name: "フレンチプレス", category: "腕" },
  { name: "キックバック", category: "腕" },
  { name: "リストカール", category: "腕" },
  { name: "リバースリストカール", category: "腕" },
  { name: "スカルクラッシャー", category: "腕" },
  { name: "インクラインダンベルカール", category: "腕" },
  { name: "ケーブルプルオーバー", category: "腕" },
  { name: "バーベルスクワット", category: "脚" },
  { name: "スクワット", category: "脚" },
  { name: "レッグプレス", category: "脚" },
  { name: "カーフレイズ", category: "脚" },
  { name: "レッグエクステンション", category: "脚" },
  { name: "レッグカール", category: "脚" },
  { name: "ブルガリアンスクワット", category: "脚" },
  { name: "シシースクワット", category: "脚" },
  { name: "ヒップスラスト", category: "脚" },
  { name: "アブダクション", category: "脚" },
  { name: "クランチ", category: "腹筋" },
  { name: "レッグレイズ", category: "腹筋" },
  { name: "シットアップ", category: "腹筋" },
  { name: "ロシアンツイスト", category: "腹筋" },
  { name: "ハンギングレッグレイズ", category: "腹筋" },
  { name: "アブドミナルクランチ", category: "腹筋" },
  { name: "アブローラー", category: "腹筋" },
  { name: "トレッドミル", category: "有酸素" },
  { name: "ランニング", category: "有酸素" },
  { name: "ウォーキング", category: "有酸素" },
  { name: "エアロバイク", category: "有酸素" },
  { name: "ストレッチ", category: "有酸素" },
  { name: "水中ウォーキング", category: "有酸素" },
  { name: "縄跳び", category: "有酸素" },
  { name: "階段", category: "有酸素" }
]

workouts.each do |workout|
  Workout.find_or_create_by(name: workout[:name]) do |w|
    w.category = workout[:category]
  end
end
