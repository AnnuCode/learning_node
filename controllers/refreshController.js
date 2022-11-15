// const userDb = {
//     users: require('../model/users.json'),
//     setUsers: function(data){
//         this.users = data
//     }
// }
// const jwt = require('jsonwebtoken')
// require('dotenv').config()

// const handleRefreshToken = (req,res)=>{
//     const cookies = req.cookies
//     if(!cookies?.jwt) return res.sendStatus(401)
//     const refreshToken = cookies.jwt
//     const foundUser = userDb.users.find(person.refreshToken === refreshToken)
//     if(!foundUser) return res.sendStatus(403)
//     jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET,
//         (err,decoded)=>{
//             if(err || foundUser.username !== decoded.username ) return res.sendStatus(403)
//             const accessToken = jwt.sign(
//                 {"username": decoded.username},
//                  process.env.ACCESS_TOKEN_SECRET,
//                  {expiresIn: '30s'}   
//             )
//             res.json({accessToken})
//         }
//     )
// }
// module.exports = handleRefreshToken

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    
    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(req.cookies.jwt)
    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = object.values(foundUser.roles)
            const accessToken = jwt.sign(
                { 
                    userInfo:{
                        "username": decoded.username,
                        "roles": roles
                    }
                 },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        }
    );
   
}

module.exports = { handleRefreshToken }