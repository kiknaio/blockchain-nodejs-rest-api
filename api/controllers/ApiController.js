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
    return res.json({ 
    	status: 'ok' ,
    	message: 'Welcome to private blockchain API'
    });
  },

  genesisBlock: async (req, res) => {
  	const genesisBlock = await blockchain.getBlock(0);
  	return res.json(genesisBlock);
  },

  getBlock: async (req, res) => {
  	try {
	    const block = await blockchain.getBlock(parseInt(req.params.blockNumber));
	    return res.json(block);
  	} catch(error) {
  		return res.json({
  			status: 'failed',
  			message: error
  		})
  	}
    
  }
};

