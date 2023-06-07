const newUser = require('./newUser');
const validateUser = require('./validateUser');
const loginUser = require('./loginUser');
const getUser = require('./getUser');
const getOwnUser = require('./getOwnUser');
const sendRecoverPass = require('./sendRecoverPass');
const editUserPass = require('./editUserPass');
const editUserAvatar = require('./editUserAvatar');

module.exports = {
    newUser,
    validateUser,
    loginUser,
    getUser,
    getOwnUser,
    sendRecoverPass,
    editUserPass,
    editUserAvatar,
};
