// Referenced Prof's example
const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.getbyid = async (passedid) => {
  let output;
  const select = 'SELECT * FROM mail';
  const query = {
    text: select,
  };
  const {rows} = await pool.query(query);
  for (const row of rows) {
    if (row.id === passedid) {
      // console.log(row.mailbox);
      output = {
        'id': row.id,
        'to': row.mail.to,
        'from': row.mail.from,
        'sent': row.mail.sent,
        'subject': row.mail.subject,
        'content': row.mail.content,
        'received': row.mail.received,
      };
    }
  }
  return output;
};
