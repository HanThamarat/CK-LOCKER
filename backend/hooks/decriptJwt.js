const jwt = require('jsonwebtoken');
require('dotenv').config();

const DecriptToken = (req) => {
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) {
        return null;
    }

    const UserData = jwt.verify(token, process.env.SECRET_JWT);

    return UserData;
}

module.exports = DecriptToken;