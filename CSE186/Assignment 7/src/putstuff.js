// Referenced Prof's example

const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.put = async (passedid, passedMailbox) => {
  let output;
  const select = 'SELECT * FROM mail';
  const query = {
    text: select,
  };
  const {rows} = await pool.query(query);

  for (const row of rows) {
    if (row.id === passedid) {
      if (row.mailbox != 'sent' && passedMailbox === 'sent') {
        return '409';
      }
      output = {
        'id': row.id,
        'to': row.mail.to,
        'from': row.mail.from,
        'sent': row.mail.sent,
        'subject': row.mail.subject,
        'content': row.mail.content,
        'received': row.mail.received,
      };

      // update location of mailbox
      const updateQuery = `
        UPDATE mail
        SET mailbox = $1
        WHERE id = $2;
      `;
      await pool.query(updateQuery, [passedMailbox, passedid]);
      return output;
    }
  }
  return '404';
};
