const moment = require('moment');
const Blockchain = require('../../blockchain/blockchain');
const blockchain = new Blockchain();
const list = {};

// Documentation of API
exports.home = (req, res) => {
	return res.json({ 
		status: 'ok' ,
		message: 'Welcome to private blockchain API'
	});
};

// Get Genesis Block
exports.genesisBlock = async (req, res) => {
	const genesisBlock = await blockchain.getBlock(0);
	return res.json(genesisBlock);
};

// Get block by block number(height)
exports.getBlock = async (req, res) => {
	try {
		const height = await blockchain.getBlockHeight();
		if (req.params.blockNumber > height) {
			return res.json({
				status: 'failed',
				message: `block with blockNumber #${req.params.blockNumber} doesn't exist`
			})
		}
		const block = await blockchain.getBlock(parseInt(req.params.blockNumber));
		return res.json(block);
	} catch(error) {
		return res.json({
			status: 'failed',
			message: error
		})
	}
};

// Add new block
exports.addBlock = async (req, res) => {
	console.log(req.body.body);
	try {
		if(!req.body.body) {
			return res.json({
				status: 'failed',
				message: 'please provide data'
			})
		}
		await blockchain.addBlock(req.body.body);
		const height = await blockchain.getBlockHeight();
		const response = await blockchain.getBlock(height);
		return res.json(response);
	} catch(error) {
		return res.json({
			status: 'failed',
			message: error
		})
	}
};

// Request validation of message
exports.requestValidation = (req, res) => {
	const { address } = req.body;
	const currentTime = moment().unix();
	let response;
	
	// If - the address is not saved yet
	if(!list.hasOwnProperty(address)) {
		// Save it
		list[address] = {
			address,
			requestTimeStamp: currentTime,
			message: `${address}:${currentTime}:starRegistry`,
			validationWindow: 300,
		};
		// Save response to response variable
		response = list[address];
	} else { // Else - the address is saved already
		// If - it is expired
		if((list[address].requestTimeStamp + 300) < currentTime) {
			delete list[address];
			// Save expires into response variable 
			response = { message: "Request time has expired" };
		} else { // Else - it is not expired
			// Save json response to response variable
			list[address].validationWindow = (list[address].requestTimeStamp + list[address].validationWindow) - currentTime;
			response = list[address];
		}
	}
	
	// Send
	return res.json(response);
}

