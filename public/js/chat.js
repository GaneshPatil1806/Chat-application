const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $sendLocationButton = document.querySelector('#send-location')

// socket.on('countUpdated',(count)=>{
//     console.log('Count has been updated',count);
// })

socket.on('message',(message)=>{
    console.log(message)
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    //const message = document.querySelector('input').value

    const message = e.target.elements.message_in.value
    socket.emit('sentall',message,(error)=>{
        if(error){
            return console.log(error);
        }

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        console.log('The message was delivered!');
    })
})

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked');
//     socket.emit('increment')
// })

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser!')
    }

    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        // const msg = 'Location: '+  position.coords.latitude + ', ' + position.coords.longitude;
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared');
        })
    }) 
})