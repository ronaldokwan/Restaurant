const bcrypt = require("bcrypt");

function hashPassword(pass) {
  return bcrypt.hashSync(pass, bcrypt.genSaltSync(3));
}
function comparePassword(pass, hashedPass) {
  return bcrypt.compareSync(pass, hashedPass);
}

module.exports = { hashPassword, comparePassword };
