const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home', {userCount: io.engine.clientsCount})
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
        console.log('User connected: ' + userId)

        socket.on('message', (message) => {
            io.to(roomId).emit('createMessage', message)
        })

        socket.on('connect-message', (username) => {
            io.to(roomId).emit('createConnectMessage', username)
        })

        socket.on('disconnect-message', (username) => {
            io.to(roomId).emit('createDisonnectMessage', username)
        })

        socket.on('startedTyping', (username) => {
            io.to(roomId).emit('addTyper', username)
        })

        socket.on('stoppedTyping', (username) => {
            io.to(roomId).emit('removeTyper', username)
        })
    
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
            console.log('User disconnected: ' + userId)
        })
    })
})

server.listen(process.env.PORT || 3000)