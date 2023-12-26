const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")

const app = express();
// not necessury 
const server = http.createServer(app)
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDiretoryPath = path.join(__dirname,"../public")
app.use(express.static(publicDiretoryPath))

// let count = 0
// whenever new connection is created  

io.on('connection', (socket) => {

    console.log("New websocket connection")
    socket.emit('welcome',"Welcome!")

    // socket.on('sentall',(message)=>{
    //     console.log(message);
    // })

    socket.on('sentall',(message)=>{
        io.emit('message',message)
    })
    
    //socket.emit('countUpdated',count)
    // client(emit)->server(receives) ->increment
    // server(emit)->client(receives) ->countUpdated

    // socket.on('increment',()=>{
    //     count++;
        // socket.emit('countUpdated',count)
    //     io.emit('countUpdated',count)
    // })
});

server.listen(port,()=>{
    console.log(`server is up on port ${port}!`)
})