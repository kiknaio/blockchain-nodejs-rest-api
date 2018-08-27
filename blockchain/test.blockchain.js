const level = require('level');
const SHA256 = require('crypto-js/sha256');
const log = level('log.db', { valueEncoding: 'json' });

const editBlock = async blockNumber => {
  log.get(blockNumber, (err, data) => {
    if (err) return console.error(err);
    data.body = 'Compromised block';
    log.put(2, data, err => {
      if (err) return console.error(err);
      console.log(data);
    });
  })
}

editBlock(2);
