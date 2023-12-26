const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const Filter = require('bad-words')

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

    socket.broadcast.emit('message','A new user has joined')
    // socket.on('sentall',(message)=>{
    //     console.log(message);
    // })

    socket.on('sentall',(message,callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        
        io.emit('message',message)
        callback()
    })

    socket.on('sendLocation',(message)=>{
        io.emit('message',`https://google.com/maps?q=${ message.latitude},${message.longitude}`)
    })
    
    //socket.emit('countUpdated',count)
    // client(emit)->server(receives) ->increment
    // server(emit)->client(receives) ->countUpdated

    // socket.on('increment',()=>{
    //     count++;
        // socket.emit('countUpdated',count)
    //     io.emit('countUpdated',count)
    // })

    socket.on('disconnect',()=>{
        io.emit('message','A user has left');
    })
});

server.listen(port,()=>{
    console.log(`server is up on port ${port}!`)
})