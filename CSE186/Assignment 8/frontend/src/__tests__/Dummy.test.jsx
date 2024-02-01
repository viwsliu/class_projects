import { it, beforeAll, afterAll, afterEach} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {setupServer} from 'msw/node';
import {rest} from 'msw';

import EmailComposer from '../EmailComposer';
import EmailViewer from '../EmailViewer';
import MailListViewer from '../MailListViewer'
import MailboxList from '../MailboxList';

import Dummy from '../components/Dummy';

const URL = 'http://localhost:3010/v0/dummy';

const mockChangeDate = (emailDate) => {
  return emailDate;
};

const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return res(ctx.json({message: 'Hello CSE186'}));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Handles Server Error', async () => {
  server.use(
    rest.get(URL, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  render(<Dummy />);
  fireEvent.click(screen.getByText('Get Dummy'));
  await screen.findByText('ERROR: ', { exact: false });
});

it('Renders MailListViewer Component 1', () => {
  const mockEmails = [
    {
      "id": "688c17a1-1cb4-4b02-b993-e317d3bed446",
      "to": {
        "name": "Anna Admin",
        "email": "anna@books.com"
      },
      "from": {
        "name": "Wandie Milson",
        "email": "wmilsonn@spiegel.de"
      },
      "sent": "2020-05-11T06:23:10Z",
      "subject": "Fundamental bottom-line migration",
      "received": "2020-09-16T13:04:57Z",
      "content": "Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.\n\nQuisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.\n\nVestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.\n\nIn congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.\n\nPhasellus in felis. Donec semper sapien a libero. Nam dui.\n\nProin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius."
    }
  ];
  render(
    <MemoryRouter> {}
      <MailListViewer 
      emails={mockEmails}
      onEmailClick={() => {'688c17a1-1cb4-4b02-b993-e317d3bed446'}}
      />
    </MemoryRouter>
  );
});

it('Renders MailListViewer Component 2', () => {
  // const mockEmails = [{}];
  render(
    <MemoryRouter> {}
      <MailListViewer 
      emails={[]}
      onEmailClick={() => {''}}
      />
    </MemoryRouter>
  );
});

it('Renders EmailComposer Component', () => {
  render(
    <MemoryRouter>
      <EmailComposer
        name="some Name"
        setName={() => {}}
        email='some@email.com'
        setEmail={() => {}} 
        textarea1="testing this textfield"
        setTextarea1={() => {}}
        textarea2="testing this textfield2"
        setTextarea2={() => {}}
        handleiscomposing={() => {}}
        handleSubmit={() => {}}
      />
    </MemoryRouter>
  );
});

it('Renders EmailViewer Component', () => {
  const testDate = '2023-07-28T12:34:56.789Z';
  render(
    <MemoryRouter>
      <EmailViewer
        subject="TestSubject"
        mailbox="sent"
        handleViewerClose={() => {}}
        handleTrash={() => {}}
        name="testName"
        received={testDate}
        fromName="Anna Admin"
        fromEmail="anna@books.com"
        content="This is a test email content."
        changeDate={mockChangeDate}
        toName='testToName'
        toEmail='testtoEmail@test.com'
      />
    </MemoryRouter>
  );
});


it('Renders MailboxList Component', () => {
  render(
    <MemoryRouter>
      <MailboxList 
        handleMailboxClick={()=>{'inbox'}}
        onSelectMailbox={()=>{'inbox'}}
        onComposeClick={()=>{true}}
      />
    </MemoryRouter>
  );
});
