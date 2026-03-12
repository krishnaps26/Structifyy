import React from 'react';
import './History.css';

const History = ({ history, isDarkMode }) => {
  return (
    <div className={`history-tab ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h3>Previous History</h3>
      {history?.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <div className="history-list">
          {history?.map((item, index) => (
            <div key={index} className="history-item">
              <div className="input-output-container">
                <div className="input-container">
                  <strong>Input:</strong>
                  <pre>{item.input}</pre>
                </div>
                <div className="output-container">
                  <strong>Output:</strong>
                  <pre>{item.output}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;