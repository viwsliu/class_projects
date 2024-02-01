import { Card, CardContent, Box, TextField, Button } from '@mui/material';
import PropTypes from 'prop-types';

const EmailComposer = ({
  name,
  setName,
  email,
  setEmail,
  textarea1,
  setTextarea1,
  textarea2,
  setTextarea2,
  handleiscomposing,
  handleSubmit,
}) => {
  return (
    <Card style={{ border: '2px solid black' }}>
      <CardContent style={{ fontWeight: 'bold', backgroundColor: 'lightblue', padding: '10px' }}>
        <Box>
          <h2>Email Composer</h2>
          <TextField
            variant="outlined"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            aria-label="close composer"
            style={{
              float: 'right',
              display: 'flex',
              marginRight: 'auto',
            }}
            onClick={handleiscomposing}
          >
            X
          </Button>
        </Box>
      </CardContent>
      <Box width="98%" padding="10px" style={{ backgroundColor: 'lightgray' }}>
        <textarea
          style={{ width: '100%', height: '10%', resize: 'none' }}
          value={textarea1}
          placeholder="subject"
          onChange={(e) => setTextarea1(e.target.value)}
        />
        <textarea
          style={{ width: '100%', height: '300%', resize: 'none' }}
          value={textarea2}
          placeholder="Email Content"
          onChange={(e) => setTextarea2(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Card>
  );
};

EmailComposer.propTypes = { //from chatgpt
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  textarea1: PropTypes.string.isRequired,
  setTextarea1: PropTypes.func.isRequired,
  textarea2: PropTypes.string.isRequired,
  setTextarea2: PropTypes.func.isRequired,
  handleiscomposing: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default EmailComposer;