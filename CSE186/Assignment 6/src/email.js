// https://swagger.io/docs/specification/components/?sbsearch=components
// https://nodejs.org/api/fs.html#fswritefilesyncfile-data-options
// https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses
// https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
// https://www.uuidtools.com/what-is-uuid
// https://chat.openai.com/
// TA Jose Helped
const {v4: uuidv4} = require('uuid');
const fs = require('fs');

exports.getAll= async (req, res)=> {
  const allFiles = await include();
  const all = [];
  keys = Object.keys(allFiles);
  for (let i = 0; i<keys.length; i++) {
    files = keys[i];
    const filedir = require(`../data/${files}`);
    if (req.query.mailbox === files) {
      const temp = filedir.map((email) => {
        return {
          'id': email.id,
          'to-name': email['to-name'],
          'to-email': email['to-email'],
          'subject': email.subject,
          'received': email.received,
          'from-name': email['from-name'],
          'from-email': email['from-email'],
        };
      });
      const output = [{'name': `${files}`, 'mail': [...temp]}];
      return res.status(200).json(output);
    } else {
      if (req.query.mailbox === undefined) {
        const temp = filedir.map((email) => {
          return {
            'id': email.id,
            'to-name': email['to-name'],
            'to-email': email['to-email'],
            'subject': email.subject,
            'received': email.received,
            'from-name': email['from-name'],
            'from-email': email['from-email'],
          };
        });
        all.push({'name': `${files}`, 'mail': [...temp]});
      }
    }
  }
  if (all.length === 0) {
    return res.status(404).json();
  }
  return res.status(200).json(all);
};

exports.getById = async (req, res) => {
  const allFiles = await include();
  keys = Object.keys(allFiles);
  for (let i = 0; i<keys.length; i++) {
    files = keys[i];
    const filedir = require(`../data/${files}`);
    const getmailbox = filedir.find((email) => email.id === req.params.id);
    if (getmailbox) {
      return res.status(200).json(getmailbox);
    }
  }
  return res.status(404).json();
};

exports.post = async (req, res) => {
  const sent = require('../data/sent.json');
  const input = req.body;
  const id = uuidv4();
  const newID = {id};
  const received = new Date().toISOString().slice(0, 19) + 'Z';
  const temp = {received};
  const fromName = {'from-name': 'CSE186 Student'};
  const fromEmail = {'from-email': 'cse186-student@ucsc.edu'};
  const concatenated =
    {...newID, ...input, ...fromName, ...fromEmail, ...temp};
  sent.push(concatenated);
  res.status(200).json(concatenated);
};

exports.put = async (req, res) => {
  const allFiles = await include();
  keys = Object.keys(allFiles);
  for (let i = 0; i<keys.length; i++) {
    files = keys[i];
    const filedir = require(`../data/${files}`);
    const test = filedir.find((email) => email.id === req.params.id);
    const index = filedir.findIndex((email) => email.id === req.params.id);
    if (test && (index != -1) && allFiles.hasOwnProperty(req.query.mailbox)) {
      if (req.query.mailbox === 'sent' && files !== 'sent') {
        return res.status(409).json();
      }
      const EmailtoMove = filedir.splice(index, 1)[0];
      const towards = require(`../data/${req.query.mailbox}`);
      towards.push(EmailtoMove);
      return res.status(204).json(EmailtoMove);
    }
  }
  // if file does not exist
  // for(files in allFiles) {
  //     const filedir = require(`../data/${files}`)
  //     const test = filedir.find((email) => email.id === req.params.id)
  //     const index = filedir.findIndex((email) => email.id === req.params.id);
  //     if(test){
  //         const EmailtoMove = filedir.splice(index, 1)[0];
  //         const jsonString = JSON.stringify(EmailtoMove, null, 2);
  // fs.writeFile(`data/${req.query.mailbox}.json`, jsonString, (err) => {
  //             if (err) {
  //                 console.error('Error writing the file:', err);
  //                 return res.status(500).json();
  //             }
  //             return res.status(204).json(EmailtoMove);
  //         });
  //     }
  // }
  return res.status(404).json();
};

/**
* @return {Object} returns an object of file names
*/
async function include() {
  const myObj = {};
  const filenames = await fs.promises.readdir('data');
  for (let i = 0; i < filenames.length; i++) {
    const key = filenames[i].replace('.json', '');
    myObj[key] = filenames[i];
  }
  return myObj;
  // fs.writeFileSync(file, data[, options])
}
