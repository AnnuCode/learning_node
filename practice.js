//how to make a logger?
//a funtion which will take in arguments for filename, message. Then use fs.appendFile
//what is the alternative way of fs.promises? Using plain fs
//without promises I had to use callbacks I guess? I had to consider the order in which I was passing commands like a waterfall. 
//it was most probably in an earlier lesson
//understand the difference between appendFile and readFile
//appendFile creates a new file(the content of the new file is specified in the command) while readFile reades and stores the data in a variable
//also revise how the logEvent is working, after using an event object from the Event class. So we are actially not emitting events like we did in 
//in chapter 2. Here we are just invoking the logger whenever required. More specifically we are using the loggers to log an error or a request. 
//using logger in the middlewares by running app.use(logger).

// function Period (hours, minutes) {
//     // console.log(global === this)  //why 'this' here is not the global object? 
//     this.hours = hours;
//     this.minutes = minutes;
//   }
// //   Period.prototype.format = function() {
// //     console.log(this === walkPeriod); // => true
// //     return this.hours + ' hours and ' + this.minutes + ' minutes';
// //   };
//   const walkPeriod = new Period(2, 30);
// //   walkPeriod.format(); // => '2 hours and 30 minutes'
// // console.log(walkPeriod.hours === 2

// const data = {
//     employees: require('./model/employees.json'),
//     setEmployees: function(data){
//         console.log(this)      //this refers to the data object here. Why not the global object? The answer is at the invocation step.  
//         this.employees = data
//         }
// }

// data.setEmployees() //because of this invocation the context is data. 

// app.get('/', (req,res)=>{

// })

const messi = [2,3,5,1,6,4,88,44]
// const result = messi.sort((a,b)=> a>b? 1 : a<b? -1 : 0)
// console.log(result)
console.log(messi === [...messi]) //spred operator makes a new array
