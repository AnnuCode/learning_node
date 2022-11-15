const path  = require('path')
const fsPromises = require('fs').promises
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data){
        this.users = data
    }
}

const handleLogout = async(req, res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt
    //check for refreshToken in db to ensure that the same user is trying to logout which has loggedin
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
    if(!foundUser) {
        //clear the cookies as it is not supposed to be present if the above check failed
        res.clearCookie('jwt', {httpOnly: true, maxAge: 24*60*60*1000, sameSite: 'None'})
        res.sendStatus(204) //no content
    }
    //clearing the cookie from db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)
    const currentUser = {...foundUser, refreshToken: ''}
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), 
    JSON.stringify(usersDB.users)    
    )

    //clearing the cookie from response so that any future requests from this user will not contain this cookie as desired after pressing logout button (this means that refresh endpoint must be hitting automatically after login, how?)
    res.clearCookie('jwt', {httpOnly: true, sameSite:'None', maxAge: 24*60*60*1000})
    res.sendStatus(204)
    
}
module.exports = {handleLogout}