const level = require('level');
const SHA256 = require('crypto-js/sha256');
const to = require('to2');
const boxen = require('boxen');
const Block = require('./block');
const log = level('log.db', { valueEncoding: 'json' });

const logGet = (thing, cb) => new Promise(resolve =>
  log.get(thing, (...args) => cb(...args, resolve))
)

class Blockchain {
  constructor() {
    let height = 0;
    log.createReadStream()
      .on('data', () => height++)
      .on('close', () => {
        if (height === 0) {
          console.log(boxen('Genesis block created', { padding: 1}));
          this.addBlock("Genesis block");
        }
      })
  }

  async addBlock(data) {
    const newBlock = new Block(data);
    let height = 0;

    newBlock.time = new Date().getTime().toString().slice(0, -3);
    newBlock.body = data;

    // Get height
    newBlock.height = await this.getBlockHeight();

    if (newBlock.height > 0) {
      const previousBlock = await this.getBlock(newBlock.height - 1);
      newBlock.previousBlockHash = previousBlock.hash;
    }
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

    log.put(newBlock.height, newBlock, err => {
      if (err) return console.error(err);
      log.get(newBlock.height, (err, result) => {
        if(err) return console.error(err);
        console.log(result);
      })
    });
  }

  getBlockHeight() {
    let height = 0;
    return new Promise((resolve, reject) => {
      log.createReadStream()
        .on('data', () => height++)
        .on('end', () => resolve(height))
    })
  }

  getBlock(blockHeight) {
    return new Promise((resolve, reject) => {
      log.get(blockHeight, (err, result) => {
        if(err) return console.error(err);
        resolve(result);
      })
    })
  }

  // validate block
  validateBlock(blockHeight) {
    return new Promise((resolve, reject) => {
      logGet(blockHeight, (err, block) => {
        if(err) reject(console.error(err));
        const blockHash = block.hash;
        block.hash = '';
        const validateBlockHash = SHA256(JSON.stringify(block)).toString();

        if (blockHash === validateBlockHash) {
          console.log(`Block #${blockHeight} is valid block`);
          resolve(true);
        } else {
          console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + ' <-> ' + validateBlockHash);
          resolve(false);
        }
      })
    })
  }

  async validateChain() {
    let isBlockchainValid = true;
    const height = await this.getBlockHeight();
    const errorLog = [];
  
    const reportError = errorBlock => errorLog.push(errorBlock);

    for (let i=0; i < height; i++) {
      await logGet(i, async (err, block, done) => {
        if (err) return console.error(err);

        // Invoke validateBlock function to check validity of the block
        const isBlockValid = await this.validateBlock(block.height);
        

        // Check if blockchain is valid
        if (!isBlockValid) {
          reportError(block);
        }

        // Check validity of the links between blocks
        if (i+1 < height) {
          await logGet(i+1, (err, nextBlock, finish) => {
            if (err) return console.error(err);
            if (block.hash !== nextBlock.previousBlockHash) {
              reportError(block)
              console.log(`Block #${block.height} and Block #${nextBlock.height} link is invalid`)
            }
            finish();
          })
        }
        
        done();
      })
    }
    
    if (errorLog.length > 0) {
      console.log(boxen('Blockchain is invalid', { padding: 1 }));
      console.log('=== Corrupted Blocks ===');
      console.log(errorLog);
    } else {
      console.log(boxen('Blockchain is valid', { padding: 1 }));
    }
  }

  async list() {
    const height = await this.getBlockHeight();

    for (let i=0; i < height; i++) {
      log.get(i, (err, block) => {
        if (err) return console.error(err);
        console.log(block)
      })
    }
  }
}

const blockchain = new Blockchain();

// TODO: fix bug. New block creates before Genesis block
// === Create new block ===
// blockchain.addBlock('test');

// === Validate block ===
// blockchain.validateBlock(2);

// === Validate chainz of blockz 🥕 ===
// blockchain.validateChain();

// === List blocks ===
// blockchain.list();

// === GET Block ===
// (async () =>
//   console.log(await blockchain.getBlock(0)))()

// === GET Blockchain length ===
// (async () =>
//   console.log(await blockchain.getBlockHeight()))();