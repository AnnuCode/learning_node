// emit and log events
const http = require("http")
const logEvents = require("./logEvents");
const EventEmitter = require("events");
const path = require("path")
const fs = require("fs")
const fsPromises = require('fs').promises;

class Event extends EventEmitter {}
const myEvent = new Event();
const PORT = process.env.PORT || 3500

const serveFile = async(filePath, contentType, response)=> {

    try {
        const rawData = await fsPromises.readFile(
            filePath, 
            !contentType.includes('image')?'utf8': ''
            )
        // const data = await fsPromises.readFile(filePath, 'utf8')
        const data = contentType === 'application/json'? JSON.parse(rawData): rawData
        response.writeHead(filePath.includes('404.html')? 404: 200,                 //revise the concept of response.writeHead()
             {'Content-Type': contentType})
        response.end(contentType==='application/json'?JSON.stringify(data): data)

    } catch (error) {
        console.log(error)
        response.statusCode = 500
        response.end()
    }

}
   


const server = http.createServer((req,res)=>{
        console.log(req.url, req.method)

        const extName = path.extname(req.url)

        let contentType

        switch (extName) {
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.jpg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.txt':
                contentType = 'text/plain';
                break;
            default:
                contentType = 'text/html';
        }
       
       let filePath = 
                        contentType === 'text/html' && req.url === '/' 
                        ? path.join(__dirname, 'views', 'index.html')
                        : contentType === 'text/html' && req.url.slice(-1) === '/'
                        ? path.join(__dirname, views, req.url, 'index.html')
                        : contentType === 'text/html'
                        ? path.join(__dirname, 'views', req.url)
                        : path.join(__dirname, req.url)    

                if(!extName && req.url.slice(-1) !== '/' ) filePath += '.html'

             const fileExist = fs.existsSync(filePath)
             if(fileExist){
                    serveFile(filePath, contentType, res)
             }else{
                // console.log(path.parse(filePath))
                // // 404 or 301
                // switch (path.parse(filePath).base) {
                //     case 'old-page.html':
                //         res.writeHead(301, {'Location': '/new-page.html' })
                //         break;
                //         case 'www-page.html':
                //             res.writeHead(301, { 'Location': '/' });
                //             res.end();
                //             break;
                //     default:
                //        serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
                //         break;

                switch (path.parse(filePath).base) {
                    case 'old-page.html':
                        res.writeHead(301, { 'Location': '/new-page.html' });
                        res.end();
                        break;
                    case 'www-page.html':
                        res.writeHead(301, { 'Location': '/' });
                        res.end();
                        break;
                    default:
                        serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
                }
                }
             


        // if(req.url === '/' || req.url === 'index.html'){
        //     res.statusCode = 200
        //     res.setHeader('Content-Type', 'text/html')
        //     filePath = path.join(__dirname, 'views', 'index.html')
        //     fs.readFile(filePath, 'utf-8', (err, data)=>{
        //         res.end(data)
                
        //     })
        // }

        // switch(req.url){
        //     case '/':
        //         res.statusCode= 200
        //         filePath = path.join(__dirname, 'views', 'index.html')
        //         fs.readFile(filePath, 'utf8', (err, data)=>{
        //             res.end(data)
        //         })
        //         break
        // }

})






// myEvent.on("log", (msg) => logEvents(msg));
// myEvent.emit("log", "log event emitted"); //understand how this message is sent to logEvents()

server.listen(PORT, ()=> console.log(`Server running on ${PORT}`))
