import React from 'react';
import './App.css';

// import MyContext from './context';

import MenuIcon from '@mui/icons-material/Menu';
import { Button, Drawer, Card, CardContent, Box, Table, TableBody, TableRow, TableCell} from '@mui/material';

import loader from './data/loader';
import emails from './data/emails.json';

loader(); // do not remove this!
loader(); // Or this!

//Cite Sources:
// https://v4.mui.com
// https://mui.com/material-ui/react-button-group/
// https://mui.com/material-ui/react-menu/
// https://react.dev/learn/passing-data-deeply-with-context
// https://www.geeksforgeeks.org/how-to-share-state-across-react-components-with-context/
// https://legacy.reactjs.org/docs/react-component.html
// https://legacy.reactjs.org/docs/hooks-state.html
// https://chat.openai.com/

/**
 * Simple component with no state.
 *
 * See the basic-react from lecture for an example of adding and
 * reacting to changes in state.
 */
class App extends React.Component {
  // const [Inbox, InboxType] = useState('Inbox');
  // const [isEmailOpen, setIsEmailOpen] = useState(false);
  // const [ScreenType, setScreenType] = useState('Desktop');
  // const [isDrawerOpen, setisDrawerOpen] = useState(false);
  // const [selectedEmail, setselectedEmail] = useState(null);

  constructor(props) {
    super(props);
    this.state = {
      InboxType: 'Inbox',
      isEmailOpen: false,
      isDesktop: true,
      isDesktop2: false,
      isMobile: false,
      isDrawerOpen: false,
      selectedEmail: null
    };
  }

  // buttonPressed = (event) => {
  //   if (event.key === 'Escape' && this.state.isEmailOpen) {
  //     this.setState({
  //       isEmailOpen: false,
  //       selectedEmail: null
  //     });
  //   }
  // };

  checkBrowserSize = () => {
    const isDesktop = window.innerWidth >= 768;
    const isDesktop2 = window.innerWidth < 768 || window.innerWidth < window.innerHeight / 2;
    const isMobile = window.innerWidth === 550 && window.innerHeight===1024;
    this.setState({
      isDesktop,
      isDesktop2,
      isMobile
    });
  };

  handleInboxClick = () => {
    this.setState({
      InboxType: 'Inbox',
      isEmailOpen: false,
      isDrawerOpen: false,
      selectedEmail: null
    });
  };
  
  handleTrashClick = () => {
    this.setState({
      InboxType: 'Trash',
      isEmailOpen: false,
      isDrawerOpen: false,
      selectedEmail: null
    });
  };

  // handleTitleClick = () => {
  //   this.setState({
  //     isEmailOpen: false,
  //     isDrawerOpen: false,
  //     selectedEmail: null
  //   });
  // };

  changeDate = (emailDate) => {
    const receivedDate = new Date(emailDate)
    const formattedDate = receivedDate.toLocaleTimeString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    const commaIndex = formattedDate.indexOf(',', formattedDate.indexOf(',') + 1);
    const formattedWithSymbol = formattedDate.slice(0, commaIndex) + ' @' + formattedDate.slice(commaIndex + 1);
    return formattedWithSymbol;
  }

