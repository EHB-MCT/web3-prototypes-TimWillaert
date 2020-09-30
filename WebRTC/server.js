const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

app.set('view engine', 'ejs')
app.use(express.static('public'))

const peerServer = ExpressPeerServer(server, {
    debug: true
});
  
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create-room', (req, res) => {
    res.redirect('/' + uniqueNamesGenerator({ 
        dictionaries: [adjectives, colors, animals],
        separator: '-' 
    }))
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
    
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(process.env.PORT || 3000)