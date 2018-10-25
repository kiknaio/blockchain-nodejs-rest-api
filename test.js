const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

const deterministicRange = () => Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');

// Generate address
const keyPair = bitcoin.ECPair.makeRandom({ rng: deterministicRange });
const add = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });

// Sign message
const privateKey = keyPair.privateKey;
const message = "This is an example";
const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
console.log(signature.toString());