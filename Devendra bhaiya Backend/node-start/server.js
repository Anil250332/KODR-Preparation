const http = require('http')

const server = http.createServer((req, res) => {     
    console.log("server is running")
    if(req.url === '/products'){
        res.end("products find")
    }

    if(req.url === '/users'){
        res.end("users find")
    }



})

server.listen(3000)
