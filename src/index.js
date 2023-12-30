const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const Filter = require('bad-words')
const {generateMessage,generateUrl} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express();
// not necessury 
const server = http.createServer(app)
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDiretoryPath = path.join(__dirname,"../public")
app.use(express.static(publicDiretoryPath))
 
io.on('connection', (socket) => {
    // When new connection is created
    console.log("New websocket connection")

    socket.on('join',({username,room},callback)=>{
        
        const { error, user } = addUser({id:socket.id, username, room})
        
        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message',generateMessage('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined `));
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sentall',(message,callback)=>{

        const user = getUser(socket.id)

        if(!user){
            return callback('User is undefined')
        }

        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateUrl(user.username,`https://google.com/maps?q=${ coords.latitude},${coords.longitude}`))
        callback()
    })
    
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left`));
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })
});

server.listen(port,()=>{
    console.log(`server is up on port ${port}!`)
})

//socket.emit('countUpdated',count)
    // client(emit)->server(receives) ->increment
    // server(emit)->client(receives) ->countUpdated

    // socket.on('increment',()=>{
    //     count++;
        // socket.emit('countUpdated',count)
    //     io.emit('countUpdated',count)
    // })

// socket.emit, io.emit, socket.broadcast.emit
// io.to.emit- emits event in the specific room, socket.broadcast.to.emit

// const { error, user } = addUser({id:socket.id, username, ...options})