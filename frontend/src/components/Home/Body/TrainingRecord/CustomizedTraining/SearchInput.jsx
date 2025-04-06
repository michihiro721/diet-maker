import React from "react";
import PropTypes from 'prop-types';
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

SearchInput.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired
};

export default SearchInput;