
const responseLib=require('../library/responseLib')
const logger=require('../library/loggerLib')
const mongoose=require('mongoose')
const token=require('../library/tokenLib')
const check=require('../library/checkLib')
require('../model/authModel')
const auth=mongoose.model('Auth')



let authorizationMiddleware=(req, res, next)=>{
    if(req.query.authToken||req.body.authToken||req.params.authToken||req.header('authToken')){
        auth.findOne({authToken: req.header('authToken') || req.params.authToken || req.body.authToken || req.query.authToken}, (err, authDetails) => {
            if (err) {
              console.log(err)
              logger.error(err.message, 'AuthorizationMiddleware', 10)
              let apiResponse = responseLib.generateRes(true, 'Failed To Authorized', 500, null)
              res.send(apiResponse)
            } else if (check.isEmpty(authDetails)) {
              logger.error('No AuthorizationKey Is Present', 'AuthorizationMiddleware', 10)
              let apiResponse = responseLib.generateRes(true, 'Invalid Or Expired AuthorizationKey', 404, null)
              res.send(apiResponse)
            } else {
              token.verifyClaim(authDetails.authToken,authDetails.secretKey,(err,decoded)=>{
      
                  if(err){
                      logger.error(err.message, 'Authorization Middleware', 10)
                      let apiResponse = responseLib.generateRes(true, 'Failed To Authorized', 500, null)
                      res.send(apiResponse)
                  }
                  else{
                      
                      req.user = {userId: decoded.data.userId}
                      next()
                  }
      
      
              });// end verify token
             
            }
          })
        } else {
          logger.error('AuthorizationToken Missing', 'AuthorizationMiddleware', 5)
          let apiResponse = responseLib.generateRes(true, 'AuthorizationToken Is Missing In Request', 400, null)
          res.send(apiResponse)
        
    }
}


module.exports={
    authorizationMiddleware:authorizationMiddleware
}