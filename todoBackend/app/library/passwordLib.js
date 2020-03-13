const bcrypt = require('bcryptjs');
const response = require('../library/responseLib')
const saltRounds = 10;

let generateHash = (myPlaintextPassword) => {

    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(myPlaintextPassword, salt);
    return hash
    // Store hash in your password DB.
}
let comparePassword = (newPassword, oldPassword) => {
    let password = bcrypt.compareSync(newPassword, oldPassword); // true
    if (password === true) {
        return true
    } else {
        return false
    }
}

module.exports = {
    generateHash: generateHash,
    comparePassword: comparePassword
}







