import React, { useState } from 'react';
import RecordForm from './components/RecordForm';
import RecordTable from './components/RecordTable';
import { Container, Typography, Paper, Box } from '@mui/material';

function App() {
  const [records, setRecords] = useState([]);

  const handleAddRecord = (newRecord) => {
    setRecords((prevRecords) => [...prevRecords, newRecord]);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Box mb={3}>
          <Typography variant="h3" align="center" gutterBottom>
            My Practice Record
          </Typography>
        </Box>
        <RecordForm onAddRecord={handleAddRecord} />
        <Box mt={4}>
          <RecordTable records={records} />
        </Box>
      </Paper>
    </Container>
  );
}

export default App;