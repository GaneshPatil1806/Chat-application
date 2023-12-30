const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const Filter = require('bad-words')
const {generateMessage,generateUrl} = require('./utils/messages')

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

    socket.on('join',({username,room})=>{
        socket.join(room)

        socket.emit('message',generateMessage('Welcome'))
        socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined `));

        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit- emits event in the specific room, socket.broadcast.to.emit
    })

    socket.on('sentall',(message,callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
            $messageFormButton.removeAttribute('disabled')
            return callback('Profanity is not allowed!')
        }
        
        io.emit('message',generateMessage(message))
        callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('locationMessage',generateUrl(`https://google.com/maps?q=${ coords.latitude},${coords.longitude}`))
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