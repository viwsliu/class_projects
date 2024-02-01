const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.put = async (currUser, passedid, passedMailbox) => {
  let output;
  const query = {
    text: 'SELECT * FROM mailbox WHERE userinfo_id = $1',
    values: [currUser.id],
  };
  const mailboxes = [];
  const mailbox = await pool.query(query);
  for (let i = 0; i <mailbox.rows.length; i++) {
    mailboxes.push({[mailbox.rows[i].name]: mailbox.rows[i].id});
  }
  let newMailboxId;
  for (let i = 0; i< mailboxes.length; i++) {
    if (mailboxes[i][passedMailbox]) {
      newMailboxId = mailboxes[i][passedMailbox];
      // if (newMailboxId === mailboxes[i].sent){
    }
  }
  // console.log(newMailboxId);
  const query2 = {
    text: 'SELECT * FROM mail',
  };
  const {rows} = await pool.query(query2);

  for (const row of rows) {
    if (row.id === passedid) {
      for (let i = 0; i< mailboxes.length; i++) {
        if (
          (row.mailbox_id != mailboxes[i].sent) &&
          (passedMailbox === 'sent')) {
          return '409';
        }
      }
      output = {
        'id': row.id,
        'to': row.email.to,
        'from': row.email.from,
        'sent': row.email.sent,
        'subject': row.email.subject,
        'content': row.email.content,
        'received': row.email.received,
      };
      let updateQuery;
      if (newMailboxId === undefined) {
        // console.log('new mailbox!');
        const insertEmailQuery = `
        INSERT INTO mailbox(name, userinfo_id)
        VALUES ($1, $2)
        RETURNING id;`;
        result = await pool.query(
          insertEmailQuery,
          [passedMailbox, currUser.id]);
        updateQuery = `
          UPDATE mail
          SET mailbox_id = $1
          WHERE id = $2;
        `;
        await pool.query(updateQuery, [result.id, passedid]);
        return output;
      } else {
        updateQuery = `
          UPDATE mail
          SET mailbox_id = $1
          WHERE id = $2;
        `;
        await pool.query(updateQuery, [newMailboxId, passedid]);

        return output;
      }
    }
  }
  return '404';
};
