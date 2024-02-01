import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import MailIcon from '@mui/icons-material/Mail';

const MailboxList = ({ onSelectMailbox, onComposeClick }) => {
  const handleMailboxClick = (mailbox) => {
    onSelectMailbox(mailbox);
  };

  const handleComposeClick = () => {
    onComposeClick(true);
  };

  return (
    <div>
      <List>
        <ListItem onClick={() => handleMailboxClick('inbox')}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItem>
        <ListItem onClick={() => handleMailboxClick('sent')}>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="Sent" />
        </ListItem>
        <ListItem onClick={() => handleMailboxClick('trash')}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Trash" />
        </ListItem>
        <ListItem onClick={handleComposeClick}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="Compose" />
        </ListItem>
      </List>
      <Divider />
    </div>
  );
};

MailboxList.propTypes = {
  onSelectMailbox: PropTypes.func.isRequired,
  onComposeClick: PropTypes.func.isRequired,
};

export default MailboxList;