const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");
require("dotenv").config();

const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const loginHandler = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required!" });
  const foundUser = userDB.users.find((person) => person.username === username);
  if (!foundUser) return res.status(401); //unauthorized

  const match = await bcrypt.compare(password, foundUser.password);
  //extracting roles of the user trying to login
  const roles = Object.values(foundUser.roles);
  if (match) {
    //create jwt(access token and refresh token), save refreshToken with currentUser
    //why to save refreshToken with the currentUser? so that the refresh token will be invalid if the user logsout before the expiry of refresh Token

    //extracting roles of the user trying to login
    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          //why the username and its keys are in string? Mimicing the json syntax?
          username: foundUser.name,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      //no need to pass roles of a user while creating a refresh token
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const otherUsers = userDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(userDB.users)
    );
    //setup JWT in cookies
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
    // res.status(201).json({ message: `${username} logged in!` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { loginHandler };

// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }
// const bcrypt = require('bcrypt');

// const handleLogin = async (req, res) => {
//     const { user, pwd } = req.body;
//     if (!user || !pwd) return res.status(400).json({ 'message': 'No no wait a minute.' });
//     const foundUser = usersDB.users.find(person => person.username === user);
//     if (!foundUser) return res.sendStatus(401); //Unauthorized
//     // evaluate password
//     const match = await bcrypt.compare(pwd, foundUser.password);
//     if (match) {
//         // create JWTs
//         res.json({ 'success': `User ${user} is logged in!` });
//     } else {
//         res.sendStatus(401);
//     }
// }

// module.exports = { handleLogin };
