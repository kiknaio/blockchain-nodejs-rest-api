/**
 * ApiController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Blockchain = require('../../blockchain/blockchain');
const blockchain = new Blockchain();

module.exports = {
	// Documentation of API
  home: (req, res) => {
    return res.json({ 
    	status: 'ok' ,
    	message: 'Welcome to private blockchain API'
    });
  },
	// Get Genesis Block
  genesisBlock: async (req, res) => {
  	const genesisBlock = await blockchain.getBlock(0);
  	return res.json(genesisBlock);
  },
	// Get block by block number(height)
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
	},
	// Add new block
	addBlock: async (req, res) => {
		console.log(req.body.data);
		try {
			const test = await blockchain.addBlock(req.body.data);
			const height = await blockchain.getBlockHeight();
			const response = await blockchain.getBlock(height);
			return res.json(response);
		} catch(error) {
			return res.json({
				status: 'failed',
				message: error
			})
		}
		
	}
};

