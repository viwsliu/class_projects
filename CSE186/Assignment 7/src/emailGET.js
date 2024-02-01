// Referenced Prof's example

const getbymailbox = require('./getbymailbox');
const IdFunction = require('./ByIdFunction');
const postFile = require('./poststuff');
const putFile = require('./putstuff');

exports.getAll = async (req, res) => {
  const mail = await getbymailbox
    .selectEmails(req.query.mailbox, req.query.from);
  if (mail === undefined) {
    return res.status(404).json();
  }
  return res.status(200).json(mail);
};

exports.getById = async (req, res) => {
  const output = await IdFunction.getbyid(req.params.id);
  // console.log(req.params.id)
  if (output === undefined) {
    return res.status(404).json();
  }
  return res.status(200).json(output);
};

exports.post = async (req, res) => {
  output = await postFile.poststuff(req);
  return res.status(200).json(output);
};

exports.putfunct = async (req, res) => {
  output = await putFile.put(req.params.id, req.query.mailbox);
  if (output === '409') {
    return res.status(409).json();
  }
  if (output === '404') {
    return res.status(404).json();
  }
  // console.log(output)
  return res.status(204).json(output);
};
