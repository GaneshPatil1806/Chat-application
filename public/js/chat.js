const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML

//Options 
const {username,room} = Qs.parse(location.search,{'ignoreQueryPrefix':true})
 
socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html) 
})

socket.on('locationMessage',(component)=>{
    //console.log(url)
    //short hand syntax
    const html = Mustache.render(locationTemplate,{
        url:component.url,
        createdAt:moment(component.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html) 
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

// socket.on('countUpdated',(count)=>{
//     console.log('Count has been updated',count);
// })

socket.emit('join',{username,room})