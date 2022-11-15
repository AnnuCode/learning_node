// //check if the username or password already exists
// //use bcrypt to hash password
// //make a data object with users and setUsers function

const bcrypt = require("bcrypt");
const path = require("path");
const fsPromises = require('fs').promises

const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleNewUser = async(req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and Password are required!" });

  const duplicate = userDB.users.find(
    (person) => person.username === username || person.password === password
  );
  if (duplicate) return res.status(409);

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username: username,
      password: hashPassword,
      roles: {"User": 2001}
    };
    userDB.setUsers([...userDB.users, newUser]);
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users)) //why writeFile is used instead of appendFile ?
    console.log(newUser)
    res.status(201).json({"message": `User: ${username} created!`})
  } catch (error) {
    res.status(500).json({'message': error.message})
  }
};
module.exports = {handleNewUser}  //understand why this is being exported as an object

//Practice session

// const bcrypt = require('bcrypt')
// const fsPromises = require('fs').promises
// const path = require('path')

// const UserDb = {
//   users: require('../model/users.json'),
//   setUsers: function(data){
//     this.users = data
//   }
// }

// const handleNewUser = async(req, res)=>{
//   const {pwd, username} = req.body
//   if(!pwd || !username){
//     res.status(401).json({'message': 'Username & password are required!'})
//   }
//   const duplicate = UserDb.users.find(user => user.username === username)
//   if (duplicate){
//     res.status(409)
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(pwd, 10)
//     const newUser = {
//       username: username,
//       password: hashedPassword
//     }
  
//     UserDb.setUsers([...UserDb.users, newUser])
//     fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(UserDb.users))
//     res.status(201).json({'message': `User ${username} created!`})
//   } catch (error) {
//     res.status(500).json({"message": `${error.message}`})
//   }
  
// }