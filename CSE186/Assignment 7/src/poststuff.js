// Referenced Prof's example

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
  const from = {'name': 'CSE186 Student', 'email': 'cse186-student@ucsc.edu'};
  const to = req.body.to;
  const emailData = {
    'from': from,
    'to': to,
    'received': newdate,
    'sent': newdate,
    'content': req.body.content,
    'subject': req.body.subject,
  };

  const insertEmailQuery = `
  INSERT INTO mail(mailbox, mail)
  VALUES ($1, $2)
  RETURNING id;`;
  result = await pool.query(insertEmailQuery, ['sent', emailData]);
  // console.log('Email added successfully');
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
