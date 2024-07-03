const fromInput = document.getElementById('from-input');
const messageInput = document.getElementById('message-input');
const messageForm = document.getElementById('message-form');
const messageList = document.getElementById('messages');

const updateMessages = (messages) => {
  console.log(messages);
  messageList.innerHTML = '';
  messages.forEach((message) => {
    const fromPara = document.createElement('p');
    fromPara.appendChild(document.createTextNode(`From: ${message.from}`));
    const messagePara = document.createElement('p');
    messagePara.appendChild(document.createTextNode(`Message: ${message.message}`));
    messageList.appendChild(fromPara);
    messageList.appendChild(messagePara);
    messageList.appendChild(document.createElement('hr'))
  });
}

const getMessages = () => {
  fetch('/api/messages')
    .then((res) => res.json())
    .then(updateMessages)
}

messageForm.onsubmit = (e) => {
  e.preventDefault();
  const body = {
    from: fromInput.value,
    message: messageInput.value
  }
  console.log(body);
  const request = new Request('/api/messages', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': "application/json"
    }
  })
  fetch(request)
    .then(() => { getMessages(); })
}

getMessages();