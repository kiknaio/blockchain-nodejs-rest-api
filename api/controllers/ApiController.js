const moment = require('moment');
const Blockchain = require('../../blockchain/blockchain');
const bitcoinMessage = require('bitcoinjs-message');
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

exports.messageSignatureValidation = (req, res) => {
  const { address, signature } = req.body;
  const currentTime = moment().unix();
  console.log(list[address].requestTimeStamp + 300, currentTime);

  // Check if address has been already validated and validation is not expired
  if(!list.hasOwnProperty(address) || (list[address].requestTimeStamp + 300) < currentTime) {
    return res.json({
      status: 'error',
      message: 'Address has no validation or validation time has already been expired.'
    });
  }

  const isSignatureValid = bitcoinMessage.verify(list[address].message, address, signature);
  console.log(isSignatureValid)

  list[address].validationWindow = (list[address].validationWindow + 300) - currentTime;
  list[address].messageSignature = isSignatureValid ? "valid" : "invalid";

  // If signature is right
  if(isSignatureValid) {
    return res.json({
      registerStar: true,
      status: list[address],
    });
  } else {
    list[address].valid = true;
    return res.json({
      registerStar: false,
      status: "error",
      message: "Signature is invalid"
    })
  }
};

exports.registerStar = async (req, res) => {
  const { address, star } = req.body;

  if(!list.hasOwnProperty(address) || !list[address].messageSignature) {
    return res.json({
      status: "error",
      message: "Address is not registered or validated. Please check",
    });
  }

  await blockchain.addBlock({
    address,
    star
  });

  // Get last block and send it as a response;
  const height = await blockchain.getBlockHeight();
  return res.json(await blockchain.getBlock(height));
};

exports.searchByAddress = async (req, res) => {
  const { address } = req.params;

  const height = await blockchain.getBlockHeight();
  let blocks = [];

  for (let i=0; i < height; i++) {
    let block = await blockchain.getBlock(i);
    blocks.push(block);
  }

  blocks = blocks.filter(item => item.body.address === address);

  if (blocks.length <= 0) {
    return res.json({
      status: 'error',
      message: 'There are no entries on this address',
    })
  }

  return res.json({ blocks });
}
