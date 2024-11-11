import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../../Component/ActionDropdown/ActionDropdown.css';

const ActionDropdown = ({ position, items, onAction }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onAction(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onAction]);

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate if dropdown will overflow the right or bottom edge
  const dropdownWidth = 150;
  const dropdownHeight = 100; // Estimated height
  const isOverflowingRight = position.left + dropdownWidth > viewportWidth;
  const isOverflowingBottom = position.bottom + dropdownHeight > viewportHeight;

  // Adjust `left` and `top` positions based on overflow detection
  const dropdownStyles = {
    position: 'absolute',
    top: isOverflowingBottom ? position.top - dropdownHeight - 10 : position.bottom + 8 + window.scrollY,
    left: isOverflowingRight ? position.left - dropdownWidth : position.left + 8 + window.scrollX,
    zIndex: 1000,
  };

  return ReactDOM.createPortal(
    <div ref={dropdownRef} className="dropdown-menu-portal" style={dropdownStyles}>
      {items.map((item, index) => (
        <div key={index} className="dropdown-item" onClick={() => onAction(item.action)}>
          <span className="dropdown-icon">{item.icon}</span> 
          {item.label}
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ActionDropdown;
