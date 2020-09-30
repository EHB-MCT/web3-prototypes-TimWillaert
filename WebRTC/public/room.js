const socket = io('/')
const videoGrid = document.getElementById('video-grid')

const roomCode = document.getElementById('room-code')
roomCode.innerHTML = ROOM_ID

const myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

let myVideoStream;
document.getElementById('unmute').style.display = 'none';
document.getElementById('showVideo').style.display = 'none';

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
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
})

socket.on('user-disconnected', userId => {
    console.log('User disconnected: ' + userId);
    if(peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

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
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
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

tippy('#copyCode', {
    content: 'Copied!',
    trigger: 'click',
    duration: 200
});

tippy('#copyCode', {
    content: 'Copy to clipboard',
});