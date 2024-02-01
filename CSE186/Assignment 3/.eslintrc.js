module.exports = {
  'parser': '@babel/eslint-parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'requireConfigFile': false,
  },
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
};
