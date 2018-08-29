# Simplechain REST API

a [Sails v1](https://sailsjs.com) application

**Requirements**
- Node version > 10


### Test commands
* Add new block
```
curl -X "POST" "http://localhost:1337/block" \
     -H 'Content-Type: application/json' \
     -d $'{
  "body": "Testing block with test string data"
}'
```
* Get block by numer
```
curl "http://localhost:1337/block/1"
or
curl "http://localhost:1337/block/" // to get genesis block
```


### Version info

This app was originally generated on Mon Aug 27 2018 22:21:48 GMT+0200 (Central European Summer Time) using Sails v1.0.2.
