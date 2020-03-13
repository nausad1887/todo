
const response = require('../library/responseLib')

let errorHandler = (err, req, res, next) => {
    console.log("Error Handler Called")
    console.log(err)
    let apiResponse = response.generateRes(true, 'Global Error Handler Called', 500, null)
    res.send(apiResponse)
}

let notFoundHandler = (req, res, next) => {
    console.log('Global Not Found Handler Called')
    let apiResponse = response.generateRes(true, 'Route not found in the application', 404, null)
    res.send(apiResponse)
}

module.exports = {
    errorHandler: errorHandler,
    notFoundHandler: notFoundHandler
}