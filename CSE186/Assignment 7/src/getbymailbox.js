// Referenced Prof's example

const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectEmails = async (passedmailbox, fromname) => {
  let check;
  let searchingEmailfrom;
  if (fromname != undefined) {
    const output = await checktype(fromname);
    check = output[0];
    searchingEmailfrom = output[1];
  }
  const emails = [];
  const myDictionary={'inbox': [], 'sent': [], 'trash': []};

  const select = 'SELECT * FROM mail';
  const query = {
    text: select,
  };
  const {rows} = await pool.query(query);

  for (const row of rows) {
    const mailboxname = row.mailbox;

    if ((fromname != undefined) &&
      (searchingEmailfrom === false) &&
      (row.mail.from.name.includes(check))) {
      // console.log('searching inbox via name')
      if (myDictionary.hasOwnProperty(mailboxname)) {
        myDictionary[mailboxname].push({
          'id': row.id,
          'to': row.mail.to,
          'from': row.mail.from,
          'sent': row.mail.sent,
          'subject': row.mail.subject,
          'recieved': row.mail.received,
        });
      }
    } else if ((fromname != undefined) &&
      (searchingEmailfrom === true) &&
      (check === row.mail.from.email)) {
      // console.log('searching inbox via email ', row.mail.from.email)
      if (myDictionary.hasOwnProperty(mailboxname)) {
        myDictionary[mailboxname].push({
          'id': row.id,
          'to': row.mail.to,
          'from': row.mail.from,
          'sent': row.mail.sent,
          'subject': row.mail.subject,
          'recieved': row.mail.received,
        });
      }
    } else if (fromname === undefined) {
      if (myDictionary.hasOwnProperty(mailboxname)) {
        myDictionary[mailboxname].push({
          'id': row.id,
          'to': row.mail.to,
          'from': row.mail.from,
          'sent': row.mail.sent,
          'subject': row.mail.subject,
          'recieved': row.mail.received,
        });
      } else {
        myDictionary[mailboxname] = [{
          'id': row.id,
          'to': row.mail.to,
          'from': row.mail.from,
          'sent': row.mail.sent,
          'subject': row.mail.subject,
          'recieved': row.mail.received,
        }];
      }
    }
  }

  if (passedmailbox === undefined) {
    keys = Object.keys(myDictionary);
    for (let i = 0; i < keys.length; i++) {
      if (myDictionary[keys[i]].length != 0) {
        emails.push({'name': `${keys[i]}`, 'mail': myDictionary[keys[i]]});
      }
    }
  } else {
    if (myDictionary[passedmailbox] === undefined) {
      return undefined;
    } else {
      emails.push(
        {'name': passedmailbox},
        {'mail': myDictionary[passedmailbox]});
    }
  }
  if (emails.length != 0) {
    return emails;
  } else {
    return undefined;
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
    const lowercaseString = fromname.toLowerCase();
    const wordsArray = lowercaseString.split(' ');
    output = wordsArray.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  return ([output, searchingEmailfrom]);
};

// for (const row of rows) {
//   const mailboxname = row.mailbox;
//   if (mailboxname === 'inbox') {
//     myDictionary.inbox.push({
//       'id': row.id,
//       'to': row.mail.to,
//       'from': row.mail.from,
//       'sent': row.mail.sent,
//       'subject': row.mail.subject,
//       'recieved': row.mail.received,
//     });
//   } else if (mailboxname === 'sent') {
//     myDictionary.sent.push({
//       'id': row.id,
//       'to': row.mail.to,
//       'from': row.mail.from,
//       'sent': row.mail.sent,
//       'subject': row.mail.subject,
//       'recieved': row.mail.received,
//     });
//   } else if (mailboxname === 'trash') {
//     myDictionary.trash.push({
//       'id': row.id,
//       'to': row.mail.to,
//       'from': row.mail.from,
//       'sent': row.mail.sent,
//       'subject': row.mail.subject,
//       'recieved': row.mail.received,
//     });
//   } else {
//     if (myDictionary.hasOwnProperty(mailboxname)){
//       temp.push({
//         'id': row.id,
//         'to': row.mail.to,
//         'from': row.mail.from,
//         'sent': row.mail.sent,
//         'subject': row.mail.subject,
//         'recieved': row.mail.received,
//       });
//       myDictionary[mailboxname] = {
//         temp,
//       };
//     } else {
//       myDictionary[mailboxname] = {
//         'id': row.id,
//         'to': row.mail.to,
//         'from': row.mail.from,
//         'sent': row.mail.sent,
//         'subject': row.mail.subject,
//         'recieved': row.mail.received,
//       };
//     }
//   }
// }
