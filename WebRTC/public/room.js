const socket = io('/')

deepai.setApiKey('73561d32-dcb8-4387-9d6c-e83d0350e158');
let imgUrl;

const videoGrid = document.getElementById('video-grid')

const roomCode = document.getElementById('room-code')
roomCode.innerHTML = ROOM_ID

const myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

let myVideoStream;
let myUserId;
let myUsername;

let gotUserMedia = false

document.getElementById('container').style.display = 'none';
document.getElementById('unmute').style.display = 'none';
document.getElementById('showVideo').style.display = 'none';
document.getElementById('aicontainer').style.display = 'none';

let nameInput = document.getElementById('name')
nameInput.addEventListener('keyup', function(event){
    event.preventDefault()
    if(event.key === 13 || event.key === 'Enter'){
        checkName()
    }
})


function checkName(){
    myUsername = document.getElementById('name').value;
    if(myUsername != ''){
        document.getElementById('name').style.borderBottomColor = 'rgba(255, 255, 255, 0.329)';
        if(gotUserMedia){
            document.getElementById('setup').classList.add('fadeOut')
            setTimeout(() => {
                document.getElementById('setup').style.display = 'none'
                document.getElementById('container').style.display = 'flex'
                document.getElementById('container').classList.add('fadeIn')
                document.getElementById('previewVideo').remove()
            }, 500)
            socket.emit('connect-message', myUsername)
        } else{
            document.getElementById('error').innerHTML = 'No camera found or no permission granted. Please grant permission and refresh the page.'
        }
    } else{
        document.getElementById('name').style.borderBottomColor = 'rgba(245, 37, 37, 0.603)';
    }
}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    gotUserMedia = true

    let video = document.createElement('video')
    video.id = 'previewVideo'
    video.srcObject = stream
    video.autoplay = true
    video.muted = true
    document.getElementById('setup').append(video)

    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        console.log('call')
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        console.log('User connected: ' + userId)
        connectToNewUser(userId, stream)
    })

    let input = document.getElementById('input')
    input.addEventListener('keyup', function(event){
        event.preventDefault()
        if(event.key === 13 || event.key === 'Enter'){
            if(input.value != ''){
                socket.emit('message', {value: input.value, userId: myUserId, userName: myUsername})
                input.value = ''
            }
        }
    })

    socket.on('createMessage', message => {
        let chat = document.getElementById('chat')
        let msg = document.createElement('p')
        let username = document.createElement('span')
        if(message.userId == myUserId){
            msg.className = 'my-message'
            username.className = 'my-username'
            username.innerHTML = 'You'
        } else{
            username.innerHTML = message.userName
        }
        msg.innerHTML = message.value
        msg.classList.add(message.userId)

        let lastMsg = document.getElementById('chat').lastChild;
        if(!lastMsg.classList.contains(message.userId)){
            chat.append(username)
        } else{
            msg.classList.add('followup-msg')
        }

        chat.append(msg)
        scrollToBottom()
    })

    socket.on('createConnectMessage', username => {
        let chat = document.getElementById('chat')
        let servermsg = document.createElement('span')
        servermsg.className = 'server-msg'
        servermsg.innerHTML = username + ' connected'
        chat.append(servermsg)
    })

    socket.on('createDisonnectMessage', username => {
        let chat = document.getElementById('chat')
        let servermsg = document.createElement('span')
        servermsg.className = 'server-msg'
        servermsg.innerHTML = username + ' disconnected'
        chat.append(servermsg)
    })

}).catch(err => {
    console.log(err)
})

socket.on('user-disconnected', userId => {
    console.log('User disconnected: ' + userId);
    if(peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
    myUserId = id
})

function sendMessage(){
    let input = document.getElementById('input')
    if(input.value != ''){
        socket.emit('message', {value: input.value, userId: myUserId, userName: myUsername})
        input.value = ''
    }
}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.autoplay = true
    videoGrid.append(video)
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
}

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        console.log('stream')
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        console.log('close')
        video.remove()
    })

    peers[userId] = call
}

function copyCode(){
    navigator.clipboard.writeText(ROOM_ID)
}

function toggleMute(){
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        document.getElementById('mute').style.display = 'none';
        document.getElementById('unmute').style.display = 'block';
    } else{
        myVideoStream.getAudioTracks()[0].enabled = true;
        document.getElementById('mute').style.display = 'block';
        document.getElementById('unmute').style.display = 'none';
    }
}

function toggleVideo(){
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        document.getElementById('hideVideo').style.display = 'none';
        document.getElementById('showVideo').style.display = 'block';
    } else{
        myVideoStream.getVideoTracks()[0].enabled = true;
        document.getElementById('hideVideo').style.display = 'block';
        document.getElementById('showVideo').style.display = 'none';
    }
}

function scrollToBottom(){
    let chat = document.getElementById('chat')
    chat.scrollTop = chat.scrollHeight
}

function viewImage(){
    document.getElementById('aicontainer').style.display = 'block'
    if(!imgUrl){
        getImage().then((resp) => {
            document.getElementById('aiimage').src = resp.output_url
            imgUrl = resp.output_url
        })
    }
}

async function getImage(){
    let input = ROOM_ID.replaceAll('-', ' ')
    var resp = await deepai.callStandardApi("text2img", {
        text: input,
    });
    return resp
}

function closeImage(){
    document.getElementById('aicontainer').style.display = 'none';
}

tippy('#copyCode', {
    content: 'Copied!',
    trigger: 'click'
});

tippy('#copyCode', {
    content: 'Copy to clipboard',
});

tippy('#viewImage', {
    content: 'View AI Generated Image',
});

window.onbeforeunload = function(){
    socket.emit('disconnect-message', myUsername)
};