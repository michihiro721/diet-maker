import React from "react";
import './styles/SearchInput.css';

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

export default SearchInput;