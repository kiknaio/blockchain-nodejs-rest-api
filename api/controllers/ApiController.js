/**
 * ApiController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Blockchain = require('../../blockchain/blockchain');
const blockchain = new Blockchain();

module.exports = {
  list: (req, res) => {
    return res.json({ status: 'Hello World' });
  },
  getBlock: async (req, res) => {
    const genesisBlock = await blockchain.getBlock(0);
    return res.json({ blockNumber: req.params.blockNumber });
  }
};

