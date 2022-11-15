
const allowedOrigins = require('./allowedOrigins')

// const whitelist = ["https://www.google.com", "www.messi.com"];
// console.log(whitelist.indexOf('https://www.google.com/'))
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Go home you are not allowed here!"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions