import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function App() {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    title: '',
    percentage: '',
    letterGrade: '',
    day: '',
    comments: '',
  });

  const [teacherNotes, setTeacherNotes] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('/api/records'); 
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    if (newRecord.percentage) {
      const percent = parseInt(newRecord.percentage, 10);
      let grade = '';
      if (percent >= 90) grade = 'A';
      else if (percent >= 80) grade = 'B';
      else if (percent >= 70) grade = 'C';
      else if (percent >= 60) grade = 'D';
      else grade = 'F';
      setNewRecord((prev) => ({ ...prev, letterGrade: grade }));
    } else {
      setNewRecord((prev) => ({ ...prev, letterGrade: '' }));
    }
  }, [newRecord.percentage]);

  const handleChange = (field, value) => {
    setNewRecord((prev) => ({ ...prev, [field]: value }));
  };


  const handleAddRecord = async () => {
    if (newRecord.title && newRecord.percentage && newRecord.day) {
      try {
        const response = await axios.post('/api/records', newRecord);
        setRecords((prevRecords) => [...prevRecords, response.data]);
        setNewRecord({
          title: '',
          percentage: '',
          letterGrade: '',
          day: '',
          comments: '',
        });
      } catch (error) {
        console.error('Error adding record:', error);
      }
    }
  };

  // Delete a record via serverless function
  const handleDeleteRecord = async (id) => {
    try {
      await axios.delete(`/api/records?id=${id}`);
      setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  // Fetch piano suggestions
  const fetchPianoSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a piano practice assistant.' },
            {
              role: 'user',
              content: `Based on the teacher's notes: "${teacherNotes}", suggest 5 good piano exercises or pieces to improve skills.`,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      const suggestionsText = response.data.choices[0].message.content;
      const suggestionsList = suggestionsText.split('\n').filter((item) => item.trim() !== '');
      setSuggestions(suggestionsList);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions(['Error fetching suggestions. Please try again later.']);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleOpenSuggestions = () => {
    setIsDrawerOpen(true);
    if (suggestions.length === 0) {
      fetchPianoSuggestions();
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Box mb={3}>
          <Typography variant="h4" align="center" gutterBottom>
            🎹 Practice Records with Suggestions
          </Typography>
        </Box>

        {/* Input Section */}
        <Box
          mb={3}
          display="flex"
          flexDirection="column"
          alignItems="stretch"
          gap="1rem"
        >
          <TextField
            label="Title (e.g., Practice Scales)"
            variant="outlined"
            value={newRecord.title}
            onChange={(e) => handleChange('title', e.target.value)}
            fullWidth
          />
          <TextField
            label="Percentage Grade"
            variant="outlined"
            value={newRecord.percentage}
            onChange={(e) => handleChange('percentage', e.target.value)}
            type="number"
            fullWidth
          />
          <TextField
            label="Letter Grade"
            variant="outlined"
            value={newRecord.letterGrade}
            disabled
            fullWidth
          />
          <TextField
            select
            label="Day of the Week"
            variant="outlined"
            value={newRecord.day}
            onChange={(e) => handleChange('day', e.target.value)}
            fullWidth
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Comments"
            variant="outlined"
            value={newRecord.comments}
            onChange={(e) => handleChange('comments', e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRecord}
            fullWidth
          >
            Add Record
          </Button>
        </Box>

        {/* Teacher's Notes Section */}
        <Box mb={3}>
          <TextField
            label="Teacher's Notes for Suggestions"
            variant="outlined"
            value={teacherNotes}
            onChange={(e) => setTeacherNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Box>

        {/* Records Table */}
        {records.length > 0 ? (
          <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>
                    #
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Grade (%)</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Letter</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Day</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Comments</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={record.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{record.title}</TableCell>
                    <TableCell>{record.percentage}</TableCell>
                    <TableCell>{record.letterGrade}</TableCell>
                    <TableCell>{record.day}</TableCell>
                    <TableCell>{record.comments}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteRecord(record.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography
            variant="body1"
            align="center"
            color="textSecondary"
            style={{ marginTop: '1rem' }}
          >
            No practice records found. Start by adding a new record!
          </Typography>
        )}

        {/* GPT Suggestions Drawer */}
        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenSuggestions}
          >
            View Piano Suggestions
          </Button>
        </Box>
        <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <Box width={300} padding={2}>
            <Typography variant="h6" gutterBottom>
              🎼 Piano Suggestions
            </Typography>
            {loadingSuggestions ? (
              <CircularProgress />
            ) : (
              <List>
                {suggestions.map((suggestion, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Drawer>
      </Paper>
    </Container>
  );
}

export default App;