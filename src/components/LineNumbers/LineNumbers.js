import React from 'react';
import './LineNumbers.css';

const LineNumbers = ({ lines }) => {
  return (
    <div className="line-numbers">
      {lines.map((_, index) => (
        <span key={index}>{index + 1}</span>
      ))}
    </div>
  );
};

export default LineNumbers;