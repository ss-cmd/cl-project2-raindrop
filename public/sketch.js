//Open and connect socket
let socket = io();
const messageContainer = document.getElementById('message-container')

// //connect the trigger with button in the sketch??
// const # = document.getElementById('#')

//user's name
const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)


function setup() {
  //Listen for confirmation of connection
  socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
  })

  socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`)
  })

  socket.on('mousehasclicked', name => {
    appendMessage(`${name} created a raindrop！`)
  })
}

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}



