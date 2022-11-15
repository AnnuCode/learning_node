const path = require("path");
const express = require("express");
const { urlencoded } = require("express");
const { logger } = require("./middlewares/logEvents");
const errorHandler = require("./middlewares/ErrorLog");
const PORT = process.env.PORT || 3500;
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions")
const verifyJWT = require("./middlewares/verifyJWT")
const cookieParser = require("cookie-parser");
const credentials = require("./middlewares/credentials");

//custom middlewares

app.use(logger);
app.use(credentials) //to be placed before cors line

// const whitelist = ["https://www.google.com", "www.messi.com"];
// // console.log(whitelist.indexOf('https://www.google.com/'))
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Go home you are not allowed here!"));
//     }
//   },
//   optionsSuccessStatus: 200,
// };
app.use(cors(corsOptions));

//built in middlewares

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())

//serving static files
app.use(express.static(path.join(__dirname, "/public")));
app.use('/subdir',express.static(path.join(__dirname, "/public")));


//routes

app.use("/", require("./routes/root"))
app.use("/subdir", require("./routes/subdir")); // why creating a route here is required? Because this is the file which is running in a waterfall way
  //what was used before require here? Answer can be found in the step when the routes were not in a separate file.
app.use("/register", require("./routes/register"))
app.use("/auth", require("./routes/auth"))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require("./routes/logout"))
app.use(verifyJWT)
app.use("/employees", require("./routes/api/employees"))
// app.get(
//   "^/$|/index(.html)?",
//   (req, res, next) => {
//     next();
//   },
//   (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "index.html"));
//   }
// );
// // app.get('/old-page(.html)?', (req,res,next)=>{
// //     res.redirect(301, '/new-page.html')
// // })
// app.get("/new-page(.html)?", (req, res) => {
//   //first serving this file is essential to be able to redirect to it
//   res.sendFile(path.join(__dirname, "views", "new-page.html"));
// });

// app.get("/old-page(.html)?", (req, res) => {
//   res.redirect(301, "/new-page.html"); //302 by default
// });

// const one = (req, res, next) => {
//   console.log("this is one");
//   next();
// };
// const two = (req, res, next) => {
//   console.log("this is second");
//   next();
// };
// const three = (req, res) => {
//   console.log("this is third");
//   res.send("Finally");
// };

// app.get(
//   "/messi(.html)?",
//   (req, res, next) => {
//     //remember that positioning matters because of the waterfall way of action
//     res.sendFile(path.join(__dirname, "views", "new-page.html"));
//     next(); //the above action is replaced by the action being referred by next()
//   },
//   (req, res) => {
//     res.end("Messi was here!");
//   }
// );

// app.get("/chain(.html)?", [one, two, three]);
//  app.get('/*',(req,res)=>{
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
//  })

//app.all accepts regex and can be used for both middlewares and route handling.

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("text").send("File not found"); //send sends the response without ending the request unlike res.end()
  }
});

//error handling
app.use(errorHandler); //this handler also helps in logging the error in a separate text file

app.listen(PORT, () => console.log(`Server started on ${PORT}`)); //this could've been done inline too while defining app.
