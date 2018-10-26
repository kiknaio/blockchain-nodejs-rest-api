const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const axios = require('axios');

const deterministicRange = () => Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');

// Generate address
const keyPair = bitcoin.ECPair.makeRandom({ rng: deterministicRange });
const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });

// Sign message
const privateKey = keyPair.privateKey;
const message = "1F5VhMHukdnUES9kfXqzPzMeF1GPHKiF64:1540550052:starRegistry";
const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);

console.log("Address:", address);
console.log("Signature:", signature.toString('base64'));

axios.post('http://localhost:8000/requestValidation', { address })
  .then(response => {
    const signature = bitcoinMessage.sign(response.data.message, privateKey, keyPair.compressed);
    axios.post('http://localhost:8000/message-signature/validate', {
      address,
      signature,
    }).then(res => {
        if(res && res.data.status && res.data.status.messageSignature) {
          axios.post('http://localhost:8000/block', {
            address,
            star: {
              dec: "-26° 29'\'' 24.9",
              ra: "16h 29m 1.0s",
              story: "Found star using https://www.google.com/sky/"
            }
          }).then(r => console.log(r.data)).catch(e => console.log(e));
        } else {
          console.log("Signature verification failed");
        }
      })
      .catch(error => console.log(error));
  })
  .catch(error => console.error(error));
