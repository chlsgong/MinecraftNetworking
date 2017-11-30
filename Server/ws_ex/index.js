const app = require('express')()
const server = require('http').createServer(app)
const socket = require('./socket.js').bind(server)


app.get('/', function(req, res) {
    res.send('hello')
})

// Socket

socket.setUp()

// Open server

server.listen(8080, function() {
    console.log('Listening on %d', server.address().port);    
})
