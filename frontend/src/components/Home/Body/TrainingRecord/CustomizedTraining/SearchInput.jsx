// Reactをインポート
import React from "react";
// SearchInput用のCSSファイルをインポート
import './styles/SearchInput.css';

// SearchInputコンポーネントの定義
const SearchInput = ({ searchTerm, setSearchTerm }) => {
  return (
    // 検索入力フィールド
    <input
      type="text"
      id="exercise-search"
      name="exercise-search"
      placeholder="種目を検索"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-input"
    />
  );
};

// SearchInputコンポーネントをエクスポート
export default SearchInput;