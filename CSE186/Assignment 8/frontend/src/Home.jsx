import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, IconButton, TextField, Button, Drawer} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import MailboxList from './MailboxList';
import MailListViewer from './MailListViewer';
import EmailComposer from './EmailComposer';
import EmailViewer from './EmailViewer';

const Home = () => {
  const navigate = useNavigate();
  
  // For opening side bar
  const [drawerOpen, setDrawerOpen] = useState(false);

  // For searching query
  const [searchQuery, setSearchQuery] = useState('');
  const [showButton, setShowButton] = useState(false);

  // showing emails on initial page
  const [selectedMailbox, setSelectedMailbox] = useState('inbox');
  const [emailsObject, setemailsObject] = useState([]);
  const [changes, setchanges] = useState('');

  // email viewer
  const [isviewing, setisviewing] = useState(false);
  const [viewingid, setviewingid] = useState('');
  const [viewingname, setviewingname] = useState('');
  const [viewingfrom, setviewingfrom] = useState('');
  const [viewingsubject, setviewingsubject] = useState('');
  const [viewingcontent, setviewingcontent] = useState('');
  const [viewingreceived, setviewingreceived] = useState('');
  const [viewingto, setviewingto] = useState('');

  // For email post
  const [iscomposing, setiscomposing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [textarea1, setTextarea1] = useState('');
  const [textarea2, setTextarea2] = useState('');

  const logout = () => {
    console.log("LOGOUT");
    localStorage.removeItem('user');
    navigate('/');
  };

  const changeDate = (emailDate) => {
    const receivedDate = new Date(emailDate);
    const formattedDate = receivedDate.toLocaleTimeString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const commaIndex = formattedDate.indexOf(',', formattedDate.indexOf(',') + 1);
    const formattedWithSymbol = formattedDate.slice(0, commaIndex) + ' @' + formattedDate.slice(commaIndex + 1);
    return formattedWithSymbol;
  }

  const handleMailboxListToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleFolderChange = (mailbox) => {
    setSelectedMailbox(mailbox);
    handleMailboxListToggle();
    setDrawerOpen(!drawerOpen);
    setiscomposing(false);
    closeviewer();
    setchanges('change');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowButton(value !== '');
    setchanges('change');
  };

  const clearsearchbar = () => {
    setShowButton(false);
    setSearchQuery('');
    setchanges('change');
  };

  const handleiscomposing = (isComposing) => {
    setDrawerOpen(false);
    setiscomposing(isComposing);
    closeviewer();
  };

  const openviewer = async (id) => {
    handleiscomposing(false);
    try {
      setisviewing(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:3010/v0/mail/${id}`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.log('Failed to open requested Email!');
      }
      const data = await response.json();
      setviewingid(data.id);
      setviewingname(data.name);
      setviewingfrom(data.from);
      setviewingsubject(data.subject);
      setviewingcontent(data.content);
      setviewingreceived(data.received);
      setviewingto(data.to);
    } catch (err) {
      console.log('Failed to open requested Email!', err);
    }
  };

  const closeviewer = () => {
    setisviewing(false);
    setviewingname('');
    setviewingfrom('');
    setviewingsubject('');
    setviewingcontent('');
    setviewingreceived('');
    setviewingid('');
    setviewingto('');
    setchanges('change');
  }

  const handleTrash = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`http://localhost:3010/v0/mail/${id}?mailbox=trash`, {
      method: 'put',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      console.log('failed trashing');
    }
    closeviewer();
  }

  const handleSubmit = () => {
    const inputPOSTdata = {
      subject: name,
      content: textarea1,
      to: {
        name: name,
        email: email,
      },
    };
    const user = JSON.parse(localStorage.getItem('user'));
    fetch('http://localhost:3010/v0/mail', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputPOSTdata),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Email sent successfully!');
          setiscomposing(false);
          setName('');
          setEmail('');
          setTextarea1('');
          setTextarea2('');
        } else {
          console.error('Failed to send email.');
        }
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  useEffect(() => {
    const getData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (searchQuery !== '') {
        try {
          const response = await fetch(`http://localhost:3010/v0/mailbox?mailbox=${selectedMailbox}&from=${searchQuery}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${user.accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            return '404';
          }
          const data = await response.json();
          setemailsObject(data[0].mail);
        } catch (err) {
          console.log('Error fetching data:', err);
        }
      } else {
        try {
          const response = await fetch(`http://localhost:3010/v0/mailbox?mailbox=${selectedMailbox}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${user.accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
           console.log('empty! or error!');
          }
          const data = await response.json();
          setemailsObject(data[0].mail);
        } catch (err) {
          console.log('Error fetching data:', err);
        }
      }
    };
    getData();
  }, [selectedMailbox, searchQuery, changes]);

  return (
    <div>
      <div>
        {/* FOR TOP BAR */}
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMailboxListToggle}>
              <MenuIcon />
            </IconButton>
            <h1 > CSE186 Email - {selectedMailbox}</h1>
            <TextField
              variant="outlined"
              placeholder="Search"
              value={searchQuery}
              onChange={handleInputChange}
            />
            {showButton && (
              <button onClick={() => clearsearchbar()}>X</button>
            )}
            <Button color="inherit" onClick={logout}> Logout </Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Drawer aria-label='toggle drawer' anchor="left" open={drawerOpen} onClose={handleMailboxListToggle}>
            <MailboxList onSelectMailbox={handleFolderChange} onComposeClick={handleiscomposing} />
          </Drawer>
        </Container>
      </div>

      {/* FOR EMAIL COMPOSING */}
      {iscomposing && (
        <EmailComposer
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          textarea1={textarea1}
          setTextarea1={setTextarea1}
          textarea2={textarea2}
          setTextarea2={setTextarea2}
          handleiscomposing={() => handleiscomposing(false)}
          handleSubmit={handleSubmit}
        />
      )}

      {/* FOR EMAIL VIEWING */}
      {isviewing && (
        <EmailViewer
          subject={viewingsubject}
          mailbox={selectedMailbox}
          handleViewerClose={() => setisviewing(false)}
          handleTrash={() => handleTrash(viewingid)}
          name={viewingname}
          received={viewingreceived}
          fromName={viewingfrom.name}
          fromEmail={viewingfrom.email}
          content={viewingcontent}
          changeDate={changeDate}
          toName={viewingto.name}
          toEmail={viewingto.email}
        />
      )}

      {/* FOR EMAILS+MAILBOX Loading*/}
      <MailListViewer emails={emailsObject} onEmailClick={openviewer} changeDate={changeDate} />
    </div>
  );
};

export default Home;