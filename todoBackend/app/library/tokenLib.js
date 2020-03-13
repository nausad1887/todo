const shortid = require('shortid')
const jwt = require('jsonwebtoken')
const response = require('./responseLib')
const logger = require('./loggerLib')
const secretKey = "mySecretKeyThatNoOneKnowsInHisWildDream"


let generateToken = (userDetails, callback) => {
  let claims = {
    jwtid: shortid.generate(),
    iat: Date.now(),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
    sub: 'authToken',
    iss: 'todoApp',
    data: userDetails
  }
  jwt.sign(claims, secretKey, function(err, token){
    if (err) {
      console.log("error while generating token");
      console.log(err);
      callback(err, null)
    }
    else {
      console.log("token generated");
      console.log(token);
      let tokenDetails={
        token:token,
        secretKey:secretKey
      }
      callback(null, tokenDetails);
    }
  })
  
    
}

let verifyClaim = (token, secretKey, cb) => {
  // verify a token symmetric
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      console.log("error while verify token");
      console.log(err);
      cb(err, null)
    }
    else {
      console.log("user verified");
      console.log(decoded);
      cb(null, decoded);
    }
  });
}// end verify claim 

let verifyClaimWithoutSecret = (token, cb) => {
  jwt.verify(token, secretKey, function (err, data) {

    if (err) {
      console.log('Error while verify token')
      console.log(err)
      cb(err, null)

    } else {
      console.log('User verified in tokenLib')
      console.log(data)
      cb(null, data)
    }


  });
}


module.exports = {
  verifyClaim: verifyClaim,
  verifyClaimWithoutSecret: verifyClaimWithoutSecret,
  generateToken:generateToken
}