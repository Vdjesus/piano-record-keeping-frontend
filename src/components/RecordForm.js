import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const RecordForm = ({ onAddRecord }) => {
  const [studentName, setStudentName] = useState('');
  const [gradePercentage, setGradePercentage] = useState('');
  const [gradeLetter, setGradeLetter] = useState('');
  const [comments, setComments] = useState('');
  const [currentWeek, setCurrentWeek] = useState('');

  useEffect(() => {
    const calculateWeek = () => {
      const startDate = new Date('2024-01-01');
      const today = new Date();
      const diffInMs = today - startDate;
      const diffInWeeks = Math.ceil(diffInMs / (1000 * 60 * 60 * 24 * 7));
      return `Week ${diffInWeeks}`;
    };
    setCurrentWeek(calculateWeek());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRecord = { studentName, gradePercentage, gradeLetter, week: currentWeek, comments };
    onAddRecord(newRecord);
    resetForm();
  };

  const resetForm = () => {
    setStudentName('');
    setGradePercentage('');
    setGradeLetter('');
    setComments('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <Typography variant="h5" gutterBottom>
        Add New Record
      </Typography>
      <Box mb={2}>
        <TextField
          label="Student Name"
          fullWidth
          required
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Grade Percentage"
          type="number"
          fullWidth
          required
          value={gradePercentage}
          onChange={(e) => setGradePercentage(e.target.value)}
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Grade Letter"
          fullWidth
          required
          value={gradeLetter}
          onChange={(e) => setGradeLetter(e.target.value)}
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Comments"
          multiline
          rows={3}
          fullWidth
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </Box>
      <Box mb={2}>
        <TextField label="Week" fullWidth disabled value={currentWeek} />
      </Box>
      <Button variant="contained" color="primary" type="submit" fullWidth>
        Add Record
      </Button>
    </Box>
  );
};

export default RecordForm;