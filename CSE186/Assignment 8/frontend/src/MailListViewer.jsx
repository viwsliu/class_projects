import { TableRow, TableBody, TableCell, Table } from '@mui/material';
import PropTypes from 'prop-types';

const changeDate = (emailDate) => {
  const receivedDate = new Date(emailDate)
  const formattedDate = receivedDate.toLocaleTimeString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  const commaIndex = formattedDate.indexOf(',', formattedDate.indexOf(',') + 1);
  const formattedWithSymbol = formattedDate.slice(0, commaIndex) + ' @' + formattedDate.slice(commaIndex + 1);
  return formattedWithSymbol;
}

const EmailViewer = ({ emails, onEmailClick }) => {
  return (
    <div>
      <Table>
        <TableBody>
          {emails !== undefined ? (
            emails.map((item, index) => (
              <TableRow key={index} onClick={() => onEmailClick(item.id)} style={{ border: '1px solid #000000' }}>
                <TableCell>
                  {item.from.name}
                </TableCell>
                <TableCell styles={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 5, width: '50px', }}>
                  {item.subject}
                </TableCell>
                <TableCell styles={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 5, width: '50px', }}>
                  {item.content}
                </TableCell>
                <TableCell>
                  {changeDate(item.recieved)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>Loading...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

EmailViewer.propTypes = {
  emails: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEmailClick: PropTypes.func.isRequired,
};

export default EmailViewer;