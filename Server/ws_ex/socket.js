const WebSocket = require('ws')
const shortid = require('shortid')


function Socket(server) {
    this.wss = new WebSocket.Server({server})
}

Socket.prototype.setUp = function() {
    this.onConnection()
}

Socket.prototype.onConnection = function() {
    this.wss.on('connection', function(ws, req) {
        console.log('a user connected')
        
        this.onMessage(ws)
        
        var newId = shortid.generate()
        var idObject = {
            type: 'id',
            id: newId
        }

        ws.send(JSON.stringify(idObject))
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
