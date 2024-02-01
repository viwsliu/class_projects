const {Pool} = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.poststuff = async (req) => {
  const newdate = new Date().toISOString().slice(0, 19) + 'Z';
  const from = {'name': req.user.name, 'email': req.user.email};
  const to = {'name': req.body.to.name, 'email': req.body.to.email};
  const emailData = {
    'from': from,
    'to': to,
    'received': newdate,
    'sent': newdate,
    'content': req.body.content,
    'subject': req.body.subject,
  };
  const mailboxes = [];
  const query = {
    text: 'SELECT * FROM mailbox WHERE userinfo_id = $1',
    values: [req.user.id],
  };
  const mailbox = await pool.query(query);
  for (let i = 0; i <mailbox.rows.length; i++) {
    mailboxes.push({[mailbox.rows[i].name]: mailbox.rows[i].id});
  }
  let newMailboxId;
  for (let i = 0; i< mailboxes.length; i++) {
    // const key = Object.keys(mailboxes[i]);
    if (mailboxes[i].sent) {
      newMailboxId = mailboxes[i].sent;
    }
  }

  const insertEmailQuery = `
  INSERT INTO mail(mailbox_id, email)
  VALUES ($1, $2)
  RETURNING id;`;
  result = await pool.query(
    insertEmailQuery,
    [newMailboxId,
      emailData]);
  const emailData2 = {
    'id': result.rows[0].id,
    'from': from,
    'to': to,
    'received': newdate,
    'sent': newdate,
    'content': req.body.content,
    'subject': req.body.subject,
  };
  return emailData2;
};
