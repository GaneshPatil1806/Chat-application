const socket = io()

// socket.on('countUpdated',(count)=>{
//     console.log('Count has been updated',count);
// })

socket.on('message',(message)=>{
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()

    //const message = document.querySelector('input').value

    const message = e.target.elements.message_in.value
    socket.emit('sentall',message,(error)=>{
        if(error){
            return console.log(error);
        }
        
        console.log('The message was delivered!');
    })
})

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked');
//     socket.emit('increment')
// })

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser!')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        // const msg = 'Location: '+  position.coords.latitude + ', ' + position.coords.longitude;
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
    })
})