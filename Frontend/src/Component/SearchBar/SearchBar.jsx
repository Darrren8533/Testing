// SearchBar.js
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import '../SearchBar/SearchBar.css';

const SearchBar = ({ value, onChange, placeholder }) => {
    return (
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  };

export default SearchBar;
