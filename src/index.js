const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const Filter = require('bad-words')
const {generateMessage} = require('./utils/messages')

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
    socket.emit('message',generateMessage('Welcome'))
    socket.broadcast.emit('message',generateMessage('A new user has joined'));

    // socket.on('sentall',(message)=>{
    //     console.log(message);
    // })

    socket.on('sentall',(message,callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        
        io.emit('message',generateMessage(message))
        callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('locationMessage',`https://google.com/maps?q=${ coords.latitude},${coords.longitude}`)
        callback()
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
        io.emit('message',generateMessage('A user has left'));
    })
});

server.listen(port,()=>{
    console.log(`server is up on port ${port}!`)
})