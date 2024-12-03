import React from 'react';
import './RecordTable.css';

const RecordTable = ({ records }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Grade Percentage</th>
            <th>Grade Letter</th>
            <th>Week</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.studentName}</td>
              <td>{record.gradePercentage}%</td>
              <td>{record.gradeLetter}</td>
              <td>{record.week}</td>
              <td>{record.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordTable;