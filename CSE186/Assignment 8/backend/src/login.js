
const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secrets = require('./secrets.json');

exports.post = async (req, res) => {
  const select = 'SELECT * FROM USERINFO';
  const query = {text: select};
  const {rows} = await pool.query(query);
  // console.log('USERINFO', rows)
  for (let i = 0; i < rows.length; i++) {
    const a = bcrypt.compareSync(req.body.password, rows[i].userpassword);
    // if (req.body.username === rows[i].email && !(a)) {
    // console.log('pass incorrect!');
    // return res.status(404).json();
    if (req.body.email === rows[i].email && (a)) {
      // console.log('Username & pass Correct!');
      const accessToken = jwt.sign(
        {email: rows[i].email, name: rows[i].username, id: rows[i].id},
        secrets.accessToken, {
          expiresIn: '2h',
          algorithm: 'HS256',
        });
      return res.status(200).json({
        accessToken: accessToken,
        name: rows[i].username,
        id: rows[i].id,
      });
    }
  }

  return res.status(404).json();
};

exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // if (authHeader) {
  const token = authHeader.split(' ')[1];
  jwt.verify(token, secrets.accessToken, (err, user) => {
    if (err) {
      // console.log('error!')
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
  // } else {
  //   res.sendStatus(401);
  // }
};
