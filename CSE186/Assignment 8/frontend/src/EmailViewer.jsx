import { Card, CardContent, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const EmailViewer = ({
  subject,
  mailbox,
  handleViewerClose,
  handleTrash,
  name,
  received,
  fromName,
  fromEmail,
  content,
  changeDate,
  toName,
  toEmail,
}) => {
  return (
    <Card style={{ border: '2px solid black' }}>
      <CardContent style={{ fontWeight: 'bold', backgroundColor: 'lightblue', padding: '10px' }}>
        <Box>
          <h3>{subject}</h3>
          <h4>{mailbox}</h4>
          <Button
            aria-label="close email reader"
            style={{
              float: 'right',
              display: 'flex',
              marginRight: 'auto',
            }}
            onClick={handleViewerClose}
          >
            X
          </Button>
          <Button variant="contained" color="primary" onClick={handleTrash}>
            <DeleteIcon />
          </Button>
        </Box>
      </CardContent>
      <Box width="100%" padding="10px" style={{ backgroundColor: 'lightgray' }}>
        {name}
        {changeDate(received)}
        <p>From: {fromName}</p>
        <p>{fromEmail}</p>
        <p>To: {toName}</p>
        <p>{toEmail}</p>
        <p>{content}</p>
      </Box>
    </Card>
  );
};

EmailViewer.propTypes = { //from chatgpt
  subject: PropTypes.string.isRequired,
  mailbox: PropTypes.string.isRequired,
  handleViewerClose: PropTypes.func.isRequired,
  handleTrash: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  received: PropTypes.string.isRequired,
  fromName: PropTypes.string.isRequired,
  fromEmail: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  changeDate: PropTypes.func.isRequired,
  toName: PropTypes.string.isRequired,
  toEmail: PropTypes.string.isRequired,
};

export default EmailViewer;