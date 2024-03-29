const socket = io('/')

deepai.setApiKey('73561d32-dcb8-4387-9d6c-e83d0350e158');
let imgUrl;

const videoGrid = document.getElementById('video-grid')

const roomCode = document.getElementById('room-code')
roomCode.innerHTML = ROOM_ID

const myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})

const myVideo = document.createElement('video')
myVideo.muted = true
myVideo.poster = 'profile.png'
const peers = {}

let myVideoStream;
let myUserId;
let myUsername = undefined

let typingPeers = []
let isTyping = false

let isTypingMsg = document.getElementById('isTyping')
let timeout = undefined

let gotUserMedia = false

let userHasCamera = false
let userHasAudio = false

let emptyStream = new MediaStream()

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
                if(document.getElementById('previewVideo')) document.getElementById('previewVideo').remove()
            }, 500)
            socket.emit('connect-message', myUsername)
        } else{
            document.getElementById('error').innerHTML = 'Camera or microphone permission denied. Grant permission and refresh page to apply changes.'
        }
    } else{
        document.getElementById('name').style.borderBottomColor = 'rgba(245, 37, 37, 0.603)';
    }
}

navigator.mediaDevices.enumerateDevices().then(devices => {
    var cams = devices.filter(device => device.kind == "videoinput");
    var mics = devices.filter(device => device.kind == "audioinput");

    if(cams.length > 0) userHasCamera = true
    if(mics.length > 0) userHasAudio = true
}).then(() => {
    navigator.mediaDevices.getUserMedia({
        video: userHasCamera,
        audio: userHasAudio
    }).then(stream => {
    
        //WEBCAM AND AUDIO ENABLED
    
        gotUserMedia = true

        if(userHasCamera){
            let video = document.createElement('video')
            video.id = 'previewVideo'
            video.srcObject = stream
            video.autoplay = true
            video.muted = true
            document.getElementById('setup').append(video)
        } else{
            document.getElementById('videoBtn').style.display = 'none'
        }

        if(!userHasAudio){
            document.getElementById('audioBtn').style.display = 'none'
        }

        if(userHasCamera || userHasAudio){
            myVideoStream = stream;
        } else{
            myVideoStream = emptyStream;
        }
        
        addVideoStream(myVideo, myVideoStream)
    
        myPeer.on('call', call => {
            console.log('call', call)
            if(userHasCamera || userHasAudio){
                call.answer(stream)
            } else{
                call.answer(emptyStream)
            }
            peers[call.peer] = call
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                console.log('stream', userVideoStream)
                addVideoStream(video, userVideoStream)
            })
            call.on('close', () => {
                video.remove()
            })
        })
    
        socket.on('user-connected', userId => {
            console.log('User connected: ' + userId)
            connectToNewUser(userId, myVideoStream)
        })
    
        let input = document.getElementById('input')
        input.addEventListener('keyup', function(event){
            event.preventDefault()
            if(event.key === 'Enter'){
                if(input.value != ''){
                    socket.emit('stoppedTyping', {typingUsername: myUsername, typingUserID: myUserId});
                    socket.emit('message', {value: input.value, userId: myUserId, userName: myUsername})
                    isTyping = false
                    clearTimeout(timeout)
                    input.value = ''
                }
            } else if(input.value == ''){
                socket.emit('stoppedTyping', {typingUsername: myUsername, typingUserID: myUserId});
                isTyping = false
                clearTimeout(timeout)
            } else{
                if(isTyping == false) {
                    isTyping = true
                    socket.emit('startedTyping', {typingUsername: myUsername, typingUserID: myUserId});
                    timeout = setTimeout(timeoutFunction, 5000);
                  } else {
                    clearTimeout(timeout);
                    timeout = setTimeout(timeoutFunction, 5000);
                  }
            }
        })
    
        socket.on('createMessage', message => {
            let chat = document.getElementById('chat')
            let msg = document.createElement('p')
            let username = document.createElement('span')
    
            msg.classList.add('animate__animated')
            username.classList.add('animate__animated')
    
            if(message.userId == myUserId){
                msg.classList.add('my-message')
                username.classList.add('my-username')
                username.innerHTML = 'You'
                msg.classList.add('animate__fadeInRight')
                username.classList.add('animate__fadeInRight')
            } else{
                username.innerHTML = message.userName
                msg.classList.add('animate__fadeInLeft')
                username.classList.add('animate__fadeInLeft')
            }
            msg.innerHTML = message.value
            msg.classList.add(message.userId)
    
            let lastMsg = document.getElementById('chat').lastChild.previousSibling.previousSibling;
    
            if(!lastMsg.classList.contains(message.userId)){
                chat.insertBefore(username, isTypingMsg)
            } else{
                msg.classList.add('followup-msg')
            }
            
            chat.insertBefore(msg, isTypingMsg)
            scrollToBottom()
        })
    
        socket.on('createConnectMessage', username => {
            let chat = document.getElementById('chat')
            let servermsg = document.createElement('span')
            servermsg.className = 'server-msg'
            servermsg.innerHTML = username + ' connected'
            chat.insertBefore(servermsg, isTypingMsg)
        })
    
        socket.on('createDisonnectMessage', username => {
            let chat = document.getElementById('chat')
            let servermsg = document.createElement('span')
            servermsg.className = 'server-msg'
            servermsg.innerHTML = username + ' disconnected'
            chat.insertBefore(servermsg, isTypingMsg)
        })
    
        socket.on('addTyper', userinfo => {
            if(userinfo.typingUserID !== myUserId){
                typingPeers.push(userinfo.typingUsername)
                updateTypingIndicator()
            }
        })
    
        socket.on('removeTyper', userinfo => {
            let index = typingPeers.indexOf(userinfo.typingUsername);
            typingPeers.splice(index, 1);
            updateTypingIndicator()
        })
    
    }).catch(err => {
        
        console.log(err)
    
    })
})

function timeoutFunction(){
    isTyping = false;
    socket.emit('stoppedTyping', myUsername);
  }

function updateTypingIndicator(){
    if(typingPeers.length == 0){
        isTypingMsg.innerHTML = '';
        isTypingMsg.style.display = 'none'
    } else if(typingPeers.length == 1){
        isTypingMsg.innerHTML = `<b>${typingPeers[0]}</b> is typing...`;
        isTypingMsg.style.display = 'block'
    } else if(typingPeers.length == 2){
        isTypingMsg.innerHTML = `<b>${typingPeers[0]}</b> and <b>${typingPeers[1]}</b> are typing...`;
        isTypingMsg.style.display = 'block'
    } else if(typingPeers.length == 3){
        isTypingMsg.innerHTML = `<b>${typingPeers[0]}</b>, <b>${typingPeers[1]}</b> and <b>${typingPeers[2]}</b> are typing...`;
        isTypingMsg.style.display = 'block'
    } else{
        isTypingMsg.innerHTML = `<b>Multiple people</b> are typing...`;
        isTypingMsg.style.display = 'block'
    }
}

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
        isTyping = false
        socket.emit('stoppedTyping', myUsername)
        clearTimeout(timeout)
    }
}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.autoplay = true
    video.poster = 'profile.png'
    videoGrid.append(video)
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
}

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream)
    console.log(peers)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        console.log('streaming ' + userId)
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        console.log('call closed')
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
    if(myUsername !== undefined) socket.emit('disconnect-message', myUsername)
};