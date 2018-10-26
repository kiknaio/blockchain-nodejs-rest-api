# Blockchain Notary Service - 1.0.1

a [Sails v1](https://sailsjs.com) application

**Requirements**
- Node version > 10

**How to start project**

- `npm start` - Start service (only production version)
- `npm run dev` - Run development version
- `npm test` - Test application (generates address, signs the message and saved the data on blockchain).

### Validate Address
**All variables provided with the endpoints are `req.body` variables**

You need to validate your address in order to use it for star submission.

- **address** - Address format should be Bitcoin p2pkh format.

```POST /requestValidation```

Response:
```json
{
    "address": "YOUR_ADDRESS",
    "requestTimeStamp": 1540550052,
    "message": "YOUR_ADDRESS:1540550052:starRegistry",
    "validationWindow": 300
}
```

### Validate signature

After you have submitted your address, you will have 5 minutes to make a signature (in order to proof your address identity).

```
signature = sign_message(message, privateKey, address)
```

This service uses two lbiraries for signature:
- bitcoinjs-message
- bitcoinjs-lib

You need to provide next data in order to validate the signature
- address
- signature
  
```POST /message-signature/validate```

Response:
```json
{
    "registerStar": true,
    "status": {
        "address": "YOUR_ADDRESS",
        "requestTimeStamp": 1540550052,
        "message": "YOUR_ADDRESS:1540550052:starRegistry",
        "validationWindow": 135,
        "messageSignature": "valid"
    }
}
```


### Submit a start entry

Saved data will be then provided as a block entry.

Data you need:
- address
- star object will all the details

Here's an example of how star coordinates look like:

```RA 13h 03m 33.35sec, Dec -49° 31’ 38.1” Mag 4.83 Cen```

- **RA** = Right Ascension
- **DEC** = Declination
- **CEN** = Centaurus
- **MAG**  = Magnitude

_Note: Mag stands for magnitude, which is the brightness of the star._

##### Start object example
```json
"star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
    }
```

```POST /block```


### Lookup entries

Service provides multiple ways to find the entry.
- Records by address
- Record by hash
- Record by block number


```GET /stars/address/:address```

```GET /stars/hash/:hash'```

```GET /block/:blockNumber```

##### Response example:
```json
{
    "hash": "a78252160c9f3f9ca2558803e5c1dda67ab04aa4d74937abee2f1ad67bf4a736",
    "height": 1,
    "body": {
        "address": "1F5VhMHukdnUES9kfXqzPzMeF1GPHKiF64"
    },
    "time": "1540549982",
    "previousBlockHash": "2e2879bba6898cc80d800f8a94b58a9cd2f9bd1f3a692eb694602c4a33d66f66"
}
```


### Version info

This app was originally generated on Mon Aug 27 2018 22:21:48 GMT+0200 (Central European Summer Time) using Sails v1.0.2.

- Updated Friday October 26, 2018 
