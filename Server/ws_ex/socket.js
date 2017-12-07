const WebSocket = require('ws')
const shortid = require('shortid')


function Socket(server) {
    this.wss = new WebSocket.Server({server})
    this.heightSeed = Math.floor(Math.random() * 1000000)
    this.biomeSeed = Math.floor(Math.random() * 1000000)
}

Socket.prototype.setUp = function() {
    this.onConnection()
}

Socket.prototype.onConnection = function() {
    this.wss.on('connection', function(ws, req) {
        console.log('a user connected')
        
        this.onMessage(ws)
        
        var newId = shortid.generate()
        
        var initObject = {
            type: 'init',
            id: newId,
            heightSeed: this.heightSeed,
            biomeSeed: this.biomeSeed
        }

        ws.send(JSON.stringify(initObject))
    }.bind(this))
}

Socket.prototype.onMessage = function(ws) {
    ws.on('message', function(msg) {
        console.log('received: %s', msg)

        try {
            JSON.parse(msg)
            this.broadcast(ws, msg)
        }
        catch(err) {}
    }.bind(this))
}

Socket.prototype.broadcast = function(ws, msg) {
    this.wss.clients.forEach(function(client) {
        if(client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(msg)
        }
    })
}

exports.bind = function(server) {
    return new Socket(server)
}
