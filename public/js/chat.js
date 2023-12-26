const socket = io()

// socket.on('countUpdated',(count)=>{
//     console.log('Count has been updated',count);
// })

socket.on('message',(message)=>{
    console.log('The message ',message)
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()

    const message = document.querySelector('input').value
    socket.emit('sentall',message)
})

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked');
//     socket.emit('increment')
// })