  /**
   * @return {object} a <div> containing an <h2>
   */
  render() {
    emails.sort((a, b) => new Date(b.received) - new Date(a.received));
    return (
      <div>
        {/* Title and possible menu button */}
        <Box id="headTitle" style={{ backgroundColor: 'lightgray', padding: '10px' }}>
          {this.state.isDesktop2 ? (
            <header>
              <Button aria-label='toggle drawer' onClick={() => this.setState((prevState) => ({ isDrawerOpen: !prevState.isDrawerOpen }))}>
                <MenuIcon/>
              </Button>
              <span onClick={this.handleTitleClick} style={{padding: '10px'}}>
                CSE186 Mail - {this.state.InboxType === 'Inbox' ? 'Inbox' : 'Trash'}
              </span>
            </header>
          ) : (
            <h2>
            CSE186 Mail - {this.state.InboxType === 'Inbox' ? 'Inbox' : 'Trash'}
            </h2>
          )}
        </Box>
        
      <Box style={{display: 'flex'}}>
        
        {!this.state.isDesktop && (this.state.isDesktop2) ? (
        <div>
          {this.state.isDrawerOpen ? (
            <Drawer
            variant="permanent"
            anchor="left"
            padding='100px'
          >
              <Button onClick={this.handleInboxClick}>
                Inbox
              </Button>
              <Button onClick={this.handleTrashClick}>
                Trash
              </Button>

          </Drawer>
            ) : null}
        </div>
        ) : (
        <Box style={{ position: 'left', left: 0, top: 50, bottom: 0, width: '100px', height: '1000px', backgroundColor: '#f0f0f0' }}>
          <Button variant="text" onClick={this.handleInboxClick}>
            Inbox
          </Button>
          <Button variant="text" onClick={this.handleTrashClick}>
            Trash
          </Button>
        </Box>
        )}


        <Table style={{display: 'flex', position: 'right'}}>
          <TableBody>
            {emails.map((email) => {
              const receivedDate = new Date(email.received);
              const isToday = receivedDate.getDate() === new Date().getDate() &&
                receivedDate.getMonth() === new Date().getMonth() &&
                receivedDate.getFullYear() === new Date().getFullYear();
              const receivedYear = receivedDate.getFullYear();
              const recievedMonth = receivedDate.getMonth();
              const isWithinLastYear =
                (receivedYear < new Date().getYear() && (recievedMonth >= new Date().getMonth()))
                ||
                (receivedYear === new Date().getFullYear() &&
                  recievedMonth < new Date().getMonth())
                ||
                (receivedYear === new Date().getFullYear() &&
                  recievedMonth === new Date().getMonth());

              let formattedDate;
              if (isToday) {
                formattedDate = receivedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
              } else if (isWithinLastYear) {
                formattedDate = receivedDate.toLocaleString('en-US', {month: 'short', day: '2-digit' });
              } else {
                formattedDate = receivedDate.toLocaleString('en-US', { year: 'numeric'});
              }

              if (email.mailbox === 'trash' && (this.state.InboxType === 'Trash')) {
                return (
                  <TableRow key={email.id}>
                   
                    <TableCell>
                      <Button aria-label={`${email.from.name} ${email.subject}`} onClick={() => this.setState({isEmailOpen: true, selectedEmail: email})}>
                        {email.from.name} 
                      </Button>
                    </TableCell>
                    <TableCell>{email.subject}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    
                  </TableRow>
                );
              }
              if (email.mailbox === 'inbox' && this.state.InboxType === "Inbox") {
                return (
                  <TableRow key={email.id}  >
                    
                    <TableCell> 
                      <Button aria-label={`${email.from.name} ${email.subject}`} onClick={() => this.setState({isEmailOpen: true, selectedEmail: email})}>
                        {email.from.name}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {email.subject}
                    </TableCell>
                    <TableCell>{formattedDate}</TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </Box>


      {/* viewemails for desktop */}
        {this.state.selectedEmail && (
          <Card
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '600px',
              width: '80%',
              maxHeight: '80%',
              overflow: 'auto',
            }}
          >
            {(this.state.isDesktop2 && this.state.isMobile) ? (
            <CardContent>
              <Box style={{fontWeight: 'bold', backgroundColor: 'lightblue', padding: '10px'}}>
                <Button
                  aria-label="close mobile reader"
                  onClick={() =>     this.setState({
                    isEmailOpen: false,
                    selectedEmail: null
                  })}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '30px',
                    height: '30px',
                  }}
                >
                  X
                </Button>
                <span>{this.state.selectedEmail.subject}</span>
              </Box>
              <p>From: {this.state.selectedEmail.from.name} ({this.state.selectedEmail.from.address})</p>
              <p>To: {this.state.selectedEmail.to.name} ({this.state.selectedEmail.to.address})</p>
              <p>Subject: {this.state.selectedEmail.subject}</p>
              <p>Received: {this.changeDate(this.state.selectedEmail.received)}</p>
              <p>{this.state.selectedEmail.content}</p>
            </CardContent> 

            ) : (

              <CardContent>
                <Box style={{fontWeight: 'bold', backgroundColor: 'lightblue', padding: '10px'}}>
                  <Button
                    aria-label='close desktop reader'
                    onClick={() =>     this.setState({
                      isEmailOpen: false,
                      selectedEmail: null
                    })}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      width: '30px',
                      height: '30px',
                    }}
                  >
                    X
                  </Button>
                  
                  <span>{this.state.selectedEmail.subject}</span>
                </Box>
                <p>From: {this.state.selectedEmail.from.name} ({this.state.selectedEmail.from.address})</p>
                <p>To: {this.state.selectedEmail.to.name} ({this.state.selectedEmail.to.address})</p>
                <p>Subject: {this.state.selectedEmail.subject}</p>
                <p>Received: {this.changeDate(this.state.selectedEmail.received)}</p>
                <p>{this.state.selectedEmail.content}</p>
            </CardContent>
            )};
          </Card>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.checkBrowserSize();
    window.addEventListener('resize', this.checkBrowserSize);
    // document.addEventListener('keydown', this.buttonPressed);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkBrowserSize);
    // document.removeEventListener('keydown', this.buttonPressed);
  }
}

export default App;
