const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectEmails = async (currUser, passedmailbox, fromname) => {
  let check;
  let searchingEmailfrom;
  if (fromname != undefined) {
    const output = await checktype(fromname);
    check = output[0];
    searchingEmailfrom = output[1];
  }

  const mailboxes = [];
  const myDictionary = {};

  const query = {
    text: 'SELECT * FROM mailbox WHERE userinfo_id = $1',
    values: [currUser.id],
  };
  const mailbox = await pool.query(query);
  for (let i = 0; i <mailbox.rows.length; i++) {
    mailboxes.push({[mailbox.rows[i].name]: mailbox.rows[i].id});
    myDictionary[mailbox.rows[i].name] = [];
  }

  const query2 = {
    text: 'SELECT * FROM mail',
  };
  const {rows} = await pool.query(query2);

  if (fromname === undefined) {
    for (let i = 0; i <rows.length; i++) {
      const temp = await findkey(mailboxes, rows[i].mailbox_id);
      if (temp === undefined) {
        continue;
      } else {
        myDictionary[temp].push({
          'id': rows[i].id,
          'to': rows[i].email.to,
          'from': rows[i].email.from,
          'sent': rows[i].email.sent,
          'subject': rows[i].email.subject,
          'recieved': rows[i].email.received,
          'content': rows[i].email.content,
        });
      }
    }
  } else {
    // console.log(check)
    for (let i = 0; i <rows.length; i++) {
      const temp = await findkey(mailboxes, rows[i].mailbox_id);
      if (temp === undefined) {
        continue;
      } else if (
        (searchingEmailfrom === true) &&
        ((check === rows[i].email.from.email) ||
        (check === rows[i].email.to.email))) {
        myDictionary[temp].push({
          'id': rows[i].id,
          'to': rows[i].email.to,
          'from': rows[i].email.from,
          'sent': rows[i].email.sent,
          'subject': rows[i].email.subject,
          'recieved': rows[i].email.received,
          'content': rows[i].email.content,
        });
      } else if ((searchingEmailfrom === false) &&
        ((rows[i].email.from.name.toLowerCase().includes(check)) ||
        (rows[i].email.to.name.toLowerCase().includes(check))) ||
        (rows[i].email.subject.toLowerCase().includes(check)) ||
        (rows[i].email.content.toLowerCase().includes(check))) {
        myDictionary[temp].push({
          'id': rows[i].id,
          'to': rows[i].email.to,
          'from': rows[i].email.from,
          'sent': rows[i].email.sent,
          'subject': rows[i].email.subject,
          'recieved': rows[i].email.received,
          'content': rows[i].email.content,
        });
      }
    }
  }


  const emails = [];
  if (passedmailbox === undefined) {
    keys = Object.keys(myDictionary);

    emails.push({'name': `inbox`, 'mail': myDictionary.inbox});
  } else {
    if (myDictionary[passedmailbox] === undefined) {
      return undefined;
    } else {
      emails.push({
        'name': passedmailbox,
        'mail': myDictionary[passedmailbox]});
    }
  }
  // console.log(emails.length)
  if ((emails.length !=0) && (emails[0].mail.length != 0)) {
    return emails;
  }
};


checktype = async (fromname) => {
  let output;
  let searchingEmailfrom = false;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // https://regex101.com/
  if (emailPattern.test(fromname)) {
    output = fromname.toLowerCase();
    searchingEmailfrom = true;
  } else {
    output = fromname.toLowerCase();
  }
  return ([output, searchingEmailfrom]);
};

findkey = (mailboxes, id) => {
  for (let i = 0; i< mailboxes.length; i++) {
    const key = Object.keys(mailboxes[i]);
    if (mailboxes[i][key] === id) {
      // console.log('output:   ', key)
      return key;
    }
  }
};
