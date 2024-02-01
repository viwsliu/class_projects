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
      // console.log(row.id);
      // console.log(row.mailbox_id);
      output = {
        'id': row.id,
        'to': row.email.to,
        'from': row.email.from,
        'sent': row.email.sent,
        'subject': row.email.subject,
        'content': row.email.content,
        'received': row.email.received,
      };
    }
  }
  if (output == undefined) {
    return undefined;
  }
  return output;
};
